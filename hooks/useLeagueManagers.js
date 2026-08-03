import { useEffect, useState } from "react";
import { getCurrentSeason } from "../lib/matchupData";
import { getManagersInLeague } from "../lib/leagueData";

export function useLeagueManagers(league, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });
  useEffect(() => {
    if (!league) return;
    let cancelled = false;
    async function load() {
      const season = await getCurrentSeason(supabase);
      return getManagersInLeague(supabase, league.id, season.id);
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
  }, [league, supabase]);
  return state;
}
