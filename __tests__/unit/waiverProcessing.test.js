import { describe, it, expect } from "vitest";
import {
  filterGameweeksDueForProcessing,
  buildWaiverProcessingOrder,
  processWaivers,
  groupClaimsByManager,
} from "../../lib/waiverProcessing";

describe("filterGameweeksDueForProcessing", () => {
  function makeGameweek(id, deadlineTime) {
    return { id, deadline_time: deadlineTime };
  }

  it("includes a gameweek whose 24h-before-deadline cutoff has passed", () => {
    const now = new Date("2026-08-15T00:00:00Z");
    const gw = makeGameweek("gw1", "2026-08-15T12:00:00Z");
    expect(filterGameweeksDueForProcessing([gw], now)).toEqual([gw]);
  });

  it("excludes a gameweek whose cutoff hasn't arrived yet", () => {
    const now = new Date("2026-08-13T00:00:00Z");
    const gw = makeGameweek("gw1", "2026-08-15T12:00:00Z");
    expect(filterGameweeksDueForProcessing([gw], now)).toEqual([]);
  });

  it("REGRESSION: includes a gameweek that's already fully live (deadline long passed) — this is the missed-cron-run recovery case", () => {
    const now = new Date("2026-08-20T00:00:00Z");
    const gw = makeGameweek("gw1", "2026-08-15T12:00:00Z");
    expect(filterGameweeksDueForProcessing([gw], now)).toEqual([gw]);
  });

  it("excludes a gameweek with no deadline_time yet (not synced from FPL)", () => {
    const gw = makeGameweek("gw1", null);
    expect(filterGameweeksDueForProcessing([gw], new Date())).toEqual([]);
  });

  it("filters a mixed list down to only the due gameweeks", () => {
    const now = new Date("2026-08-15T00:00:00Z");
    const due = makeGameweek("due", "2026-08-15T12:00:00Z");
    const notDue = makeGameweek("not-due", "2026-08-25T12:00:00Z");
    expect(filterGameweeksDueForProcessing([due, notDue], now)).toEqual([due]);
  });
});

describe("groupClaimsByManager", () => {
  it("groups claims by manager_id, preserving order within each manager", () => {
    const claims = [
      { id: "a", manager_id: 1 },
      { id: "b", manager_id: 2 },
      { id: "c", manager_id: 1 },
    ];
    const result = groupClaimsByManager(claims);
    expect(result.get(1)).toEqual([
      { id: "a", manager_id: 1 },
      { id: "c", manager_id: 1 },
    ]);
    expect(result.get(2)).toEqual([{ id: "b", manager_id: 2 }]);
  });

  it("returns an empty Map for an empty claims array", () => {
    expect(groupClaimsByManager([]).size).toBe(0);
  });
});

describe("buildWaiverProcessingOrder", () => {
  function makeManagersMap(entries) {
    return new Map(entries.map(([id, name]) => [id, { id, name }]));
  }

  it("orders managers ascending by wins (worst record processed first)", () => {
    const claims = [{ manager_id: 1 }, { manager_id: 2 }];
    const standings = [
      { name: "Matthew", wins: 5, pointsFor: 100 },
      { name: "Andrew", wins: 2, pointsFor: 90 },
    ];
    const managers = makeManagersMap([
      [1, "Matthew"],
      [2, "Andrew"],
    ]);
    expect(buildWaiverProcessingOrder(claims, standings, managers)).toEqual([
      2, 1,
    ]);
  });

  it("breaks a tie on wins using ascending pointsFor", () => {
    const claims = [{ manager_id: 1 }, { manager_id: 2 }];
    const standings = [
      { name: "Matthew", wins: 3, pointsFor: 120 },
      { name: "Andrew", wins: 3, pointsFor: 80 },
    ];
    const managers = makeManagersMap([
      [1, "Matthew"],
      [2, "Andrew"],
    ]);
    expect(buildWaiverProcessingOrder(claims, standings, managers)).toEqual([
      2, 1,
    ]);
  });

  it("breaks a full tie (wins and pointsFor) alphabetically by name", () => {
    const claims = [{ manager_id: 1 }, { manager_id: 2 }];
    const standings = [
      { name: "Zach", wins: 3, pointsFor: 100 },
      { name: "Matthew", wins: 3, pointsFor: 100 },
    ];
    const managers = makeManagersMap([
      [1, "Zach"],
      [2, "Matthew"],
    ]);
    expect(buildWaiverProcessingOrder(claims, standings, managers)).toEqual([
      2, 1,
    ]);
  });

  it("treats a manager with no standings record as 0 wins / 0 pointsFor (e.g. week 1, before any matchups)", () => {
    const claims = [{ manager_id: 1 }, { manager_id: 2 }];
    const standings = [{ name: "Matthew", wins: 2, pointsFor: 50 }];
    const managers = makeManagersMap([
      [1, "Matthew"],
      [2, "Andrew"],
    ]);
    expect(buildWaiverProcessingOrder(claims, standings, managers)).toEqual([
      2, 1,
    ]);
  });

  it("only includes managers who actually have claims, not every manager in the league", () => {
    const claims = [{ manager_id: 2 }];
    const standings = [
      { name: "Matthew", wins: 1, pointsFor: 10 },
      { name: "Andrew", wins: 0, pointsFor: 5 },
    ];
    const managers = makeManagersMap([
      [1, "Matthew"],
      [2, "Andrew"],
    ]);
    expect(buildWaiverProcessingOrder(claims, standings, managers)).toEqual([
      2,
    ]);
  });
});

describe("processWaivers", () => {
  it("REGRESSION: replicates the confirmed worked example exactly — reverse-standings order, one success per manager per round, cascading through failures within a turn", async () => {
    const claimsByManagerId = new Map([
      ["m1", [{ id: "c1" }, { id: "c2" }, { id: "c3" }, { id: "c4" }]],
      ["m2", [{ id: "d1" }, { id: "d2" }]],
    ]);
    const order = ["m1", "m2"];
    const outcomes = {
      c1: "successful",
      d1: "failed",
      d2: "successful",
      c2: "failed",
      c3: "failed",
      c4: "successful",
    };
    const attempted = [];
    const attemptClaim = async (claim) => {
      attempted.push(claim.id);
      return outcomes[claim.id];
    };

    const results = await processWaivers(
      claimsByManagerId,
      order,
      attemptClaim,
    );

    expect(attempted).toEqual(["c1", "d1", "d2", "c2", "c3", "c4"]);
    expect(results).toEqual([
      { claimId: "c1", status: "successful" },
      { claimId: "d1", status: "failed" },
      { claimId: "d2", status: "successful" },
      { claimId: "c2", status: "failed" },
      { claimId: "c3", status: "failed" },
      { claimId: "c4", status: "successful" },
    ]);
  });

  it("returns an empty array when no manager has any claims", async () => {
    const results = await processWaivers(
      new Map(),
      [],
      async () => "successful",
    );
    expect(results).toEqual([]);
  });

  it("a manager whose only claim succeeds immediately gets exactly one attempt", async () => {
    const claimsByManagerId = new Map([["m1", [{ id: "c1" }]]]);
    const attempted = [];
    const attemptClaim = async (claim) => {
      attempted.push(claim.id);
      return "successful";
    };
    await processWaivers(claimsByManagerId, ["m1"], attemptClaim);
    expect(attempted).toEqual(["c1"]);
  });

  it("a manager whose every claim fails still gets every claim attempted, once each", async () => {
    const claimsByManagerId = new Map([["m1", [{ id: "c1" }, { id: "c2" }]]]);
    const attempted = [];
    const attemptClaim = async (claim) => {
      attempted.push(claim.id);
      return "failed";
    };
    const results = await processWaivers(
      claimsByManagerId,
      ["m1"],
      attemptClaim,
    );
    expect(attempted).toEqual(["c1", "c2"]);
    expect(results.every((r) => r.status === "failed")).toBe(true);
  });

  it("a manager not present in claimsByManagerId (e.g. in the standings but no claims) is silently skipped, not an error", async () => {
    const claimsByManagerId = new Map([["m1", [{ id: "c1" }]]]);
    const attemptClaim = async () => "successful";
    const results = await processWaivers(
      claimsByManagerId,
      ["m0", "m1", "m2"],
      attemptClaim,
    );
    expect(results).toEqual([{ claimId: "c1", status: "successful" }]);
  });
});
