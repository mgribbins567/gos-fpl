export async function submitWaiverClaim(
  supabase,
  { leagueId, managerId, dropPlayerId, addPlayerId, gameweekId },
) {
  const { data: existing, error: fetchError } = await supabase
    .from("WaiverClaim")
    .select("priority")
    .eq("league_id", leagueId)
    .eq("manager_id", managerId)
    .eq("gameweek_id", gameweekId)
    .order("priority", { ascending: false })
    .limit(1);
  if (fetchError) throw new Error(fetchError.message);
  const nextPriority = (existing[0]?.priority ?? 0) + 1;

  const { error } = await supabase.from("WaiverClaim").insert({
    league_id: leagueId,
    manager_id: managerId,
    drop_player_id: dropPlayerId,
    add_player_id: addPlayerId,
    gameweek_id: gameweekId,
    priority: nextPriority,
    status: "pending",
  });
  if (error) throw new Error(error.message);
}

export async function getWaiverClaimsForManager(
  supabase,
  managerId,
  leagueId,
  gameweekId,
) {
  const { data, error } = await supabase
    .from("WaiverClaim")
    .select("*")
    .eq("manager_id", managerId)
    .eq("league_id", leagueId)
    .eq("gameweek_id", gameweekId)
    .eq("status", "pending")
    .order("priority", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteWaiverClaim(supabase, claimId) {
  const { error } = await supabase
    .from("WaiverClaim")
    .delete()
    .eq("id", claimId);
  if (error) throw new Error(error.message);
}

export async function reorderWaiverClaim(supabase, claimId, newPriority) {
  const { error } = await supabase.rpc("reorder_waiver_claim", {
    p_claim_id: claimId,
    p_new_priority: newPriority,
  });
  if (error) throw new Error(error.message);
}
