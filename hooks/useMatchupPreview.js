import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "./useFplData";
import { getActiveGameweekContext } from "../lib/gameweek";
import {
  getCurrentSeason,
  getGameweekByNumber,
  getManagerByName,
  getMatchupForManager,
  toMatchupSummary,
} from "../lib/matchupData";
import { getTeam } from "../components/Team/TeamCard";
import {
  mergeTeamWithLiveData,
  getTotalStartingPoints,
  getTopPlayer,
} from "../lib/fplData";

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

  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!manager || !bootstrap || !context) return;
    if (context.mode === "live" && !live) return; // wait for live points before computing scores

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
            phase: "in_progress",
            matchup: null,
          };
        }

        const opponentName =
          matchup.manager_1 === manager.name
            ? matchup.manager_2
            : matchup.manager_1;
        const opponentManager = await getManagerByName(supabase, opponentName);

        const [selfTeam, opponentTeam] = await Promise.all([
          getTeam(manager, supabase),
          getTeam(opponentManager, supabase),
        ]);
        console.log("coop's team: ", opponentTeam);

        const selfPlayers = mergeTeamWithLiveData(selfTeam, bootstrap, live);
        const opponentPlayers = mergeTeamWithLiveData(
          opponentTeam,
          bootstrap,
          live,
        );
        console.log("players: ", selfPlayers);

        return {
          mode: "live",
          gameweekNumber: context.event.id,
          phase: "in_progress",
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

      // show previous week's final result + next week's opponent
      const { previousEvent, nextEvent, phase, waiversDueAt, squadLockAt } =
        context;
      const nextGameweekRow = await getGameweekByNumber(
        supabase,
        season.id,
        nextEvent.id,
      );

      const previousMatchup = previousEvent
        ? await getGameweekByNumber(supabase, season.id, previousEvent.id).then(
            (row) => getMatchupForManager(supabase, row.id, manager.name),
          )
        : null;
      const nextMatchup = await getMatchupForManager(
        supabase,
        nextGameweekRow.id,
        manager.name,
      );

      return {
        mode: "between",
        gameweekNumber: nextEvent.id,
        phase,
        waiversDueAt,
        squadLockAt,
        matchup: {
          previous: toMatchupSummary(previousMatchup, manager.name),
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
    error: state.error || bootstrapError || liveError,
  };
}
