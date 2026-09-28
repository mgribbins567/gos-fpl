import { useCallback, useEffect, useMemo, useState } from "react";
import {
  setTradeBlockEntry,
  removeTradeBlockEntry,
  getLeagueTradeBlock,
} from "../lib/tradeBlockData";

export function useTradeBlockData({ leagueId, seasonId, supabase }) {
  const [entries, setEntries] = useState(undefined);
  const [error, setError] = useState(null);
  const ready = Boolean(leagueId && seasonId);

  const refresh = useCallback(async () => {
    if (!ready) return;
    try {
      const data = await getLeagueTradeBlock(supabase, {
        leagueId,
        seasonId,
      });
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  }, [ready, supabase, leagueId, seasonId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const entriesByPlayerId = useMemo(
    () => new Map((entries ?? []).map((e) => [Number(e.player_id), e])),
    [entries],
  );

  const getEntry = useCallback(
    (playerId) => entriesByPlayerId.get(Number(playerId)),
    [entriesByPlayerId],
  );

  const setWillingness = useCallback(
    async (playerId, willingness) => {
      await setTradeBlockEntry(supabase, {
        leagueId,
        seasonId,
        playerId: Number(playerId),
        willingness,
      });
      await refresh();
    },
    [supabase, leagueId, seasonId, refresh],
  );

  const removeEntry = useCallback(
    async (playerId) => {
      await removeTradeBlockEntry(supabase, {
        leagueId,
        seasonId,
        playerId: Number(playerId),
      });
      await refresh();
    },
    [supabase, leagueId, seasonId, refresh],
  );

  return { entries, getEntry, setWillingness, removeEntry, error };
}
