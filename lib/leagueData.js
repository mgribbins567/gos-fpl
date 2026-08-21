export async function getLeaguesForManager(supabase, managerId, seasonId) {
  const { data, error } = await supabase
    .from("LeagueManager")
    .select("League(id, name)")
    .eq("manager_id", managerId)
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return data.map((row) => row.League);
}

export async function getLeagues(supabase, seasonId) {
  const { data, error } = await supabase.from("League").select("*");
  if (error) throw new Error(error.message);
  return data;
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

export async function getCupMatchups(supabase, gameweekId) {
  const { data, error } = await supabase
    .from("CupMatchup")
    .select("*")
    .eq("gameweek_id", gameweekId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getCupMatchupsByCup(supabase, cupName) {
  const { data, error } = await supabase
    .from("CupMatchup")
    .select("*")
    .eq("cup_name", cupName);
  if (error) throw new Error(error.message);
  return data;
}

export async function getCupMatchupsByRound(
  supabase,
  seasonId,
  cupName,
  roundId,
  teamAId,
  teamBId,
) {
  const { data, error } = await supabase
    .from("CupMatchup")
    .select("*")
    .eq("season_id", seasonId)
    .eq("cup_name", cupName)
    .eq("round_id", roundId)
    .or(
      `and(home_team_id.eq.${teamAId},away_team_id.eq.${teamBId}),` +
        `and(home_team_id.eq.${teamBId},away_team_id.eq.${teamAId})`,
    );
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

export async function getTeamsForManagersByGameweek(
  supabase,
  managerIds,
  gameweekId,
) {
  const { data, error } = await supabase
    .from("GameweekLineup")
    .select("*")
    .in("manager_id", managerIds)
    .eq("gameweek_id", gameweekId);
  if (error) throw new Error(error.message);
  const teamsByManagerId = new Map();
  for (const row of data) {
    if (!teamsByManagerId.has(row.manager_id))
      teamsByManagerId.set(row.manager_id, []);
    teamsByManagerId.get(row.manager_id).push(row);
  }
  return teamsByManagerId;
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

export async function getManagersInLeague(supabase, leagueId, seasonId) {
  const { data, error } = await supabase
    .from("LeagueManager")
    .select("Manager(id, name, short_name)")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return new Map(data.map((row) => [row.Manager.id, row.Manager]));
}

export async function getManagers(supabase, seasonId) {
  const { data, error } = await supabase
    .from("LeagueManager")
    .select("Manager(id, name, short_name)")
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return new Map(data.map((row) => [row.Manager.id, row.Manager]));
}

export async function getEarliestLeagueGameweekNumber(supabase, seasonId) {
  const { data, error } = await supabase
    .from("Gameweek")
    .select("gameweek, GameweekLineup!inner(id)")
    .eq("season_id", seasonId)
    .order("gameweek", { ascending: true })
    .limit(1);
  if (error) throw new Error(error.message);
  return data.length === 0 ? null : data[0].gameweek;
}

export async function getLatestLeagueGameweekNumber(supabase, seasonId) {
  const { data, error } = await supabase
    .from("Gameweek")
    .select("gameweek")
    .eq("season_id", seasonId)
    .order("gameweek", { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return data.length === 0 ? null : data[0].gameweek;
}

export async function getCupGameweekBounds(supabase, seasonId, cupName) {
  const { data, error } = await supabase
    .from("CupMatchup")
    .select("gameweek_id, Gameweek!inner(gameweek)")
    .eq("season_id", seasonId)
    .eq("cup_name", cupName);
  if (error) throw new Error(error.message);

  if (data.length === 0) return null;

  const gameweekNumbers = data.map((row) => row.Gameweek.gameweek);
  return {
    earliest: Math.min(...gameweekNumbers),
    latest: Math.max(...gameweekNumbers),
  };
}

export async function getDraftOrder(supabase, leagueId, seasonId) {
  const { data, error } = await supabase
    .from("DraftOrder")
    .select("manager_id, draft_position")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId);
  if (error) throw new Error(error.message);
  return new Map(data.map((row) => [row.manager_id, row.draft_position]));
}

export async function getGameweeksForSeason(supabase, seasonId) {
  const { data, error } = await supabase
    .from("Gameweek")
    .select("id, gameweek")
    .eq("season_id", seasonId)
    .order("gameweek", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}
