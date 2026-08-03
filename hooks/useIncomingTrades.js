import { useEffect, useState } from "react";
import { getPendingTradesForReceiver } from "../lib/tradeData";
import { buildResolvedTrades } from "../lib/tradeLogic";

export function useIncomingTrades(
  manager,
  supabase,
  bootstrap,
  leagueManagersById,
  refreshKey,
) {
  const [state, setState] = useState({ data: undefined, error: null });
  useEffect(() => {
    if (!manager || !bootstrap || !leagueManagersById) return;
    let cancelled = false;
    getPendingTradesForReceiver(supabase, manager.id)
      .then(
        ({ trades, pairings }) =>
          !cancelled &&
          setState({
            data: buildResolvedTrades(
              trades,
              pairings,
              bootstrap,
              leagueManagersById,
            ),
            error: null,
          }),
      )
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [manager, supabase, bootstrap, leagueManagersById, refreshKey]);
  return state;
}
