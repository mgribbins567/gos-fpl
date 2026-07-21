import { describe, it, expect } from "vitest";
import { toMatchupSummary } from "../../lib/matchupData";

function makeMatchup(overrides = {}) {
  return {
    id: "Matthew-Coop-5-2",
    gameweek_id: "season-5-2",
    manager_1: "Matthew",
    manager_2: "Coop",
    manager_1_score: 17,
    manager_2_score: 35,
    winner: "Coop",
    ...overrides,
  };
}

describe("toMatchupSummary", () => {
  it("returns null when matchup is null", () => {
    expect(toMatchupSummary(null, "Matthew")).toBeNull();
  });

  it("puts the requested manager under self and the other under opponent when they're manager_1", () => {
    const result = toMatchupSummary(makeMatchup(), "Matthew");

    expect(result.self).toEqual({ name: "Matthew", score: 17 });
    expect(result.opponent).toEqual({ name: "Coop", score: 35 });
  });

  it("puts the requested manager under self and the other under opponent when they're manager_2", () => {
    const result = toMatchupSummary(makeMatchup(), "Coop");

    expect(result.self).toEqual({ name: "Coop", score: 35 });
    expect(result.opponent).toEqual({ name: "Matthew", score: 17 });
  });

  it("passes through the winner field unchanged", () => {
    const result = toMatchupSummary(makeMatchup({ winner: "Coop" }), "Coop");

    expect(result.winner).toBe("Coop");
  });
});
