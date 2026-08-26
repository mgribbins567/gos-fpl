import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "./useFplData";
import { currentSeasonQuery } from "./queries/season";
import { getActiveGameweekContext } from "../lib/gameweek";
import {
  toLeagueMatchupSummary,
  computeStandingsWithRankChange,
  computeMatchupScores,
} from "../lib/leagueLogic";
import {
  getForwardStates,
  getNavigationState,
  getPreviousViewedGameweek,
  getNextViewedGameweek,
} from "../lib/gameweekNavigation";
import {
  cupGameweekBoundsQuery,
  cupMatchupsByCupQuery,
  cupMatchupsQuery,
  managersByNamesQuery,
} from "./queries/leagueData";
import { gameweekByNumberQuery } from "./queries/matchupData";
import { gameweekLineupsForManagersQuery } from "./queries/teamHistory";

const CUP_NAME = "League of Champions";

export function useCup(supabase) {
  const [viewedGameweek, setViewedGameweek] = useState(null);
  const [seasonId, setSeasonId] = useState(undefined);
  const [earliestGameweek, setEarliestGameweek] = useState(undefined);
  const [latestGameweek, setLatestGameweek] = useState(undefined);
  const [boundsError, setBoundsError] = useState(null);

  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const context = useMemo(
    () => (bootstrap ? getActiveGameweekContext(bootstrap) : undefined),
    [bootstrap],
  );

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    async function loadBounds() {
      const season = await currentSeasonQuery.fetch(supabase);
      const { earliest, latest } = await cupGameweekBoundsQuery.fetch(
        supabase,
        season.id,
        CUP_NAME,
      );
      if (cancelled) return;
      setSeasonId(season.id);
      setEarliestGameweek(earliest);
      setLatestGameweek(latest);
    }
    loadBounds().catch((err) => !cancelled && setBoundsError(err.message));
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const forwardStates = useMemo(() => getForwardStates(context), [context]);
  const { displayedGameweekNumber, kind, canGoBack, canGoForward } =
    getNavigationState(
      viewedGameweek,
      forwardStates,
      earliestGameweek,
      latestGameweek,
    );

  function goBack() {
    if (!canGoBack) return;
    setViewedGameweek(
      getPreviousViewedGameweek(displayedGameweekNumber, forwardStates),
    );
  }
  function goForward() {
    if (!canGoForward) return;
    setViewedGameweek(
      getNextViewedGameweek(
        displayedGameweekNumber,
        forwardStates,
        latestGameweek,
      ),
    );
  }

  const needsLiveMerge = kind === "current";
  const { data: live, error: liveError } = useLiveEvent(
    needsLiveMerge ? displayedGameweekNumber : undefined,
    { poll: kind === "current" },
  );

  const [targetGameweekRow, setTargetGameweekRow] = useState(undefined);
  useEffect(() => {
    if (kind !== "historical" || !seasonId || !displayedGameweekNumber) {
      setTargetGameweekRow(undefined);
      return;
    }
    let cancelled = false;
    gameweekByNumberQuery
      .fetch(supabase, seasonId, displayedGameweekNumber)
      .then((row) => !cancelled && setTargetGameweekRow(row))
      .catch(
        (err) =>
          !cancelled &&
          setMatchupState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [kind, seasonId, displayedGameweekNumber, supabase]);

  const needsHistoricalFallback =
    kind === "historical" &&
    targetGameweekRow &&
    !targetGameweekRow.data_checked;
  const { data: historicalLive, error: historicalLiveError } = useLiveEvent(
    needsHistoricalFallback ? displayedGameweekNumber : undefined,
    { poll: true },
  );

  const [matchupState, setMatchupState] = useState({
    data: undefined,
    error: null,
  });

  useEffect(() => {
    if (!bootstrap || !seasonId || !displayedGameweekNumber || !kind) return;
    if (needsLiveMerge && !live) return;
    if (kind === "historical" && !targetGameweekRow) return;
    if (needsHistoricalFallback && !historicalLive) return;

    let cancelled = false;

    async function load() {
      const gameweekRow =
        kind === "historical"
          ? targetGameweekRow
          : await gameweekByNumberQuery.fetch(
              supabase,
              seasonId,
              displayedGameweekNumber,
            );
      const matchups = await cupMatchupsQuery.fetch(supabase, gameweekRow.id);

      let matchupSummaries = [];
      let provisional = false;

      if (matchups.length > 0) {
        if (kind === "historical" && gameweekRow.data_checked) {
          matchupSummaries = matchups.map((m) => toLeagueMatchupSummary(m));
        } else if (kind === "historical" && !gameweekRow.data_checked) {
          provisional = true;
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await managersByNamesQuery.fetch(
            supabase,
            names,
          );
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId =
            await gameweekLineupsForManagersQuery.fetch(
              supabase,
              managerIds,
              gameweekRow.id,
            );
          const scoreByName = computeMatchupScores(
            matchups,
            bootstrap,
            historicalLive,
            lineupsByManagerId,
            managersByName,
            { autoSub: true },
          );
          matchupSummaries = matchups.map((m) =>
            toLeagueMatchupSummary(m, scoreByName),
          );
        } else if (kind === "current") {
          provisional = true;
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await managersByNamesQuery.fetch(
            supabase,
            names,
          );
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId =
            await gameweekLineupsForManagersQuery.fetch(
              supabase,
              managerIds,
              gameweekRow.id,
            );
          const scoreByName = computeMatchupScores(
            matchups,
            bootstrap,
            live,
            lineupsByManagerId,
            managersByName,
            { autoSub: false },
          );
          matchupSummaries = matchups.map((m) =>
            toLeagueMatchupSummary(m, scoreByName),
          );
        } else if (kind === "upcoming") {
          matchupSummaries = matchups.map((m) => toLeagueMatchupSummary(m));
        }
      }

      return {
        gameweekNumber: displayedGameweekNumber,
        kind,
        provisional,
        matchupSummaries,
      };
    }

    load()
      .then((data) => !cancelled && setMatchupState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setMatchupState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [
    bootstrap,
    seasonId,
    displayedGameweekNumber,
    kind,
    live,
    historicalLive,
    needsHistoricalFallback,
    targetGameweekRow,
  ]);

  const isLive = context?.mode === "live";
  const standingsGameweekNumber = isLive
    ? context.event.id
    : context?.upcoming?.event.id;
  const { data: standingsLive, error: standingsLiveError } = useLiveEvent(
    isLive ? standingsGameweekNumber : undefined,
    { poll: isLive },
  );

  const [standingsState, setStandingsState] = useState({
    data: undefined,
    error: null,
  });

  useEffect(() => {
    if (!bootstrap || !seasonId || !standingsGameweekNumber) return;
    if (isLive && !standingsLive) return;

    let cancelled = false;

    async function load() {
      let scoreByName = new Map();

      if (isLive) {
        const gameweekRow = await gameweekByNumberQuery.fetch(
          supabase,
          seasonId,
          standingsGameweekNumber,
        );
        const matchups = await cupMatchupsQuery.fetch(supabase, gameweekRow.id);
        if (matchups.length > 0) {
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await managersByNamesQuery.fetch(
            supabase,
            names,
          );
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId =
            await gameweekLineupsForManagersQuery.fetch(
              supabase,
              managerIds,
              gameweekRow.id,
            );
          scoreByName = computeMatchupScores(
            matchups,
            bootstrap,
            standingsLive,
            lineupsByManagerId,
            managersByName,
            { autoSub: false },
          );
        }
      }

      const seasonMatchups = await cupMatchupsByCupQuery.fetch(
        supabase,
        CUP_NAME,
      );
      return computeStandingsWithRankChange(
        seasonMatchups,
        standingsGameweekNumber,
        scoreByName,
      );
    }

    load()
      .then((data) => !cancelled && setStandingsState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setStandingsState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [bootstrap, seasonId, standingsGameweekNumber, isLive, standingsLive]);

  return {
    name: CUP_NAME,
    matchups: matchupState.data,
    standings: standingsState.data,
    navigator: {
      displayedGameweekNumber,
      kind,
      canGoBack,
      canGoForward,
      goBack,
      goForward,
    },
    error:
      boundsError ||
      bootstrapError ||
      liveError ||
      historicalLiveError ||
      standingsLiveError ||
      matchupState.error ||
      standingsState.error,
  };
}
