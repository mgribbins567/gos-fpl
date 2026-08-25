import { useEffect, useState } from "react";
import { currentSeasonQuery } from "./queries/season";
import { getGameweekByNumber } from "../lib/matchupData";

export function useTransactionGameweeks(bootstrap, context, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!bootstrap) return;
    let cancelled = false;

    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      const gameweek = await getGameweekByNumber(
        supabase,
        season.id,
        context.upcoming.event.id,
      );
      const nextGameweek = await getGameweekByNumber(
        supabase,
        season.id,
        context.upcoming.event.id + 1,
      );
      return { gameweekId: gameweek.id, nextGameweekId: nextGameweek.id };
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
  }, [bootstrap, context, supabase]);
  return state;
}
