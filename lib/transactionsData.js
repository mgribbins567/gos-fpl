export async function signFreeAgent(
  supabase,
  {
    leagueId,
    managerId,
    dropPlayerId,
    addPlayerId,
    gameweekId,
    nextGameweekId,
  },
) {
  const { error } = await supabase.rpc("sign_free_agent", {
    p_league_id: leagueId,
    p_manager_id: managerId,
    p_drop_player_id: dropPlayerId,
    p_add_player_id: addPlayerId,
    p_gameweek_id: gameweekId,
    p_next_gameweek_id: nextGameweekId,
  });
  if (error) throw new Error(error.message);
}
