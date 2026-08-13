import { describe, it, expect } from "vitest";
import {
  toLeagueMatchupSummary,
  getFeaturedMatchups,
  computeStandings,
  getStandingsHistory,
} from "../../lib/leagueLogic";

function makeMatchup(overrides = {}) {
  return {
    id: "m1",
    gameweek_id: "gw-1",
    manager_1: "Matthew",
    manager_2: "Coop",
    manager_1_score: 41,
    manager_2_score: 38,
    winner: "Matthew",
    ...overrides,
  };
}

describe("toLeagueMatchupSummary", () => {
  it("uses the matchup's stored scores when no scoreByName map is given", () => {
    const result = toLeagueMatchupSummary(makeMatchup());
    expect(result.manager1).toEqual({ name: "Matthew", score: 41 });
    expect(result.manager2).toEqual({ name: "Coop", score: 38 });
  });

  it("uses scores from scoreByName when provided, overriding stored scores", () => {
    const scoreByName = new Map([
      ["Matthew", 60],
      ["Coop", 55],
    ]);
    const result = toLeagueMatchupSummary(makeMatchup(), scoreByName);
    expect(result.manager1.score).toBe(60);
    expect(result.manager2.score).toBe(55);
  });

  it("passes through id and winner unchanged", () => {
    const result = toLeagueMatchupSummary(
      makeMatchup({ id: "m42", winner: "Coop" }),
    );
    expect(result.id).toBe("m42");
    expect(result.winner).toBe("Coop");
  });
});

describe("getFeaturedMatchups", () => {
  it("returns empty array for an empty list", () => {
    expect(getFeaturedMatchups([])).toEqual({
      highestScoring: [],
      closest: [],
    });
  });

  it("returns matchup only to one", () => {
    const summary = toLeagueMatchupSummary(makeMatchup());
    const result = getFeaturedMatchups([summary]);
    expect(result.highestScoring[0].id).toBe(summary.id);
    expect(result.closest).toStrictEqual([]);
  });

  it("picks the matchup with the highest combined score as highestScoring", () => {
    const low = toLeagueMatchupSummary(
      makeMatchup({ id: "low", manager_1_score: 20, manager_2_score: 18 }),
    );
    const high = toLeagueMatchupSummary(
      makeMatchup({ id: "high", manager_1_score: 70, manager_2_score: 65 }),
    );
    const result = getFeaturedMatchups([low, high]);
    expect(result.highestScoring[0].id).toBe("high");
  });

  it("picks the matchup with the smallest score gap as closest", () => {
    const blowout1 = toLeagueMatchupSummary(
      makeMatchup({ id: "blowout1", manager_1_score: 90, manager_2_score: 20 }),
    );
    const blowout2 = toLeagueMatchupSummary(
      makeMatchup({
        id: "blowout2",
        manager_1_score: 100,
        manager_2_score: 30,
      }),
    );
    const nailbiter = toLeagueMatchupSummary(
      makeMatchup({
        id: "nailbiter",
        manager_1_score: 50,
        manager_2_score: 49,
      }),
    );
    const result = getFeaturedMatchups([blowout1, blowout2, nailbiter]);
    expect(result.closest[0].id).toBe("nailbiter");
  });

  it("filters to maximum 4 matchups", () => {
    const high1 = toLeagueMatchupSummary(
      makeMatchup({ id: "high1", manager_1_score: 61, manager_2_score: 60 }),
    );
    const high2 = toLeagueMatchupSummary(
      makeMatchup({ id: "high2", manager_1_score: 58, manager_2_score: 72 }),
    );
    const low1 = toLeagueMatchupSummary(
      makeMatchup({ id: "low1", manager_1_score: 30, manager_2_score: 10 }),
    );
    const low2 = toLeagueMatchupSummary(
      makeMatchup({ id: "low2", manager_1_score: 16, manager_2_score: 11 }),
    );
    const low3 = toLeagueMatchupSummary(
      makeMatchup({ id: "low3", manager_1_score: 22, manager_2_score: 23 }),
    );
    const result = getFeaturedMatchups([high1, high2, low1, low2, low3]);
    expect(result.highestScoring.length).toBe(2);
    expect(result.closest.length).toBe(2);
    expect(result.highestScoring[0].id).toBe("high2");
    expect(result.highestScoring[1].id).toBe("high1");
    expect(result.closest[0].id).toBe("low3");
    expect(result.closest[1].id).toBe("low2");
  });
});

describe("computeStandings", () => {
  it("excludes unplayed matchups (null scores) from every manager's record", () => {
    const matchups = [
      makeMatchup({
        manager_1_score: null,
        manager_2_score: null,
        winner: null,
      }),
    ];
    const standings = computeStandings(matchups);
    expect(standings).toEqual([]);
  });

  it("counts a win for the winner and a loss for the loser", () => {
    const standings = computeStandings([makeMatchup()]);
    const Matthew = standings.find((r) => r.name === "Matthew");
    const Coop = standings.find((r) => r.name === "Coop");
    expect(Matthew).toMatchObject({ wins: 1, losses: 0, draws: 0 });
    expect(Coop).toMatchObject({ wins: 0, losses: 1, draws: 0 });
  });

  it("counts a tie for both managers when winner is null but scores are present", () => {
    const standings = computeStandings([
      makeMatchup({ manager_1_score: 40, manager_2_score: 40, winner: null }),
    ]);
    const Matthew = standings.find((r) => r.name === "Matthew");
    const Coop = standings.find((r) => r.name === "Coop");
    expect(Matthew).toMatchObject({ wins: 0, losses: 0, draws: 1 });
    expect(Coop).toMatchObject({ wins: 0, losses: 0, draws: 1 });
  });

  it("accumulates pointsFor and pointsAgainst across multiple matchups", () => {
    const matchups = [
      makeMatchup({
        id: "m1",
        gameweek_id: "gw-1",
        manager_1_score: 41,
        manager_2_score: 38,
      }),
      makeMatchup({
        id: "m2",
        gameweek_id: "gw-2",
        manager_1_score: 30,
        manager_2_score: 50,
        winner: "Coop",
      }),
    ];
    const standings = computeStandings(matchups);
    const Matthew = standings.find((r) => r.name === "Matthew");
    expect(Matthew.pointsFor).toBe(71);
    expect(Matthew.pointsAgainst).toBe(88);
  });

  it("sorts by wins descending, then pointsFor descending as a tiebreaker", () => {
    const matchups = [
      makeMatchup({
        id: "m1",
        gameweek_id: "gw-1",
        manager_1: "Matthew",
        manager_2: "Coop",
        manager_1_score: 41,
        manager_2_score: 38,
        winner: "Matthew",
      }),
      makeMatchup({
        id: "m2",
        gameweek_id: "gw-1",
        manager_1: "Kevin",
        manager_2: "Chris",
        manager_1_score: 60,
        manager_2_score: 55,
        winner: "Kevin",
      }),
      makeMatchup({
        id: "m3",
        gameweek_id: "gw-2",
        manager_1: "Coop",
        manager_2: "Chris",
        manager_1_score: 20,
        manager_2_score: 45,
        winner: "Chris",
      }),
    ];
    const standings = computeStandings(matchups);
    // Matthew: 1-0, Kevin: 1-0, Coop: 0-2, Chris: 1-1
    // Matthew vs Kevin tiebreak on pointsFor: Beth 60 > Matthew 41
    expect(standings.map((r) => r.name)).toEqual([
      "Chris",
      "Kevin",
      "Matthew",
      "Coop",
    ]);
  });
});

describe("getStandingsHistory", () => {
  function makeWeeklyMatchup(gameweekNumber, overrides = {}) {
    return {
      id: `m-gw${gameweekNumber}`,
      gameweekNumber,
      manager_1: "Matthew",
      manager_2: "Coop",
      manager_1_score: 41,
      manager_2_score: 38,
      winner: "Matthew",
      ...overrides,
    };
  }

  it("returns a Map with one snapshot per finished gameweek, in ascending order", () => {
    const matchups = [
      makeWeeklyMatchup(1),
      makeWeeklyMatchup(2, { winner: "Coop" }),
    ];
    const history = getStandingsHistory(matchups);
    const MatthewHistory = history.get("Matthew");
    expect(MatthewHistory.map((s) => s.gameweek)).toEqual([1, 2]);
  });

  it("tracks cumulative wins/losses/pointsFor correctly across weeks", () => {
    const matchups = [
      makeWeeklyMatchup(1, {
        manager_1_score: 41,
        manager_2_score: 38,
        winner: "Matthew",
      }),
      makeWeeklyMatchup(2, {
        manager_1_score: 30,
        manager_2_score: 50,
        winner: "Coop",
      }),
    ];
    const history = getStandingsHistory(matchups);
    const MatthewWeek2 = history.get("Matthew")[1];
    expect(MatthewWeek2).toMatchObject({ wins: 1, losses: 1, pointsFor: 71 });
  });

  it("assigns rank 1 and 2 correctly and updates rank as records change", () => {
    const matchups = [
      makeWeeklyMatchup(1, {
        manager_1_score: 41,
        manager_2_score: 38,
        winner: "Matthew",
      }),
      makeWeeklyMatchup(2, {
        manager_1_score: 20,
        manager_2_score: 60,
        winner: "Coop",
      }),
    ];
    const history = getStandingsHistory(matchups);
    expect(history.get("Matthew")[0].rank).toBe(1); // week 1: Matthew leads 1-0
    expect(history.get("Coop")[1].rank).toBe(1); // week 2: tied 1-1, Coop leads on pointsFor
  });

  it("excludes unplayed gameweeks from the history entirely", () => {
    const matchups = [
      makeWeeklyMatchup(1),
      makeWeeklyMatchup(2, {
        manager_1_score: null,
        manager_2_score: null,
        winner: null,
      }),
    ];
    const history = getStandingsHistory(matchups);
    expect(history.get("Matthew").map((s) => s.gameweek)).toEqual([1]);
  });

  it("only starts a manager's history from the gameweek they first appear in", () => {
    const matchups = [
      makeWeeklyMatchup(1, { manager_1: "Matthew", manager_2: "Coop" }),
      {
        id: "m-gw2-new",
        gameweekNumber: 2,
        manager_1: "Matthew",
        manager_2: "Beth",
        manager_1_score: 30,
        manager_2_score: 10,
        winner: "Matthew",
      },
    ];
    const history = getStandingsHistory(matchups);
    expect(history.has("Beth")).toBe(true);
    expect(history.get("Beth").map((s) => s.gameweek)).toEqual([2]);
    expect(history.get("Matthew").map((s) => s.gameweek)).toEqual([1, 2]);
  });

  it("returns an empty Map when given no matchups", () => {
    expect(getStandingsHistory([]).size).toBe(0);
  });
});
