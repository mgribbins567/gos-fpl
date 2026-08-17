export const SORT_OPTIONS = {
  total_points: { label: "Total Pts", getValue: (p) => p.total_points },
  event_points: { label: "Last GW", getValue: (p) => p.event_points },
  form: { label: "Form", getValue: (p) => Number(p.form) },
  points_per_game: {
    label: "PPG",
    getValue: (p) => Number(p.points_per_game),
  },
};

export const DEFAULT_SORT_KEY = "total_points";

export function sortPlayers(players, sortKey = DEFAULT_SORT_KEY) {
  const sortOption = SORT_OPTIONS[sortKey];
  if (!sortOption) {
    throw new Error(`Unknown sort key: ${sortKey}`);
  }
  return [...players].sort(
    (a, b) => sortOption.getValue(b) - sortOption.getValue(a),
  );
}

export function filterPlayers(
  players,
  { position, teamId, searchText, onlyAvailable } = {},
  ownershipMap,
  unavailablePlayerIds,
) {
  return players.filter((p) => {
    if (position && p.element_type !== position) return false;
    if (teamId && p.team !== teamId) return false;
    if (unavailablePlayerIds.has(p.id)) return false;
    if (
      onlyAvailable &&
      ownershipMap &&
      unavailablePlayerIds &&
      !isFreeAgent(p.id, ownershipMap, unavailablePlayerIds)
    )
      return false;
    if (
      searchText &&
      !p.web_name.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    return true;
  });
}

export function buildOwnershipMap(rosterRows) {
  return new Map(rosterRows.map((row) => [row.player_id, row.manager_id]));
}

export function buildUnavailablePlayerIds(
  availabilityRows,
  currentGameweekNumber,
) {
  return new Set(
    availabilityRows
      .filter((row) => row.unavailableUntilGameweek > currentGameweekNumber)
      .map((row) => row.player_id),
  );
}

export function excludeOwnRoster(players, ownershipMap, viewingManagerId) {
  return players.filter((p) => ownershipMap.get(p.id) !== viewingManagerId);
}

export function isFreeAgent(playerId, ownershipMap, unavailablePlayerIds) {
  return (
    !ownershipMap.has(playerId) &&
    !unavailablePlayerIds.has(playerId) &&
    playerId <= 587
  );
}
