import { defineQuery } from "./defineQuery.js";
import { useSupabaseQuery } from "./useSupabaseQuery.js";
import { getCurrentSeason } from "../../lib/matchupData.js";
import { STALE_TIME } from "../../lib/queryConfig.js";

export function useCurrentSeason(supabase) {
  return useSupabaseQuery(["currentSeason"], () => getCurrentSeason(supabase), {
    staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
  });
}

export const currentSeasonQuery = defineQuery(
  () => ["currentSeason"],
  (supabase) => getCurrentSeason(supabase),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);
