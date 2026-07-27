export async function updateLineup(supabase, managerId, players) {
  const updates = players.map((p) => ({
    player_id: p.player_id,
    is_starter: p.is_starter,
    bench_order: p.bench_order,
  }));

  const { error } = await supabase.rpc("update_lineup", {
    p_manager_id: managerId,
    p_updates: updates,
  });

  if (error) {
    throw new Error(error.message);
  }
}
