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
  if (error) throw new Error(error.message);
}

export async function removeFromWatchlist(
  supabase,
  { leagueId, seasonId, managerId, playerId },
) {
  const { error } = await supabase
    .from("PlayerWatchlist")
    .delete()
    .eq("league_id", leagueId)
    .eq("season_id", seasonId)
    .eq("manager_id", managerId)
    .eq("player_id", playerId);
  if (error) throw new Error(error.message);
}

export async function getWatchlist(
  supabase,
  { leagueId, seasonId, managerId },
) {
  const { data, error: error } = await supabase
    .from("PlayerWatchlist")
    .select("player_id")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId)
    .eq("manager_id", managerId);
  if (error) throw new Error(error.message);
  return data.map((row) => row.player_id);
}
