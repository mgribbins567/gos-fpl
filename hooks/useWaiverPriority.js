import { useEffect, useState } from "react";
import { getCurrentSeason } from "../lib/matchupData";
import {
  getManagersInLeague,
  getLeagueMatchupsForSeason,
  getDraftOrder,
} from "../lib/leagueData";
import { computeStandings } from "../lib/leagueLogic";
import { getWaiverPriorityOrder } from "../lib/waiverProcessing";

export function useWaiverPriority(leagueId, managerId, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!leagueId || !managerId || !supabase) return;
    let cancelled = false;

    async function load() {
      const season = await getCurrentSeason(supabase);
      const managersInLeague = await getManagersInLeague(
        supabase,
        leagueId,
        season.id,
      );
      const managerIds = [...managersInLeague.keys()];
      const matchups = await getLeagueMatchupsForSeason(
        supabase,
        leagueId,
        season.id,
      );
      const standings = computeStandings(matchups);
      const draftOrderByManagerId = await getDraftOrder(
        supabase,
        leagueId,
        season.id,
      );

      const order = getWaiverPriorityOrder(
        managerIds,
        managersInLeague,
        standings,
        draftOrderByManagerId,
      );
      const rank = order.indexOf(managerId) + 1;

      return { priority: rank || null, totalManagers: managerIds.length };
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
  }, [leagueId, managerId, supabase]);

  return state;
}
