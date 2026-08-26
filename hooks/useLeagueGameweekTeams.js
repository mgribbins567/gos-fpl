import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "./useFplData";
import { currentSeasonQuery } from "./queries/season";
import { getActiveGameweekContext } from "../lib/gameweek";
import { resolveGameweekKind } from "../lib/gameweekNavigation";
import { getGameweekByNumber } from "../lib/matchupData";
import { getGameweekLineupsForManagers } from "../lib/teamHistory";
import { resolvePlayersForGameweek } from "../lib/lineup";
import { attachFixtureStatus } from "../lib/fplData";
import {
  managersInLeagueQuery,
  teamsForManagersQuery,
} from "./queries/leagueData";

export function useLeagueGameweekTeams(
  leagueId,
  gameweekNumber,
  fixtures,
  supabase,
) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const context = useMemo(
    () => (bootstrap ? getActiveGameweekContext(bootstrap) : undefined),
    [bootstrap],
  );
  const kind = useMemo(
    () => resolveGameweekKind(context, gameweekNumber),
    [context, gameweekNumber],
  );

  const [gameweekRow, setGameweekRow] = useState(undefined);
  const [rowError, setRowError] = useState(null);

  useEffect(() => {
    if (!supabase || !gameweekNumber) return;
    let cancelled = false;
    async function loadRow() {
      const season = await currentSeasonQuery.fetch(supabase);
      return getGameweekByNumber(supabase, season.id, gameweekNumber);
    }
    loadRow()
      .then((row) => !cancelled && setGameweekRow(row))
      .catch((err) => !cancelled && setRowError(err.message));
    return () => {
      cancelled = true;
    };
  }, [supabase, gameweekNumber]);

  const isPendingFinalization =
    kind === "historical" && gameweekRow && !gameweekRow.data_checked;
  const shouldPollLive = kind === "current" || isPendingFinalization;
  const { data: live, error: liveError } = useLiveEvent(gameweekNumber, {
    poll: shouldPollLive,
  });

  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!leagueId || !bootstrap || !gameweekRow || !kind || !live || !fixtures)
      return;

    let cancelled = false;

    async function load() {
      const season = await currentSeasonQuery.fetch(supabase);
      const managersInLeague = await managersInLeagueQuery.fetch(
        supabase,
        leagueId,
        season.id,
      );
      const managerIds = [...managersInLeague.keys()];

      let rosterRowsByManagerId;
      let autoSub = false;

      if (kind === "upcoming") {
        rosterRowsByManagerId = await teamsForManagersQuery.fetch(
          supabase,
          managerIds,
        );
      } else {
        rosterRowsByManagerId = await getGameweekLineupsForManagers(
          supabase,
          managerIds,
          gameweekRow.id,
        );
        autoSub = isPendingFinalization;
      }

      const teams = managerIds.map((managerId) => {
        const rows = rosterRowsByManagerId.get(managerId) ?? [];
        let players = resolvePlayersForGameweek(rows, bootstrap, live, {
          autoSub,
        });
        players = attachFixtureStatus(
          players,
          bootstrap,
          fixtures,
          gameweekNumber,
        );
        return {
          managerId,
          managerName:
            managersInLeague.get(managerId)?.name ?? String(managerId),
          players,
        };
      });

      return teams.sort((a, b) => a.managerName.localeCompare(b.managerName));
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
  }, [
    leagueId,
    bootstrap,
    gameweekRow,
    kind,
    live,
    fixtures,
    isPendingFinalization,
    supabase,
  ]);

  return {
    data: state.data,
    error: rowError || bootstrapError || liveError || state.error,
  };
}
