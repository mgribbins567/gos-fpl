export async function setTradeBlockEntry(
  supabase,
  { leagueId, seasonId, playerId, willingness },
) {
  const { error } = await supabase.rpc("set_trade_block_entry", {
    p_league_id: leagueId,
    p_season_id: seasonId,
    p_player_id: playerId,
    p_willingness: willingness,
  });
  if (error) throw new Error(error.message);
}

export async function removeTradeBlockEntry(
  supabase,
  { leagueId, seasonId, playerId },
) {
  const { error } = await supabase.rpc("remove_trade_block_entry", {
    p_league_id: leagueId,
    p_season_id: seasonId,
    p_player_id: playerId,
  });
  if (error) throw new Error(error.message);
}

export async function getLeagueTradeBlock(supabase, { leagueId, seasonId }) {
  const { data, error } = await supabase
    .from("TradeBlock")
    .select("id, player_id, manager_id, willingness")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return data;
}
