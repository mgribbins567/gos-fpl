import { useEffect, useState } from "react";
import { buildResolvedTrades } from "../lib/tradeLogic";
import { pendingTradesForReceiverQuery } from "./queries/tradeData";

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
    pendingTradesForReceiverQuery
      .fetch(supabase, manager.id)
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
