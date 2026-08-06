import { useEffect, useState, useMemo } from "react";
import { useLiveEvent } from "./useFplData";
import { getCurrentSeason, getGameweekByNumber } from "../lib/matchupData";
import {
  getGameweekLineup,
  getEarliestRecordedGameweekNumber,
} from "../lib/teamHistory";
import { mergeTeamWithLiveData } from "../lib/fplData";
import {
  getForwardStates,
  getNavigationState,
  getPreviousViewedGameweek,
  getNextViewedGameweek,
} from "../lib/gameweekNavigation";
import { applyAutoSubstitutions } from "../lib/lineup";

export function useTeamHistory(manager, supabase, bootstrap, context) {
  const [viewedGameweek, setViewedGameweek] = useState(null);
  const [seasonId, setSeasonId] = useState(undefined);
  const [earliestGameweek, setEarliestGameweek] = useState(undefined);
  const [boundsError, setBoundsError] = useState(null);

  useEffect(() => {
    if (!manager || !supabase) return;
    let cancelled = false;
    async function loadBounds() {
      const season = await getCurrentSeason(supabase);
      const earliest = await getEarliestRecordedGameweekNumber(
        supabase,
        manager.id,
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
  }, [manager, supabase]);

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

  function jumpToUpcoming() {
    const upcomingState = forwardStates.find((s) => s.kind === "upcoming");
    if (upcomingState) setViewedGameweek(upcomingState.gameweekNumber);
  }

  const isHistorical = kind === "historical";
  const { data: historicalLive, error: liveError } = useLiveEvent(
    isHistorical ? displayedGameweekNumber : undefined,
  );

  const [historyState, setHistoryState] = useState({
    data: undefined,
    error: null,
  });

  useEffect(() => {
    if (
      !isHistorical ||
      !manager ||
      !supabase ||
      !seasonId ||
      !bootstrap ||
      !historicalLive
    )
      return;
    let cancelled = false;
    async function load() {
      const gameweekRow = await getGameweekByNumber(
        supabase,
        seasonId,
        displayedGameweekNumber,
      );
      const rows = await getGameweekLineup(
        supabase,
        manager.id,
        gameweekRow.id,
      );
      const { players } = applyAutoSubstitutions(
        mergeTeamWithLiveData(rows, bootstrap, historicalLive),
      );
      return players;
    }
    load()
      .then((data) => !cancelled && setHistoryState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setHistoryState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [
    isHistorical,
    manager,
    supabase,
    seasonId,
    bootstrap,
    historicalLive,
    displayedGameweekNumber,
  ]);

  return {
    displayedGameweekNumber,
    kind,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    jumpToUpcoming,
    historicalPlayers: isHistorical ? historyState.data : undefined,
    error:
      boundsError || liveError || (isHistorical ? historyState.error : null),
  };
}
