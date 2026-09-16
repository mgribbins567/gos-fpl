import { useCallback, useEffect, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "../lib/watchlistData";
import { watchlistQuery } from "./queries/watchlistData";

export function useWatchlistData({ leagueId, seasonId, managerId, supabase }) {
  const [playerIds, setPlayerIds] = useState(() => new Set());
  const [error, setError] = useState(null);
  const ready = Boolean(leagueId && seasonId && managerId);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await watchlistQuery.fetch(
          supabase,
          leagueId,
          seasonId,
          managerId,
        );
        if (cancelled) return;
        setPlayerIds(new Set(data.map((id) => Number(id))));
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ready, leagueId, seasonId, managerId, supabase]);

  const isWatchlisted = useCallback(
    (playerId) => playerIds.has(Number(playerId)),
    [playerIds],
  );

  const toggle = useCallback(
    async (rawPlayerId) => {
      if (!ready) return;
      const playerId = Number(rawPlayerId);
      const wasWatched = playerIds.has(playerId);

      setPlayerIds((prev) => {
        const next = new Set(prev);
        wasWatched ? next.delete(playerId) : next.add(playerId);
        return next;
      });

      try {
        if (wasWatched) {
          await removeFromWatchlist(supabase, {
            leagueId,
            seasonId,
            managerId,
            playerId,
          });
        } else {
          await addToWatchlist(supabase, {
            leagueId,
            seasonId,
            managerId,
            playerId,
          });
        }
      } catch (err) {
        setPlayerIds((prev) => {
          const reverted = new Set(prev);
          wasWatched ? reverted.add(playerId) : reverted.delete(playerId);
          return reverted;
        });
        setError(err.message);
      }
    },
    [ready, playerIds, leagueId, seasonId, managerId, supabase],
  );

  return { isWatchlisted, toggle, error, watchlistedPlayerIds: playerIds };
}
