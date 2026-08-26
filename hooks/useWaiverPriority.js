import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season";
import { computeStandings } from "../lib/leagueLogic";
import { getWaiverPriorityOrder } from "../lib/waiverProcessing";
import {
  draftOrderQuery,
  leagueMatchupsForSeasonQuery,
  managersInLeagueQuery,
} from "./queries/leagueData";

export function useWaiverPriority(leagueId, managerId, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!leagueId || !managerId || !supabase) return;
    let cancelled = false;

    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      const managersInLeague = await managersInLeagueQuery.fetch(
        supabase,
        leagueId,
        season.id,
      );
      const managerIds = [...managersInLeague.keys()];
      const matchups = await leagueMatchupsForSeasonQuery.fetch(
        supabase,
        leagueId,
        season.id,
      );
      const standings = computeStandings(matchups);
      const draftOrderByManagerId = await draftOrderQuery.fetch(
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
