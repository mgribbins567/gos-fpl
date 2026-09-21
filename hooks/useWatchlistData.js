import { useCallback, useEffect, useState, useMemo } from "react";
import {
  addToWatchlist,
  removeWatchlistEntry,
  reorderWatchlistEntry,
  getWatchlist,
} from "../lib/watchlistData";

export function useWatchlistData({ leagueId, seasonId, managerId, supabase }) {
  const [entries, setEntries] = useState(undefined);
  const [error, setError] = useState(null);
  const ready = Boolean(leagueId && seasonId && managerId);

  const refresh = useCallback(async () => {
    if (!ready) return;
    try {
      const data = await getWatchlist(supabase, {
        leagueId,
        seasonId,
        managerId,
      });
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  }, [ready, supabase, leagueId, seasonId, managerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const watchlistedPlayerIds = useMemo(
    () => new Set((entries ?? []).map((e) => Number(e.player_id))),
    [entries],
  );

  const isWatchlisted = useCallback(
    (playerId) => watchlistedPlayerIds.has(Number(playerId)),
    [watchlistedPlayerIds],
  );

  const toggle = useCallback(
    async (rawPlayerId) => {
      if (!ready) return;
      const playerId = Number(rawPlayerId);
      const existing = entries?.find((e) => Number(e.player_id) === playerId);
      try {
        if (existing) {
          await removeWatchlistEntry(supabase, existing.id);
        } else {
          await addToWatchlist(supabase, {
            leagueId,
            seasonId,
            managerId,
            playerId,
          });
        }
        await refresh();
      } catch (err) {
        setError(err.message);
      }
    },
    [ready, entries, supabase, leagueId, seasonId, managerId, refresh],
  );

  const reorder = useCallback(
    async (entry, newRank) => {
      try {
        await reorderWatchlistEntry(supabase, entry.id, newRank);
        await refresh();
      } catch (err) {
        setError(err.message);
      }
    },
    [supabase, refresh],
  );

  const remove = useCallback(
    async (entry) => {
      try {
        await removeWatchlistEntry(supabase, entry.id);
        await refresh();
      } catch (err) {
        setError(err.message);
      }
    },
    [supabase, refresh],
  );

  return {
    entries,
    watchlistedPlayerIds,
    isWatchlisted,
    toggle,
    reorder,
    remove,
    error,
  };
}
