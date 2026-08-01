import { describe, it, expect } from "vitest";
import {
  getGameweekPhase,
  getActiveGameweekContext,
  canEditLineup,
} from "../../lib/gameweek";

function makeEvent(
  id,
  { isCurrent = false, isNext = false, finished = false, deadlineTime } = {},
) {
  return {
    id,
    is_current: isCurrent,
    is_next: isNext,
    finished,
    deadline_time: deadlineTime ?? new Date(2026, 7, id, 18, 0).toISOString(),
  };
}

function makeBootstrap(events) {
  return { events };
}

describe("getGameweekPhase", () => {
  const deadline = "2026-08-15T18:00:00.000Z"; // squad lock
  const waiversDue = "2026-08-14T18:00:00.000Z"; // 24h before

  it("returns waivers_due when now is well before the waiver deadline", () => {
    const now = new Date("2026-08-10T00:00:00.000Z");
    expect(getGameweekPhase(deadline, now).phase).toBe("waivers_open");
  });

  it("returns free_agency_open when now is between the waiver deadline and squad lock", () => {
    const now = new Date("2026-08-15T00:00:00.000Z");
    expect(getGameweekPhase(deadline, now).phase).toBe("free_agency_open");
  });

  it("returns in_progress when now is after squad lock", () => {
    const now = new Date("2026-08-16T00:00:00.000Z");
    expect(getGameweekPhase(deadline, now).phase).toBe("gameweek_live");
  });

  it("treats the exact waiver deadline instant as free_agency_open, not waivers_open", () => {
    const now = new Date(waiversDue);
    expect(getGameweekPhase(deadline, now).phase).toBe("free_agency_open");
  });

  it("treats the exact squad lock instant as gameweek_live", () => {
    const now = new Date(deadline);
    expect(getGameweekPhase(deadline, now).phase).toBe("gameweek_live");
  });

  it("computes waiversDueAt as exactly 24 hours before squadLockAt", () => {
    const { waiversDueAt, squadLockAt } = getGameweekPhase(
      deadline,
      new Date("2026-08-10T00:00:00.000Z"),
    );
    expect(squadLockAt.getTime() - waiversDueAt.getTime()).toBe(
      24 * 60 * 60 * 1000,
    );
  });
});

describe("getActiveGameweekContext", () => {
  it("returns live mode with the current event when one event has is_current true", () => {
    const bootstrap = makeBootstrap([
      makeEvent(1, { finished: true }),
      makeEvent(2, { isCurrent: true }),
      makeEvent(3, { isNext: true }),
    ]);

    const result = getActiveGameweekContext(bootstrap);

    expect(result.mode).toBe("live");
    expect(result.event.id).toBe(2);
  });

  it("returns between mode with phase info derived from the next event's deadline when no event is current", () => {
    const bootstrap = makeBootstrap([
      makeEvent(1, { finished: true }),
      makeEvent(2, { finished: true }),
      makeEvent(3, { isNext: true, deadlineTime: "2026-08-15T18:00:00.000Z" }),
    ]);
    const now = new Date("2026-08-16T00:00:00.000Z"); // after deadline

    const result = getActiveGameweekContext(bootstrap, now);

    expect(result.mode).toBe("between");
    expect(result.nextEvent.id).toBe(3);
    expect(result.phase).toBe("gameweek_live");
  });

  it("selects the highest-id finished event as previousEvent when multiple gameweeks have finished", () => {
    const bootstrap = makeBootstrap([
      makeEvent(1, { finished: true }),
      makeEvent(2, { finished: true }),
      makeEvent(3, { isNext: true }),
    ]);

    const result = getActiveGameweekContext(bootstrap, new Date("2026-08-01"));

    expect(result.previousEvent.id).toBe(2);
  });

  it("returns previousEvent: null when no gameweek has finished yet (start of season)", () => {
    const bootstrap = makeBootstrap([
      makeEvent(1, { isNext: true }),
      makeEvent(2),
      makeEvent(3),
    ]);

    const result = getActiveGameweekContext(bootstrap, new Date("2026-08-01"));

    expect(result.previousEvent).toBeNull();
  });

  it("throws when no event is is_current and no event is is_next (FPL API not yet rolled to the new season)", () => {
    // Between seasons
    const bootstrap = makeBootstrap([
      makeEvent(36, { finished: true }),
      makeEvent(37, { finished: true }),
      makeEvent(38, { finished: true }),
    ]);

    expect(() => getActiveGameweekContext(bootstrap)).toThrow(
      "No current or next gameweek found in bootstrap-static data",
    );
  });
});

describe("canEditLineup", () => {
  const deadline = "2026-08-15T18:00:00.000Z";

  it("returns true when now is before the deadline", () => {
    expect(canEditLineup(deadline, new Date("2026-08-15T00:00:00.000Z"))).toBe(
      true,
    );
  });

  it("returns false when now is after the deadline", () => {
    expect(canEditLineup(deadline, new Date("2026-08-16T00:00:00.000Z"))).toBe(
      false,
    );
  });

  it("returns false at the exact deadline instant (matches getGameweekPhase's in_progress boundary)", () => {
    expect(canEditLineup(deadline, new Date(deadline))).toBe(false);
  });
});
