export async function addToWatchlist(
  supabase,
  { leagueId, seasonId, managerId, playerId },
) {
  const { data: existing, error: fetchError } = await supabase
    .from("PlayerWatchlist")
    .select("rank")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId)
    .eq("manager_id", managerId)
    .order("rank", { ascending: false })
    .limit(1);
  if (fetchError) throw new Error(fetchError.message);
  const nextRank = (existing[0]?.rank ?? 0) + 1;

  const { error } = await supabase.from("PlayerWatchlist").insert({
    league_id: leagueId,
    season_id: seasonId,
    manager_id: managerId,
    player_id: playerId,
    rank: nextRank,
  });
  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function getWatchlist(
  supabase,
  { leagueId, seasonId, managerId },
) {
  const { data, error } = await supabase
    .from("PlayerWatchlist")
    .select("id, player_id, rank")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId)
    .eq("manager_id", managerId)
    .order("rank", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function removeWatchlistEntry(supabase, entryId) {
  const { error } = await supabase.rpc("remove_watchlist_entry", {
    p_entry_id: entryId,
  });
  if (error) throw new Error(error.message);
}

export async function reorderWatchlistEntry(supabase, entryId, newRank) {
  const { error } = await supabase.rpc("reorder_watchlist_entry", {
    p_entry_id: entryId,
    p_new_rank: newRank,
  });
  if (error) throw new Error(error.message);
}
