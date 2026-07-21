export async function getCurrentSeason(supabase) {
  const { data, error } = await supabase
    .from("Season")
    .select("*")
    .eq("is_current", true)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getGameweekByNumber(supabase, seasonId, gameweekNumber) {
  const { data, error } = await supabase
    .from("Gameweek")
    .select("*")
    .eq("season_id", seasonId)
    .eq("gameweek", gameweekNumber)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getManagerByName(supabase, name) {
  const { data, error } = await supabase
    .from("Manager")
    .select("*")
    .eq("name", name)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getMatchupForManager(supabase, gameweekId, managerName) {
  const { data, error } = await supabase
    .from("Matchup")
    .select("*")
    .eq("gameweek_id", gameweekId)
    .or(`manager_1.eq.${managerName},manager_2.eq.${managerName}`);
  if (error) {
    throw new Error(error.message);
  }
  return data[0] ?? null;
}

export function toMatchupSummary(matchup, managerName) {
  if (!matchup) {
    return null;
  }
  const isManager1 = matchup.manager_1 === managerName;
  return {
    self: {
      name: managerName,
      score: isManager1 ? matchup.manager_1_score : matchup.manager_2_score,
    },
    opponent: {
      name: isManager1 ? matchup.manager_2 : matchup.manager_1,
      score: isManager1 ? matchup.manager_2_score : matchup.manager_1_score,
    },
    winner: matchup.winner,
  };
}
