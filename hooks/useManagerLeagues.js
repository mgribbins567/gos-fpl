import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season";
import { getLeaguesForManager } from "../lib/leagueData";

export function useManagerLeagues(manager, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!manager) return;
    let cancelled = false;

    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      return getLeaguesForManager(supabase, manager.id, season.id);
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
