export async function getGameweekLineup(supabase, managerId, gameweekId) {
  const { data, error } = await supabase
    .from("GameweekLineup")
    .select("*")
    .eq("manager_id", managerId)
    .eq("gameweek_id", gameweekId);
  if (error) throw new Error(error.message);
  return data;
}

export async function getGameweekLineupsForManagers(
  supabase,
  managerIds,
  gameweekId,
) {
  const { data, error } = await supabase
    .from("GameweekLineup")
    .select("*")
    .eq("gameweek_id", gameweekId)
    .in("manager_id", managerIds);
  if (error) throw new Error(error.message);
  const byManagerId = new Map();
  for (const row of data) {
    if (!byManagerId.has(row.manager_id)) byManagerId.set(row.manager_id, []);
    byManagerId.get(row.manager_id).push(row);
  }
  return byManagerId;
}
