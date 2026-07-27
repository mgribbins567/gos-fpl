import { describe, it, expect } from "vitest";
import { buildGameweekSyncRows } from "../../lib/gameweekSync";

function makeEvent(id, overrides = {}) {
  return {
    id,
    deadline_time: `2026-08-${String(id).padStart(2, "0")}T18:00:00Z`,
    finished: false,
    ...overrides,
  };
}

describe("buildGameweekSyncRows", () => {
  it("builds one row per FPL event, keyed by season and gameweek number", () => {
    const bootstrap = { events: [makeEvent(1), makeEvent(2)] };
    const rows = buildGameweekSyncRows(bootstrap, "season-1");

    expect(rows).toEqual([
      {
        id: "season-1-1",
        season_id: "season-1",
        gameweek: 1,
        deadline_time: "2026-08-01T18:00:00Z",
        finished: false,
      },
      {
        id: "season-1-2",
        season_id: "season-1",
        gameweek: 2,
        deadline_time: "2026-08-02T18:00:00Z",
        finished: false,
      },
    ]);
  });

  it("carries finished: true through unchanged", () => {
    const bootstrap = { events: [makeEvent(1, { finished: true })] };
    expect(buildGameweekSyncRows(bootstrap, "season-1")[0].finished).toBe(true);
  });

  it("returns an empty array when bootstrap has no events", () => {
    expect(buildGameweekSyncRows({ events: [] }, "season-1")).toEqual([]);
  });

  it("generates ids matching the seasonId-gameweekNumber convention used by seeded data", () => {
    const bootstrap = { events: [makeEvent(15)] };
    expect(buildGameweekSyncRows(bootstrap, "season-1")[0].id).toBe(
      "season-1-15",
    );
  });
});
