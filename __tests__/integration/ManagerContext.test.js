import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  adminClient,
  anonClient,
  createTestManager,
  cleanupTestManager,
} from "./setup";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "password123";
const TEST_MANAGER_NAME = "TestManager";

let testUserId;
let testManager;

beforeAll(async () => {
  const { userId, manager } = await createTestManager(
    TEST_EMAIL,
    TEST_MANAGER_NAME,
  );

  testUserId = userId;
  testManager = manager;
});

afterAll(async () => {
  await cleanupTestManager(testUserId, testManager.id);
});

describe("fetchManager integration", () => {
  it("returns manager for a linked user", async () => {
    const { data: manager, error } = await adminClient
      .from("Manager")
      .select("*")
      .eq("auth_id", testUserId)
      .single();

    expect(error).toBeNull();
    expect(manager.name).toBe(TEST_MANAGER_NAME);
  });

  it("returns PGRST116 for unlinked user", async () => {
    const { data, error } = await adminClient
      .from("Manager")
      .select("*")
      .eq("auth_id", "00000000-0000-0000-0000-000000000000")
      .single();

    expect(error.code).toBe("PGRST116");
    expect(data).toBeNull();
  });

  it("RLS blocks anon access to other users rows", async () => {
    const { data, error } = await anonClient
      .from("Manager")
      .select("*")
      .eq("auth_id", testUserId)
      .single();

    expect(data).toBeNull();
  });

  it("authenticated user can read their own manager row", async () => {
    const {
      data: { session },
    } = await anonClient.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: "password123",
    });

    const authedClient = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      },
    );

    const { data: manager, error } = await authedClient
      .from("Manager")
      .select("*")
      .eq("auth_id", session.user.id)
      .single();

    expect(error).toBeNull();
    expect(manager.name).toBe(TEST_MANAGER_NAME);
  });
});
