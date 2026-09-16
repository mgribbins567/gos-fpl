import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season.js";

export function useCurrentSeason(supabase) {
  const [seasonId, setSeasonId] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    currentSeasonQuery
      .fetch(supabase)
      .then((season) => {
        if (!cancelled) setSeasonId(season?.id);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return { seasonId, error };
}
