export async function getLeaguesForManager(supabase, managerId, seasonId) {
  const { data, error } = await supabase
    .from("LeagueManager")
    .select("League(id, name)")
    .eq("manager_id", managerId)
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return data.map((row) => row.League);
}

export async function getLeagueMatchups(supabase, leagueId, gameweekId) {
  const { data, error } = await supabase
    .from("Matchup")
    .select("*")
    .eq("league_id", leagueId)
    .eq("gameweek_id", gameweekId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getLeagueMatchupsForSeason(supabase, leagueId, seasonId) {
  const { data, error } = await supabase
    .from("Matchup")
    .select("*, Gameweek!inner(season_id, gameweek)")
    .eq("league_id", leagueId)
    .eq("Gameweek.season_id", seasonId);
  if (error) throw new Error(error.message);
  return data.map((row) => ({ ...row, gameweekNumber: row.Gameweek.gameweek }));
}

export async function getManagersByNames(supabase, names) {
  const { data, error } = await supabase
    .from("Manager")
    .select("*")
    .in("name", names);
  if (error) throw new Error(error.message);
  return new Map(data.map((m) => [m.name, m]));
}

export async function getTeamsForManagers(supabase, managerIds) {
  const { data, error } = await supabase
    .from("team_players")
    .select("*")
    .in("manager_id", managerIds);
  if (error) throw new Error(error.message);
  const teamsByManagerId = new Map();
  for (const row of data) {
    if (!teamsByManagerId.has(row.manager_id))
      teamsByManagerId.set(row.manager_id, []);
    teamsByManagerId.get(row.manager_id).push(row);
  }
  return teamsByManagerId;
}

export async function getLeagueRoster(supabase, leagueId) {
  const { data, error } = await supabase
    .from("team_players")
    .select("player_id, manager_id")
    .eq("league_id", leagueId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getPlayerAvailability(supabase, leagueId) {
  const { data, error } = await supabase
    .from("PlayerAvailability")
    .select("player_id, Gameweek!inner(gameweek)")
    .eq("league_id", leagueId);
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    player_id: row.player_id,
    unavailableUntilGameweek: row.Gameweek.gameweek,
  }));
}
