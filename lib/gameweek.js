const MS_PER_HOUR = 60 * 60 * 1000;
const WAIVER_LEAD_HOURS = 24;

export function getGameweekPhase(deadlineTime, now = new Date()) {
  const squadLockAt = new Date(deadlineTime);
  const waiversDueAt = new Date(
    squadLockAt.getTime() - WAIVER_LEAD_HOURS * MS_PER_HOUR,
  );

  let phase;
  if (now < waiversDueAt) {
    phase = "waivers_open";
  } else if (now < squadLockAt) {
    phase = "free_agency_open";
  } else {
    phase = "gameweek_live";
  }

  return { phase, waiversDueAt, squadLockAt };
}

export function getActiveGameweekContext(bootstrap, now = new Date()) {
  const liveEvent = bootstrap.events.find((e) => e.is_current);
  const nextEvent = bootstrap.events.find((e) => e.is_next);
  const upcoming = nextEvent
    ? { event: nextEvent, ...getGameweekPhase(nextEvent.deadline_time, now) }
    : null;

  if (liveEvent) {
    return { mode: "live", event: liveEvent, upcoming };
  }

  if (!nextEvent) {
    throw new Error(
      "No current or next gameweek found in bootstrap-static data",
    );
  }

  const previousEvent =
    bootstrap.events.filter((e) => e.finished).sort((a, b) => b.id - a.id)[0] ??
    null;
  return { mode: "between", previousEvent, upcoming };
}

function formatDeadline(date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "numeric",
    day: "numeric",
  });
}

export function describeGameweekStatus(data) {
  if (data.phase === "gameweek_live") return `In progress`;
  if (data.phase === "waivers_open")
    return `Waivers due ${formatDeadline(data.waiversDueAt)}`;
  return `Squad locks ${formatDeadline(data.squadLockAt)}`;
}

export function canEditLineup(deadlineTime, now = new Date()) {
  return now < new Date(deadlineTime);
}
