export function getForwardStates(context) {
  if (!context) return [];
  if (context.mode === "live") {
    const states = [{ gameweekNumber: context.event.id, kind: "current" }];
    if (context.upcoming)
      states.push({
        gameweekNumber: context.upcoming.event.id,
        kind: "upcoming",
      });
    return states;
  }
  if (!context.upcoming) return [];
  return [{ gameweekNumber: context.upcoming.event.id, kind: "upcoming" }];
}

export function getNavigationState(
  viewedGameweek,
  forwardStates,
  earliestGameweek,
) {
  const defaultState = forwardStates[0];
  const displayedGameweekNumber =
    viewedGameweek ?? defaultState?.gameweekNumber;

  if (displayedGameweekNumber === undefined) {
    return {
      displayedGameweekNumber: undefined,
      kind: undefined,
      canGoBack: false,
      canGoForward: false,
    };
  }

  const forwardIndex = forwardStates.findIndex(
    (s) => s.gameweekNumber === displayedGameweekNumber,
  );
  const isHistorical = forwardIndex === -1;
  const kind = isHistorical ? "historical" : forwardStates[forwardIndex].kind;

  const hasEarlierHistory =
    earliestGameweek != null && displayedGameweekNumber > earliestGameweek;
  const canGoBack = isHistorical
    ? hasEarlierHistory
    : forwardIndex > 0 || hasEarlierHistory;
  const canGoForward = isHistorical
    ? forwardStates.length > 0
    : forwardIndex < forwardStates.length - 1;

  return { displayedGameweekNumber, kind, canGoBack, canGoForward };
}

export function getPreviousViewedGameweek(
  displayedGameweekNumber,
  forwardStates,
) {
  const idx = forwardStates.findIndex(
    (s) => s.gameweekNumber === displayedGameweekNumber,
  );
  if (idx > 0) return forwardStates[idx - 1].gameweekNumber;
  return displayedGameweekNumber - 1;
}

export function getNextViewedGameweek(displayedGameweekNumber, forwardStates) {
  const idx = forwardStates.findIndex(
    (s) => s.gameweekNumber === displayedGameweekNumber,
  );
  if (idx !== -1) {
    return idx < forwardStates.length - 1
      ? forwardStates[idx + 1].gameweekNumber
      : null;
  }
  const next = displayedGameweekNumber + 1;
  const defaultState = forwardStates[0];
  if (defaultState && next >= defaultState.gameweekNumber) return null;
  return next;
}

export function resolveGameweekKind(context, gameweekNumber) {
  if (!context || !gameweekNumber) return undefined;
  if (context.mode === "live" && context.event.id === gameweekNumber)
    return "current";
  if (context.upcoming && context.upcoming.event.id === gameweekNumber)
    return "upcoming";
  return "historical";
}
