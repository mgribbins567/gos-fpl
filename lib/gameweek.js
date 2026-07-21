const MS_PER_HOUR = 60 * 60 * 1000;
const WAIVER_LEAD_HOURS = 24;

export function getGameweekPhase(deadlineTime, now = new Date()) {
  const squadLockAt = new Date(deadlineTime);
  const waiversDueAt = new Date(
    squadLockAt.getTime() - WAIVER_LEAD_HOURS * MS_PER_HOUR,
  );

  let phase;
  if (now < waiversDueAt) {
    phase = "waivers_due";
  } else if (now < squadLockAt) {
    phase = "squad_locked";
  } else {
    phase = "in_progress";
  }

  return { phase, waiversDueAt, squadLockAt };
}

export function getActiveGameweekContext(bootstrap, now = new Date()) {
  const liveEvent = bootstrap.events.find((event) => event.is_current);
  if (liveEvent) {
    return { mode: "live", event: liveEvent };
  }

  const nextEvent = bootstrap.events.find((event) => event.is_next);
  if (!nextEvent) {
    throw new Error(
      "No current or next gameweek found in bootstrap-static data",
    );
  }

  const previousEvent =
    bootstrap.events
      .filter((event) => event.finished)
      .sort((a, b) => b.id - a.id)[0] ?? null;

  const { phase, waiversDueAt, squadLockAt } = getGameweekPhase(
    nextEvent.deadline_time,
    now,
  );

  return {
    mode: "between",
    previousEvent,
    nextEvent,
    phase,
    waiversDueAt,
    squadLockAt,
  };
}
