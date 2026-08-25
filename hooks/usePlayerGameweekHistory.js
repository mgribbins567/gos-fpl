import { useEffect, useState } from "react";
import { usePlayerHistory, useBootstrapStatic } from "./useFplData";
import { currentSeasonQuery } from "./queries/season";
import { getPlayerOwnershipHistory } from "../lib/teamHistory";
import { getManagers, getManagerLeagueIds } from "../lib/leagueData";
import { buildPlayerGameweekHistory } from "../lib/fplData";

export function usePlayerGameweekHistory(playerId, supabase) {
  const { data: summary, error: historyError } = usePlayerHistory(playerId);
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const [ownership, setOwnership] = useState({
    rows: undefined,
    managers: undefined,
    managerLeagues: undefined,
    error: null,
  });

  useEffect(() => {
    if (!playerId || !supabase) return;
    let cancelled = false;
    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      const [rows, managers, managerLeagues] = await Promise.all([
        getPlayerOwnershipHistory(supabase, season.id, playerId),
        getManagers(supabase, season.id),
        getManagerLeagueIds(supabase, season.id),
      ]);
      return { rows, managers, managerLeagues };
    }
    load()
      .then((result) => !cancelled && setOwnership({ ...result, error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setOwnership({
            rows: undefined,
            managers: undefined,
            managerLeagues: undefined,
            error: err.message,
          }),
      );
    return () => {
      cancelled = true;
    };
  }, [playerId, supabase]);

  const ready =
    summary?.history &&
    bootstrap &&
    ownership.rows &&
    ownership.managers &&
    ownership.managerLeagues;

  const table = ready
    ? buildPlayerGameweekHistory({
        history: summary.history,
        bootstrap,
        ownershipRows: ownership.rows,
        managers: ownership.managers,
        managerLeagues: ownership.managerLeagues,
      })
    : undefined;

  return {
    rows: table?.rows,
    ownerColumns: table?.ownerColumns,
    totals: table?.totals,
    error: historyError || bootstrapError || ownership.error,
  };
}
