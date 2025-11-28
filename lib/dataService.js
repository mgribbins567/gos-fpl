import prisma from "../lib/prisma";
import { supabase } from "../supabaseClient";

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

  if (!seasonData) {
    throw new Error("Season data not found for ID: " + seasonId);
  }

  return seasonData;
}
