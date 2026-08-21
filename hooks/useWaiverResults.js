import { useEffect, useState } from "react";
import {
  getLeagueMatchupsForSeason,
  getManagersInLeague,
  getDraftOrder,
} from "../lib/leagueData";
import { computeStandings } from "../lib/leagueLogic";
import {
  buildWaiverProcessingOrder,
  computeWaiverDisplayOrder,
} from "../lib/waiverProcessing";

export function useWaiverResults(league, gameweekId, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!league || !gameweekId) return;
    let cancelled = false;

    async function load() {
      const { data: gameweek, error: gwError } = await supabase
        .from("Gameweek")
        .select("season_id")
        .eq("id", gameweekId)
        .single();
      if (gwError) throw new Error(gwError.message);

      const { data: claims, error: claimsError } = await supabase
        .from("WaiverClaim")
        .select("*")
        .eq("league_id", league.id)
        .eq("gameweek_id", gameweekId)
        .neq("status", "pending")
        .order("priority", { ascending: true });
      if (claimsError) throw new Error(claimsError.message);

      if (claims.length === 0) return [];

      const [matchups, managersInLeague, draftOrderByManagerId] =
        await Promise.all([
          getLeagueMatchupsForSeason(supabase, league.id, gameweek.season_id),
          getManagersInLeague(supabase, league.id, gameweek.season_id),
          getDraftOrder(supabase, league.id, gameweek.season_id),
        ]);
      const standings = computeStandings(matchups);

      const order = buildWaiverProcessingOrder(
        claims,
        standings,
        managersInLeague,
        draftOrderByManagerId,
      );

      return computeWaiverDisplayOrder(claims, order);
    }

    load()
      .then((data) => !cancelled && setState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [league, gameweekId, supabase]);

  return state;
}
