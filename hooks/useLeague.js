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
  getEarliestLeagueGameweekNumber,
} from "../lib/leagueData";
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
import { mergeTeamWithLiveData } from "../lib/fplData";

export function useLeague(leagueId, supabase) {
  const [viewedGameweek, setViewedGameweek] = useState(null);
  const [seasonId, setSeasonId] = useState(undefined);
  const [earliestGameweek, setEarliestGameweek] = useState(undefined);
  const [boundsError, setBoundsError] = useState(null);

  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const context = useMemo(
    () => (bootstrap ? getActiveGameweekContext(bootstrap) : undefined),
    [bootstrap],
  );

  useEffect(() => {
    if (!leagueId || !supabase) return;
    let cancelled = false;
    async function loadBounds() {
      const season = await getCurrentSeason(supabase);
      const earliest = await getEarliestLeagueGameweekNumber(
        supabase,
        season.id,
      );
      if (cancelled) return;
      setSeasonId(season.id);
      setEarliestGameweek(earliest);
    }
    loadBounds().catch((err) => !cancelled && setBoundsError(err.message));
    return () => {
      cancelled = true;
    };
  }, [leagueId, supabase]);

  const forwardStates = useMemo(() => getForwardStates(context), [context]);
  const { displayedGameweekNumber, kind, canGoBack, canGoForward } =
    getNavigationState(viewedGameweek, forwardStates, earliestGameweek);

  function goBack() {
    if (!canGoBack) return;
    setViewedGameweek(
      getPreviousViewedGameweek(displayedGameweekNumber, forwardStates),
    );
  }
  function goForward() {
    if (!canGoForward) return;
    setViewedGameweek(
      getNextViewedGameweek(displayedGameweekNumber, forwardStates),
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
    getGameweekByNumber(supabase, seasonId, displayedGameweekNumber)
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
    if (
      !leagueId ||
      !bootstrap ||
      !seasonId ||
      !displayedGameweekNumber ||
      !kind
    )
      return;
    if (needsLiveMerge && !live) return;
    if (kind === "historical" && !targetGameweekRow) return;
    if (needsHistoricalFallback && !historicalLive) return;

    let cancelled = false;

    async function load() {
      const gameweekRow =
        kind === "historical"
          ? targetGameweekRow
          : await getGameweekByNumber(
              supabase,
              seasonId,
              displayedGameweekNumber,
            );
      const matchups = await getLeagueMatchups(
        supabase,
        leagueId,
        gameweekRow.id,
      );

      let matchupSummaries = [];
      let provisional = false;

      if (matchups.length > 0) {
        if (kind === "historical" && gameweekRow.data_checked) {
          matchupSummaries = matchups.map((m) => toLeagueMatchupSummary(m));
        } else if (kind === "historical" && !gameweekRow.data_checked) {
          provisional = true;
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await getManagersByNames(supabase, names);
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId = await getGameweekLineupsForManagers(
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
          const managersByName = await getManagersByNames(supabase, names);
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId = await getGameweekLineupsForManagers(
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
    leagueId,
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
    if (!leagueId || !bootstrap || !seasonId || !standingsGameweekNumber)
      return;
    if (isLive && !standingsLive) return;

    let cancelled = false;

    async function load() {
      let scoreByName = new Map();

      if (isLive) {
        const gameweekRow = await getGameweekByNumber(
          supabase,
          seasonId,
          standingsGameweekNumber,
        );
        const matchups = await getLeagueMatchups(
          supabase,
          leagueId,
          gameweekRow.id,
        );
        if (matchups.length > 0) {
          const names = matchups.flatMap((m) => [m.manager_1, m.manager_2]);
          const managersByName = await getManagersByNames(supabase, names);
          const managerIds = [...managersByName.values()].map((m) => m.id);
          const lineupsByManagerId = await getGameweekLineupsForManagers(
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

      const seasonMatchups = await getLeagueMatchupsForSeason(
        supabase,
        leagueId,
        seasonId,
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
  }, [
    leagueId,
    bootstrap,
    seasonId,
    standingsGameweekNumber,
    isLive,
    standingsLive,
  ]);

  return {
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
