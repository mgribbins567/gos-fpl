import { useEffect, useState } from "react";
import { getCurrentSeason } from "../lib/matchupData";
import { getLeagues } from "../lib/leagueData";

export function useLeagues(supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const season = await getCurrentSeason(supabase);
      return getLeagues(supabase, season.id);
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
  }, [supabase]);

  return state;
}
