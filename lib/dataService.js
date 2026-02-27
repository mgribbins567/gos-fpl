import { supabase } from "../utils/supabase/supabaseClient";

/**
 * Gets full season data from the provided season ID
 * @param {*} seasonId season ID to query with
 * @returns season data from the season
 */
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
  `,
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

/**
 * Gets the full manager history for the provided manager
 * @param {*} managerId manager ID
 * @returns manager data from all seasons
 */
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

/**
 * Returns all data in which manager A and manager B were vs one another
 * @param {*} managerA manager A ID
 * @param {*} managerB manager B ID
 * @returns gameweek data from all matchups between the two managers
 */
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
  `,
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
