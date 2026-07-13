import { createClient } from "@supabase/supabase-js";

// Admin client — bypasses RLS, used for seeding/teardown only
export const adminClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
);

// Anon client — respects RLS, used in actual tests
export const anonClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

async function maybeCleanupStaleManager(email) {
  const {
    data: { users },
  } = await adminClient.auth.admin.listUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    const { data: staleManager } = await adminClient
      .from("Manager")
      .select("id")
      .eq("auth_id", existing.id)
      .single();

    if (staleManager) {
      await adminClient
        .from("team_players")
        .delete()
        .eq("manager_id", staleManager.id);
      await adminClient.from("Manager").delete().eq("id", staleManager.id);
    }

    await adminClient.auth.admin.deleteUser(existing.id);
  }
}

export async function createTestManager(email, name) {
  await maybeCleanupStaleManager(email);
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: "password123",
    email_confirm: true,
  });
  if (error) throw new Error(`Auth user creation failed: ${error.message}`);

  const { data: manager, error: managerError } = await adminClient
    .from("Manager")
    .insert({ name, auth_id: data.user.id })
    .select()
    .single();
  if (managerError)
    throw new Error(`Manager creation failed: ${managerError.message}`);

  return { userId: data.user.id, manager };
}

export async function cleanupTestManager(userId, managerId) {
  await adminClient.from("team_players").delete().eq("manager_id", managerId);
  await adminClient.from("Manager").delete().eq("id", managerId);
  await adminClient.auth.admin.deleteUser(userId);
}
