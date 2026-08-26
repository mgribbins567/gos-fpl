import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season";
import { gameweeksForSeasonQuery } from "./queries/leagueData";

export function useSeasonGameweeks(supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      return gameweeksForSeasonQuery.fetch(supabase, season.id);
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
