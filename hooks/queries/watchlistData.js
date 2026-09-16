import { useSupabaseQuery } from "./useSupabaseQuery";
import { defineQuery } from "./defineQuery";
import { STALE_TIME } from "../../lib/queryConfig";
import { getWatchlist } from "../../lib/watchlistData";

export function useWatchlist(supabase, leagueId, seasonId, managerId) {
  return useSupabaseQuery(
    ["watchlist", leagueId, seasonId, managerId],
    () => getWatchlist(supabase, { leagueId, seasonId, managerId }),
    {
      staleTime: STALE_TIME.VERY_FAST,
    },
  );
}

export const watchlistQuery = defineQuery(
  (supabase, leagueId, seasonId, managerId) => [
    "watchlist",
    leagueId,
    seasonId,
    managerId,
  ],
  (supabase, leagueId, seasonId, managerId) =>
    getWatchlist(supabase, { leagueId, seasonId, managerId }),
  STALE_TIME.VERY_FAST,
);
