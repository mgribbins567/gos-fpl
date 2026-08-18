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
  latestGameweek,
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

  const lastForwardGameweek =
    forwardStates[forwardStates.length - 1]?.gameweekNumber;
  const isBeforeForwardStates =
    forwardIndex === -1 &&
    displayedGameweekNumber < (defaultState?.gameweekNumber ?? Infinity);
  const isAfterForwardStates =
    forwardIndex === -1 &&
    lastForwardGameweek !== undefined &&
    displayedGameweekNumber > lastForwardGameweek;

  const kind =
    forwardIndex !== -1
      ? forwardStates[forwardIndex].kind
      : isAfterForwardStates
        ? "upcoming"
        : "historical";

  const hasEarlierHistory =
    earliestGameweek != null && displayedGameweekNumber > earliestGameweek;
  const hasLaterFuture =
    latestGameweek != null && displayedGameweekNumber < latestGameweek;

  const canGoBack = isAfterForwardStates
    ? true
    : isBeforeForwardStates
      ? hasEarlierHistory
      : forwardIndex > 0 || hasEarlierHistory;
  const canGoForward = isBeforeForwardStates
    ? true
    : isAfterForwardStates
      ? hasLaterFuture
      : forwardIndex < forwardStates.length - 1 || hasLaterFuture;

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

export function getNextViewedGameweek(
  displayedGameweekNumber,
  forwardStates,
  latestGameweek,
) {
  const idx = forwardStates.findIndex(
    (s) => s.gameweekNumber === displayedGameweekNumber,
  );
  if (idx !== -1) {
    if (idx < forwardStates.length - 1)
      return forwardStates[idx + 1].gameweekNumber;
    return latestGameweek != null && displayedGameweekNumber < latestGameweek
      ? displayedGameweekNumber + 1
      : null;
  }

  const lastForwardGameweek =
    forwardStates[forwardStates.length - 1]?.gameweekNumber;
  if (
    lastForwardGameweek !== undefined &&
    displayedGameweekNumber > lastForwardGameweek
  ) {
    return latestGameweek != null && displayedGameweekNumber < latestGameweek
      ? displayedGameweekNumber + 1
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
  const referenceGameweek = context.upcoming?.event.id ?? context.event?.id;
  if (referenceGameweek != null && gameweekNumber > referenceGameweek)
    return "upcoming";
  return "historical";
}
