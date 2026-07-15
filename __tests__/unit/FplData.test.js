import { describe, it, expect } from "vitest";
import {
  getCurrentGameweek,
  isGameweekLive,
  getShirtUrl,
  mergeTeamWithLiveData,
  groupPlayersByPosition,
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

describe("getCurrentGameweek", () => {
  it("returns the id of the event marked is_current", () => {
    const bootstrap = makeBootstrap({
      events: [makeEvent(1), makeEvent(2, { isCurrent: true }), makeEvent(3)],
    });

    expect(getCurrentGameweek(bootstrap)).toBe(2);
  });

  it("throws when no event is marked is_current", () => {
    const bootstrap = makeBootstrap({ events: [makeEvent(1), makeEvent(2)] });

    expect(() => getCurrentGameweek(bootstrap)).toThrow(
      "No current gameweek found in bootstrap-static data",
    );
  });
});

describe("isGameweekLive", () => {
  it("returns true when the gameweek exists and is not finished", () => {
    const bootstrap = makeBootstrap({
      events: [makeEvent(5, { finished: false })],
    });

    expect(isGameweekLive(bootstrap, 5)).toBe(true);
  });

  it("returns false when the gameweek exists and is finished", () => {
    const bootstrap = makeBootstrap({
      events: [makeEvent(5, { finished: true })],
    });

    expect(isGameweekLive(bootstrap, 5)).toBe(false);
  });

  it("throws when the gameweek is not found", () => {
    const bootstrap = makeBootstrap({ events: [makeEvent(5)] });

    expect(() => isGameweekLive(bootstrap, 99)).toThrow(
      "Gameweek 99 not found in bootstrap-static data",
    );
  });
});

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

  it("throws when a player_id is not found in live event elements", () => {
    const team = [makeTeamPlayer({ player_id: 50 })];
    const bootstrap = makeBootstrap({
      elements: [makeElement(50, { team: 1 })],
      teams: [makeTeam(1, 3)],
    });
    const live = makeLive([]);

    expect(() => mergeTeamWithLiveData(team, bootstrap, live)).toThrow(
      "Player 50 not found in live event data",
    );
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
