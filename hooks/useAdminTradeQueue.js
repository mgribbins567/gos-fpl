import { useEffect, useState } from "react";
import {
  getPendingTradesForAdmin,
  getManagersByIds,
  getLeaguesByIds,
} from "../lib/tradeData";
import { buildResolvedTrades } from "../lib/tradeLogic";

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
      const { trades, pairings } = await getPendingTradesForAdmin(supabase);
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
        getManagersByIds(supabase, managerIds),
        getLeaguesByIds(supabase, leagueIds),
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
