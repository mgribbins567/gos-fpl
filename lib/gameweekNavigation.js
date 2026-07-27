export function getNavigationState(
  viewedGameweek,
  boundaryGameweekNumber,
  earliestGameweek,
) {
  const isHistorical = viewedGameweek !== null;
  const displayedGameweekNumber = isHistorical
    ? viewedGameweek
    : boundaryGameweekNumber;
  const canGoBack =
    earliestGameweek != null && displayedGameweekNumber > earliestGameweek;
  const canGoForward =
    isHistorical && displayedGameweekNumber < boundaryGameweekNumber;
  return { displayedGameweekNumber, isHistorical, canGoBack, canGoForward };
}

export function getPreviousViewedGameweek(displayedGameweekNumber) {
  return displayedGameweekNumber - 1;
}

export function getNextViewedGameweek(
  displayedGameweekNumber,
  boundaryGameweekNumber,
) {
  const next = displayedGameweekNumber + 1;
  return next >= boundaryGameweekNumber ? null : next;
}
