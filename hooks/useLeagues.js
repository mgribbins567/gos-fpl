import { useEffect, useState } from "react";
import { leaguesQuery } from "./queries/leagueData";

export function useLeagues(supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      return leaguesQuery.fetch(supabase);
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
