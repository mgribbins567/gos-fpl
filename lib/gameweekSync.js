export function buildGameweekSyncRows(bootstrap, seasonId) {
  return bootstrap.events.map((event) => ({
    id: `${seasonId}-${event.id}`,
    season_id: seasonId,
    gameweek: event.id,
    deadline_time: event.deadline_time,
    finished: event.finished,
  }));
}
