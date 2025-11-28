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
