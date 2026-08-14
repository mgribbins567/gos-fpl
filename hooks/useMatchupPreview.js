import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "./useFplData";
import { getActiveGameweekContext } from "../lib/gameweek";
import {
  getCurrentSeason,
  getGameweekByNumber,
  getManagerByName,
  getMatchupForManager,
  toMatchupSummary,
  buildLiveMatchupSummary,
} from "../lib/matchupData";
import { getTeam } from "../components/Team/TeamCard";
import {
  mergeTeamWithLiveData,
  getTotalStartingPoints,
  getTopPlayer,
} from "../lib/fplData";
import { getManagersByNames } from "../lib/leagueData";
import { getGameweekLineup } from "../lib/teamHistory";
import { applyAutoSubstitutions } from "../lib/lineup";

export function useMatchupPreview(manager, supabase) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();

  const context = useMemo(
    () => (bootstrap ? getActiveGameweekContext(bootstrap) : undefined),
    [bootstrap],
  );

  const liveGameweek = context?.mode === "live" ? context.event.id : undefined;
  const { data: live, error: liveError } = useLiveEvent(liveGameweek, {
    poll: context?.mode === "live",
  });

  const previousLiveGameweek =
    context?.mode === "between" &&
    context.previousEvent &&
    context.previousEvent.finished
      ? context.previousEvent.id
      : undefined;
  const { data: previousLive, error: previousLiveError } = useLiveEvent(
    previousLiveGameweek,
    { poll: true },
  );

  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!manager || !bootstrap || !context) return;
    if (context.mode === "live" && !live) return;

    let cancelled = false;

    async function load() {
      const season = await getCurrentSeason(supabase);

      if (context.mode === "live") {
        const gameweekRow = await getGameweekByNumber(
          supabase,
          season.id,
          context.event.id,
        );
        const matchup = await getMatchupForManager(
          supabase,
          gameweekRow.id,
          manager.name,
        );

        if (!matchup) {
          return {
            mode: "live",
            gameweekNumber: context.event.id,
            phase: "gameweek_live",
            matchup: null,
          };
        }

        const opponentName =
          matchup.manager_1 === manager.name
            ? matchup.manager_2
            : matchup.manager_1;
        const opponentManager = await getManagerByName(supabase, opponentName);

        const [selfTeam, opponentTeam] = await Promise.all([
          getGameweekLineup(supabase, manager.id, gameweekRow.id),
          getGameweekLineup(supabase, opponentManager.id, gameweekRow.id),
        ]);

        const selfPlayers = mergeTeamWithLiveData(selfTeam, bootstrap, live);
        const opponentPlayers = mergeTeamWithLiveData(
          opponentTeam,
          bootstrap,
          live,
        );

        return {
          mode: "live",
          gameweekNumber: context.event.id,
          phase: "gameweek_live",
          matchup: {
            self: {
              name: manager.name,
              score: getTotalStartingPoints(selfPlayers),
              topPlayer: getTopPlayer(selfPlayers),
            },
            opponent: {
              name: opponentName,
              score: getTotalStartingPoints(opponentPlayers),
              topPlayer: getTopPlayer(opponentPlayers),
            },
          },
        };
      }

      const { previousEvent, upcoming } = context;
      const nextGameweekRow = await getGameweekByNumber(
        supabase,
        season.id,
        upcoming.event.id,
      );

      const previousGameweekRow = previousEvent
        ? await getGameweekByNumber(supabase, season.id, previousEvent.id)
        : null;
      const previousMatchup = previousGameweekRow
        ? await getMatchupForManager(
            supabase,
            previousGameweekRow.id,
            manager.name,
          )
        : null;
      let previousSummary = null;
      if (previousMatchup) {
        if (previousEvent.data_checked) {
          previousSummary = toMatchupSummary(previousMatchup, manager.name);
        }
        if (previousLive || !previousSummary) {
          const isSelfManager1 = previousMatchup.manager_1 === manager.name;
          const selfName = isSelfManager1
            ? previousMatchup.manager_1
            : previousMatchup.manager_2;
          const opponentName = isSelfManager1
            ? previousMatchup.manager_2
            : previousMatchup.manager_1;

          const managersByName = await getManagersByNames(supabase, [
            selfName,
            opponentName,
          ]);
          const selfManager = managersByName.get(selfName);
          const opponentManager = managersByName.get(opponentName);
          if (!selfManager || !opponentManager) {
            throw new Error(
              `Manager referenced in Matchup not found in Manager table`,
            );
          }

          const [selfRows, opponentRows] = await Promise.all([
            getGameweekLineup(supabase, selfManager.id, previousGameweekRow.id),
            getGameweekLineup(
              supabase,
              opponentManager.id,
              previousGameweekRow.id,
            ),
          ]);
          const selfPlayers = mergeTeamWithLiveData(
            selfRows,
            bootstrap,
            previousLive,
          );
          const opponentPlayers = mergeTeamWithLiveData(
            opponentRows,
            bootstrap,
            previousLive,
          );
          previousSummary = buildLiveMatchupSummary(
            selfName,
            selfPlayers,
            opponentName,
            opponentPlayers,
            context.previousEvent.data_checked,
          );
        }
      }

      const nextMatchup = await getMatchupForManager(
        supabase,
        nextGameweekRow.id,
        manager.name,
      );

      return {
        mode: "between",
        gameweekNumber: upcoming.event.id,
        phase: upcoming.phase,
        waiversDueAt: upcoming.waiversDueAt,
        squadLockAt: upcoming.squadLockAt,
        matchup: {
          previous: previousSummary,
          next: toMatchupSummary(nextMatchup, manager.name),
        },
      };
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
  }, [manager, supabase, bootstrap, context, live]);

  return {
    data: state.data,
    error: state.error || bootstrapError || liveError || previousLiveError,
  };
}
