import { useEffect, useState, useMemo } from "react";
import { useLiveEvent } from "./useFplData";
import { currentSeasonQuery } from "./queries/season";
import { mergeTeamWithLiveData } from "../lib/fplData";
import {
  getForwardStates,
  getNavigationState,
  getPreviousViewedGameweek,
  getNextViewedGameweek,
} from "../lib/gameweekNavigation";
import { applyAutoSubstitutions } from "../lib/lineup";
import { earliestLeagueGameweekNumberQuery } from "./queries/leagueData";
import { gameweekByNumberQuery } from "./queries/matchupData";
import { gameweekLineupQuery } from "./queries/teamHistory";

export function useTeamHistory(manager, supabase, bootstrap, context) {
  const [viewedGameweek, setViewedGameweek] = useState(null);
  const [seasonId, setSeasonId] = useState(undefined);
  const [earliestGameweek, setEarliestGameweek] = useState(undefined);
  const [boundsError, setBoundsError] = useState(null);

  useEffect(() => {
    if (!manager || !supabase) return;
    let cancelled = false;
    async function loadBounds() {
      const season = await currentSeasonQuery.fetch(supabase);
      const earliest = await earliestLeagueGameweekNumberQuery.fetch(
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
  const isCurrent = kind === "current";
  const isUpcoming = kind === "upcoming";
  const { data: historicalLive, error: liveError } = useLiveEvent(
    !isUpcoming ? displayedGameweekNumber : undefined,
  );

  const [historyState, setHistoryState] = useState({
    data: undefined,
    error: null,
  });

  useEffect(() => {
    if (
      !kind ||
      !manager ||
      !supabase ||
      !seasonId ||
      !bootstrap ||
      !historicalLive
    ) {
      return;
    }
    let cancelled = false;
    async function load() {
      const gameweekRow = await gameweekByNumberQuery.fetch(
        supabase,
        seasonId,
        displayedGameweekNumber,
      );
      const rows = await gameweekLineupQuery.fetch(
        supabase,
        manager.id,
        gameweekRow.id,
      );
      let playerList;
      if (isHistorical) {
        const { players } = applyAutoSubstitutions(
          mergeTeamWithLiveData(rows, bootstrap, historicalLive),
        );
        playerList = players;
      } else {
        playerList = mergeTeamWithLiveData(rows, bootstrap, historicalLive);
      }
      return playerList;
    }
    load()
      .then((data) => !cancelled && setHistoryState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled &&
          setHistoryState({
            data: undefined,
            error: err.message,
          }),
      );
    return () => {
      cancelled = true;
    };
  }, [
    kind,
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
    historicalPlayers: !isUpcoming ? historyState.data : undefined,
    error:
      boundsError || liveError || (!isUpcoming ? historyState.error : null),
  };
}
