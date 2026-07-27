export async function getGameweekLineup(supabase, managerId, gameweekId) {
  const { data, error } = await supabase
    .from("GameweekLineup")
    .select("*")
    .eq("manager_id", managerId)
    .eq("gameweek_id", gameweekId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getEarliestRecordedGameweekNumber(
  supabase,
  managerId,
  seasonId,
) {
  const { data, error } = await supabase
    .from("GameweekLineup")
    .select("Gameweek!inner(gameweek, season_id)")
    .eq("manager_id", managerId)
    .eq("Gameweek.season_id", seasonId)
    .order("gameweek", { foreignTable: "Gameweek", ascending: true })
    .limit(1);
  if (error) throw new Error(error.message);
  return data.length === 0 ? null : data[0].Gameweek.gameweek;
}
