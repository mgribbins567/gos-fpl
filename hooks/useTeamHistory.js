import { useEffect, useState } from "react";
import { useLiveEvent } from "./useFplData";
import { getCurrentSeason, getGameweekByNumber } from "../lib/matchupData";
import {
  getGameweekLineup,
  getEarliestRecordedGameweekNumber,
} from "../lib/teamHistory";
import { mergeTeamWithLiveData } from "../lib/fplData";
import {
  getNavigationState,
  getNextViewedGameweek,
  getPreviousViewedGameweek,
} from "../lib/gameweekNavigation";

export function useTeamHistory(
  manager,
  supabase,
  bootstrap,
  boundaryGameweekNumber,
) {
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

  const { displayedGameweekNumber, isHistorical, canGoBack, canGoForward } =
    getNavigationState(
      viewedGameweek,
      boundaryGameweekNumber,
      earliestGameweek,
    );

  function goBack() {
    if (!canGoBack) return;
    setViewedGameweek(getPreviousViewedGameweek(displayedGameweekNumber));
  }

  function goForward() {
    if (!canGoForward) return;
    setViewedGameweek(
      getNextViewedGameweek(displayedGameweekNumber, boundaryGameweekNumber),
    );
  }

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
      return mergeTeamWithLiveData(rows, bootstrap, historicalLive);
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
    isHistorical,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    historicalPlayers: isHistorical ? historyState.data : undefined,
    error:
      boundsError || liveError || (isHistorical ? historyState.error : null),
  };
}
