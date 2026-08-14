import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "./useFplData";
import { getActiveGameweekContext } from "../lib/gameweek";
import { getCurrentSeason, getGameweekByNumber } from "../lib/matchupData";
import { getGameweekLineupsForManagers } from "../lib/teamHistory";
import {
  getLeagueMatchups,
  getLeagueMatchupsForSeason,
  getManagersByNames,
  getTeamsForManagers,
  getTeamsForManagersByGameweek,
} from "../lib/leagueData";
import {
  toLeagueMatchupSummary,
  getFeaturedMatchups,
  computeStandingsWithRankChange,
} from "../lib/leagueLogic";
import { mergeTeamWithLiveData, getTotalStartingPoints } from "../lib/fplData";

export function useLeaguePreview(leagueId, supabase) {
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
  const { data: previousLive, error: previousLiveError } =
    useLiveEvent(previousLiveGameweek);

  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!leagueId || !bootstrap || !context) return;
    if (context.mode === "live" && !live) return;
    if (previousLiveGameweek && !previousLive) return;

    let cancelled = false;

    async function load() {
      const season = await getCurrentSeason(supabase);
      const gameweekNumber =
        context.mode === "live" ? context.event.id : context.previousEvent.id;

      let scoreByName = new Map();
      let featuredMatchups = { highestScoring: null, closest: null };
      let previousWeekProvisional = false;

      if (context.mode === "live") {
        const gameweekRow = await getGameweekByNumber(
          supabase,
          season.id,
          gameweekNumber,
        );
        const matchups = await getLeagueMatchups(
          supabase,
          leagueId,
          gameweekRow.id,
        );

        if (matchups.length > 0) {
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await getManagersByNames(supabase, names);
          const teamsByManagerId = await getTeamsForManagersByGameweek(
            supabase,
            [...managersByName.values()].map((m) => m.id),
            gameweekRow.id,
          );

          scoreByName = new Map();
          for (const name of names) {
            const manager = managersByName.get(name);
            if (!manager) {
              throw new Error(
                `Manager "${name}" referenced in Matchup not found in Manager table`,
              );
            }
            const teamRows = teamsByManagerId.get(manager.id) ?? [];
            const players = mergeTeamWithLiveData(teamRows, bootstrap, live);
            scoreByName.set(name, getTotalStartingPoints(players));
          }

          featuredMatchups = getFeaturedMatchups(
            matchups.map((m) => toLeagueMatchupSummary(m, scoreByName)),
          );
        }
      } else if (context.previousEvent) {
        const previousGameweekRow = await getGameweekByNumber(
          supabase,
          season.id,
          context.previousEvent.id,
        );
        const matchups = await getLeagueMatchups(
          supabase,
          leagueId,
          previousGameweekRow.id,
        );
        if (matchups.length > 0) {
          if (context.previousEvent.data_checked) {
            featuredMatchups = getFeaturedMatchups(
              matchups.map((m) => toLeagueMatchupSummary(m)),
            );
          }
          if (previousLive || !featuredMatchups) {
            previousWeekProvisional = true;
            const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
            const managersByName = await getManagersByNames(supabase, names);
            const managerIds = [...managersByName.values()].map((m) => m.id);
            const lineupsByManagerId = await getGameweekLineupsForManagers(
              supabase,
              managerIds,
              previousGameweekRow.id,
            );

            scoreByName = new Map();
            for (const name of names) {
              const manager = managersByName.get(name);
              if (!manager)
                throw new Error(
                  `Manager "${name}" referenced in Matchup not found in Manager table`,
                );
              const rows = lineupsByManagerId.get(manager.id) ?? [];
              const players = mergeTeamWithLiveData(
                rows,
                bootstrap,
                previousLive,
              );
              scoreByName.set(name, getTotalStartingPoints(players));
            }

            featuredMatchups = getFeaturedMatchups(
              matchups.map((m) => toLeagueMatchupSummary(m, scoreByName)),
            );
          }
        }
      }

      const seasonMatchups = await getLeagueMatchupsForSeason(
        supabase,
        leagueId,
        season.id,
      );

      const standings = computeStandingsWithRankChange(
        seasonMatchups,
        gameweekNumber,
        scoreByName,
      ).slice(0, 5);

      return {
        mode: context.mode,
        gameweekNumber,
        phase:
          context.mode === "live" ? "gameweek_live" : context.upcoming.phase,
        waiversDueAt:
          context.mode === "between"
            ? context.upcoming.waiversDueAt
            : undefined,
        squadLockAt:
          context.mode === "between" ? context.upcoming.squadLockAt : undefined,
        featuredMatchups,
        previousWeekProvisional,
        standings,
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
  }, [
    leagueId,
    supabase,
    bootstrap,
    context,
    live,
    previousLive,
    previousLiveGameweek,
  ]);

  return {
    data: state.data,
    error: state.error || bootstrapError || liveError || previousLiveError,
  };
}
