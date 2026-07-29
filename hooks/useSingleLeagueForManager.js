import { useEffect, useState } from "react";
import { getCurrentSeason } from "../lib/matchupData";
import { getLeaguesForManager } from "../lib/leagueData";

export function useSingleLeagueForManager(manager, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!manager) return;
    let cancelled = false;

    async function load() {
      const season = await getCurrentSeason(supabase);
      const leagues = await getLeaguesForManager(
        supabase,
        manager.id,
        season.id,
      );
      if (leagues.length !== 1) {
        throw new Error(
          `Expected manager to belong to exactly one league (found ${leagues.length}). `,
        );
      }
      return leagues[0];
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
  }, [manager, supabase]);

  return state;
}
