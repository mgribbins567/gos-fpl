import { supabase } from "../utils/supabase/supabaseClient";

export async function getArchivedSeasonData(seasonId) {
  const { data: seasonData, error } = await supabase
    .from("Season")
    .select(
      `
    *,
    Gameweek (
      *,
      Matchup (
        *
      )
    )
  `
    )
    .eq("id", seasonId)
    .order("gameweek", { referencedTable: "Gameweek", ascending: true })
    .order("id", { referencedTable: "Gameweek.Matchup", ascending: true })
    .single();

  if (error) {
    console.error(error);
  }

  return seasonData;
}

export async function getManagerHistoryData(managerId) {
  const { data: data, error } = await supabase
    .from("SeasonRanking")
    .select(`*, Season (year)`)
    .eq("manager", managerId);

  if (error) {
    console.error(error);
  }
  const managerData = data
    ?.map((ranking) => ({
      ...ranking,
      year: ranking.Season?.year,
      Season: undefined,
    }))
    .sort((a, b) => a.year - b.year);

  return managerData;
}

export async function getManagerMatchupData(managerA, managerB) {
  const { data: data, error } = await supabase
    .from("Matchup")
    .select(
      `
    *,
    Gameweek (
      season_id,
      gameweek,
      Season (
        year
      )
    )
  `
    )
    .in("manager_1", [managerA, managerB])
    .in("manager_2", [managerA, managerB])
    .order("year", { referencedTable: "Gameweek.Season", ascending: true })
    .order("gameweek", { referencedTable: "Gameweek", ascending: true });

  if (error) {
    console.error(error);
  }

  return data;
}
