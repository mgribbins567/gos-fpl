import { useEffect, useState } from "react";
import { buildResolvedTrades } from "../lib/tradeLogic";
import {
  leaguesByIdsQuery,
  managersByIdsQuery,
  pendingTradesForAdminQuery,
} from "./queries/tradeData";

export function useAdminTradeQueue(
  isAdminUser,
  supabase,
  bootstrap,
  refreshKey,
) {
  const [state, setState] = useState({ data: undefined, error: null });
  useEffect(() => {
    if (!isAdminUser || !bootstrap) return;
    let cancelled = false;
    async function load() {
      const { trades, pairings } =
        await pendingTradesForAdminQuery.fetch(supabase);
      if (trades.length === 0) return [];
      const managerIds = [
        ...new Set(
          trades.flatMap((t) => [
            t.proposing_manager_id,
            t.receiving_manager_id,
          ]),
        ),
      ];
      const leagueIds = [...new Set(trades.map((t) => t.league_id))];
      const [managersById, leaguesById] = await Promise.all([
        managersByIdsQuery.fetch(supabase, managerIds),
        leaguesByIdsQuery.fetch(supabase, leagueIds),
      ]);
      return buildResolvedTrades(
        trades,
        pairings,
        bootstrap,
        managersById,
        leaguesById,
      );
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
  }, [isAdminUser, supabase, bootstrap, refreshKey]);
  return state;
}
