import { describe, it, expect } from "vitest";
import {
  getShirtUrl,
  mergeTeamWithLiveData,
  groupPlayersByPosition,
  getFixtureDisplayText,
  getTotalStartingPoints,
} from "../../lib/fplData";

function makeBootstrap({ events = [], elements = [], teams = [] } = {}) {
  return { events, elements, teams };
}

function makeEvent(id, { isCurrent = false, finished = false } = {}) {
  return { id, is_current: isCurrent, finished };
}

function makeElement(
  id,
  { team = 1, elementType = 4, webName = `Player${id}` } = {},
) {
  return { id, team, element_type: elementType, web_name: webName };
}

function makeTeam(id, code) {
  return { id, code };
}

function makeLive(elements = []) {
  return { elements };
}

function makeLiveElement(id, stats = {}) {
  return { id, stats: { total_points: 0, minutes: 0, ...stats } };
}

function makeTeamPlayer(overrides = {}) {
  return {
    id: "row-1",
    manager_id: 21,
    player_id: 50,
    is_starter: true,
    bench_order: null,
    ...overrides,
  };
}

describe("getShirtUrl", () => {
  it("returns the standard shirt url for outfield positions", () => {
    expect(getShirtUrl(3, 4)).toBe(
      "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_3-66.png",
    );
  });

  it("returns the goalkeeper variant (with _1 suffix) for element_type 1", () => {
    expect(getShirtUrl(3, 1)).toBe(
      "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_3_1-66.png",
    );
  });
});

describe("mergeTeamWithLiveData", () => {
  it("merges name, team, position, and live stats onto each team_players row", () => {
    const team = [makeTeamPlayer({ id: "row-1", player_id: 50 })];
    const bootstrap = makeBootstrap({
      elements: [
        makeElement(50, { team: 1, elementType: 4, webName: "Haaland" }),
      ],
      teams: [makeTeam(1, 3)],
    });
    const live = makeLive([
      makeLiveElement(50, { total_points: 12, minutes: 90 }),
    ]);

    const result = mergeTeamWithLiveData(team, bootstrap, live);

    expect(result).toEqual([
      {
        id: "row-1",
        manager_id: 21,
        player_id: 50,
        is_starter: true,
        gameweekStats: {
          minutes: 90,
          total_points: 12,
        },
        seasonStats: {
          element_type: 4,
          id: 50,
          team: 1,
          web_name: "Haaland",
        },
        is_starter: true,
        explain: undefined,
        bench_order: null,
        name: "Haaland",
        teamId: 1,
        teamCode: 3,
        elementType: 4,
        points: 12,
        minutes: 90,
      },
    ]);
  });

  it("throws when a player_id is not found in bootstrap-static elements", () => {
    const team = [makeTeamPlayer({ player_id: 999 })];
    const bootstrap = makeBootstrap({ elements: [], teams: [] });
    const live = makeLive([]);

    expect(() => mergeTeamWithLiveData(team, bootstrap, live)).toThrow(
      "Player 999 not found in bootstrap-static data",
    );
  });

  it("returns null points/minutes/liveStats when a player has no live event entry (e.g. added to the game after this gameweek)", () => {
    const team = [makeTeamPlayer({ id: "row-1", player_id: 50 })];
    const bootstrap = makeBootstrap({
      elements: [
        makeElement(50, { team: 1, elementType: 4, webName: "NewSigning" }),
      ],
      teams: [makeTeam(1, 3)],
    });
    const live = makeLive([]);

    const result = mergeTeamWithLiveData(team, bootstrap, live);

    expect(result[0]).toMatchObject({
      points: null,
      minutes: null,
      liveStats: null,
      name: "NewSigning",
    });
  });

  it("throws when the player's team is not found in bootstrap-static teams", () => {
    const team = [makeTeamPlayer({ player_id: 50 })];
    const bootstrap = makeBootstrap({
      elements: [makeElement(50, { team: 1 })],
      teams: [], // team 1 missing
    });
    const live = makeLive([makeLiveElement(50)]);

    expect(() => mergeTeamWithLiveData(team, bootstrap, live)).toThrow(
      "Team 1 not found in bootstrap-static data",
    );
  });
});

describe("groupPlayersByPosition", () => {
  it("sorts starters into forwards, midfielders, defenders, goalkeepers by elementType", () => {
    const players = [
      { id: "fwd", is_starter: true, elementType: 4 },
      { id: "mid", is_starter: true, elementType: 3 },
      { id: "def", is_starter: true, elementType: 2 },
      { id: "gk", is_starter: true, elementType: 1 },
    ];

    const result = groupPlayersByPosition(players);

    expect(result.forwards).toEqual([players[0]]);
    expect(result.midfielders).toEqual([players[1]]);
    expect(result.defenders).toEqual([players[2]]);
    expect(result.goalkeepers).toEqual([players[3]]);
    expect(result.bench).toEqual([]);
  });

  it("excludes non-starters from the position rows and puts them on the bench", () => {
    const players = [
      { id: "starter", is_starter: true, elementType: 4 },
      { id: "sub", is_starter: false, elementType: 4, bench_order: 1 },
    ];

    const result = groupPlayersByPosition(players);

    expect(result.forwards).toEqual([players[0]]);
    expect(result.bench).toEqual([players[1]]);
  });

  it("sorts the bench by bench_order ascending", () => {
    const players = [
      { id: "third", is_starter: false, elementType: 2, bench_order: 3 },
      { id: "first", is_starter: false, elementType: 1, bench_order: 1 },
      { id: "second", is_starter: false, elementType: 3, bench_order: 2 },
    ];

    const result = groupPlayersByPosition(players);

    expect(result.bench.map((p) => p.id)).toEqual(["first", "second", "third"]);
  });

  it("returns empty groups for an empty players array", () => {
    const result = groupPlayersByPosition([]);

    expect(result).toEqual({
      forwards: [],
      midfielders: [],
      defenders: [],
      goalkeepers: [],
      bench: [],
    });
  });
});

describe("getFixtureDisplayText", () => {
  function makeFixture(overrides = {}) {
    return {
      opponentShortName: "ARS",
      isHome: true,
      started: false,
      finished: false,
      ...overrides,
    };
  }

  function makePlayerWithFixtures(points, fixtures) {
    return { points, fixtures };
  }

  it("shows points when fixtures is undefined (e.g. historical view where fixture status was never attached)", () => {
    const player = { points: 6 };
    expect(getFixtureDisplayText(player)).toBe(6);
  });

  it("shows '-' when fixtures is undefined and points is null", () => {
    const player = { points: null };
    expect(getFixtureDisplayText(player)).toBe("-");
  });

  it("shows points when the player has no fixtures this gameweek (blank gameweek)", () => {
    const player = makePlayerWithFixtures(0, []);
    expect(getFixtureDisplayText(player)).toBe(0);
  });

  it("shows '-' for a blank gameweek when points is null", () => {
    const player = makePlayerWithFixtures(null, []);
    expect(getFixtureDisplayText(player)).toBe("-");
  });

  it("shows the opponent only, with no points, when the single fixture hasn't started", () => {
    const player = makePlayerWithFixtures(0, [
      makeFixture({ opponentShortName: "ARS", isHome: true, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("ARS");
  });

  it("uses '@' for an away fixture", () => {
    const player = makePlayerWithFixtures(0, [
      makeFixture({ opponentShortName: "CHE", isHome: false, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("@CHE");
  });

  it("shows points once the single fixture has started", () => {
    const player = makePlayerWithFixtures(9, [
      makeFixture({ started: true, finished: true }),
    ]);
    expect(getFixtureDisplayText(player)).toBe(9);
  });

  it("shows points for a started-but-not-yet-finished fixture (currently live)", () => {
    const player = makePlayerWithFixtures(5, [
      makeFixture({ started: true, finished: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe(5);
  });

  it("shows 0 pts (not the opponent) for a player with zero minutes in an already-finished fixture — an unused sub, not someone yet to play", () => {
    const player = makePlayerWithFixtures(0, [
      makeFixture({ started: true, finished: true }),
    ]);
    expect(getFixtureDisplayText(player)).toBe(0);
  });

  it("shows both upcoming opponents, with no points, when neither of a double gameweek's fixtures has started", () => {
    const player = makePlayerWithFixtures(0, [
      makeFixture({ opponentShortName: "ARS", isHome: true, started: false }),
      makeFixture({ opponentShortName: "CHE", isHome: false, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("ARS, @CHE");
  });

  it("shows accumulated points plus the remaining opponent for a mid-double gameweek", () => {
    const player = makePlayerWithFixtures(9, [
      makeFixture({
        opponentShortName: "TM3",
        isHome: true,
        started: true,
        finished: true,
      }),
      makeFixture({ opponentShortName: "TM4", isHome: false, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("9, @TM4");
  });

  it("falls back to 0 in the mid-double prefix when points is null but a fixture has already started", () => {
    const player = makePlayerWithFixtures(null, [
      makeFixture({ started: true, finished: true }),
      makeFixture({ opponentShortName: "TM4", isHome: false, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("0, @TM4");
  });

  it("shows points only (no opponent list) once both fixtures in a double gameweek have started", () => {
    const player = makePlayerWithFixtures(14, [
      makeFixture({ started: true, finished: true }),
      makeFixture({ started: true, finished: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe(14);
  });

  it("lists multiple remaining opponents in fixture order for a triple-or-more gameweek with none started", () => {
    const player = makePlayerWithFixtures(0, [
      makeFixture({ opponentShortName: "ARS", isHome: true, started: false }),
      makeFixture({ opponentShortName: "CHE", isHome: false, started: false }),
      makeFixture({ opponentShortName: "MUN", isHome: true, started: false }),
    ]);
    expect(getFixtureDisplayText(player)).toBe("ARS, @CHE, MUN");
  });
});

describe("getTotalStartingPoints", () => {
  it("treats a null points value (no live data yet for that player) as 0 in the sum", () => {
    const players = [
      { is_starter: true, points: 10 },
      { is_starter: true, points: null },
    ];
    expect(getTotalStartingPoints(players)).toBe(20 - 10);
  });
});
