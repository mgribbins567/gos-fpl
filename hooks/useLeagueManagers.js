import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season";
import { managersInLeagueQuery } from "./queries/leagueData";

export function useLeagueManagers(leagueId, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });
  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;
    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      return managersInLeagueQuery.fetch(supabase, leagueId, season.id);
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
  }, [leagueId, supabase]);
  return state;
}
