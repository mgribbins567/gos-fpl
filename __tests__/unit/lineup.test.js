import { describe, it, expect } from "vitest";
import {
  validateLineup,
  swapLineupSlots,
  getValidSwapTargets,
} from "../../lib/lineup";
import { ELEMENT_TYPE } from "../../lib/fplData";

function makePlayer(
  id,
  elementType,
  { isStarter = true, benchOrder = null } = {},
) {
  return {
    id: `row-${id}`,
    player_id: id,
    elementType,
    is_starter: isStarter,
    bench_order: benchOrder,
  };
}

function makeBaseLineup() {
  return [
    makePlayer(1, ELEMENT_TYPE.GOALKEEPER),
    makePlayer(2, ELEMENT_TYPE.DEFENDER),
    makePlayer(3, ELEMENT_TYPE.DEFENDER),
    makePlayer(4, ELEMENT_TYPE.DEFENDER),
    makePlayer(5, ELEMENT_TYPE.DEFENDER),
    makePlayer(6, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(7, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(8, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(9, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(10, ELEMENT_TYPE.FORWARD),
    makePlayer(11, ELEMENT_TYPE.FORWARD),
    makePlayer(12, ELEMENT_TYPE.GOALKEEPER, {
      isStarter: false,
      benchOrder: 1,
    }),
    makePlayer(13, ELEMENT_TYPE.DEFENDER, { isStarter: false, benchOrder: 2 }),
    makePlayer(14, ELEMENT_TYPE.MIDFIELDER, {
      isStarter: false,
      benchOrder: 3,
    }),
    makePlayer(15, ELEMENT_TYPE.FORWARD, { isStarter: false, benchOrder: 4 }),
  ];
}

function makeSingleForwardLineup() {
  return [
    makePlayer(1, ELEMENT_TYPE.GOALKEEPER),
    makePlayer(2, ELEMENT_TYPE.DEFENDER),
    makePlayer(3, ELEMENT_TYPE.DEFENDER),
    makePlayer(4, ELEMENT_TYPE.DEFENDER),
    makePlayer(5, ELEMENT_TYPE.DEFENDER),
    makePlayer(6, ELEMENT_TYPE.DEFENDER),
    makePlayer(7, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(8, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(9, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(10, ELEMENT_TYPE.MIDFIELDER),
    makePlayer(11, ELEMENT_TYPE.FORWARD),
    makePlayer(12, ELEMENT_TYPE.GOALKEEPER, {
      isStarter: false,
      benchOrder: 1,
    }),
    makePlayer(13, ELEMENT_TYPE.DEFENDER, { isStarter: false, benchOrder: 2 }),
    makePlayer(14, ELEMENT_TYPE.MIDFIELDER, {
      isStarter: false,
      benchOrder: 3,
    }),
    makePlayer(15, ELEMENT_TYPE.FORWARD, { isStarter: false, benchOrder: 4 }),
  ];
}

function makeLineupWithNoBenchGoalkeeper() {
  const lineup = makeBaseLineup();
  return lineup.map((p) =>
    p.player_id === 12 ? { ...p, elementType: ELEMENT_TYPE.DEFENDER } : p,
  );
}

describe("validateLineup", () => {
  it("does not throw for a valid classic-formation lineup", () => {
    expect(() => validateLineup(makeBaseLineup())).not.toThrow();
  });

  it("throws when starter count is not exactly 11", () => {
    const lineup = makeBaseLineup();
    lineup[0].is_starter = false;
    lineup[0].bench_order = 5;
    expect(() => validateLineup(lineup)).toThrow("exactly 11 players");
  });

  it("throws when there are 0 starting goalkeepers", () => {
    const lineup = makeBaseLineup();
    lineup.find((p) => p.player_id === 1).is_starter = false;
    lineup.find((p) => p.player_id === 12).is_starter = true;
    lineup.find((p) => p.player_id === 12).is_starter = false;
    expect(() => validateLineup(lineup)).toThrow("exactly 11 players");
  });

  it("throws when defenders are below the minimum of 3", () => {
    const lineup = makeBaseLineup();
    lineup
      .filter((p) => p.elementType === ELEMENT_TYPE.DEFENDER && p.is_starter)
      .slice(0, 2)
      .forEach((p) => {
        p.is_starter = false;
        p.bench_order = 99;
      });
    expect(() => validateLineup(lineup)).toThrow();
  });

  it("throws when forwards exceed the maximum of 3", () => {
    const lineup = makeBaseLineup();
    const benchForward = lineup.find((p) => p.player_id === 15);
    const starterMid = lineup.find((p) => p.player_id === 9);
    benchForward.is_starter = true;
    benchForward.bench_order = null;
    starterMid.is_starter = false;
    starterMid.bench_order = 4;
    const benchDef = lineup.find((p) => p.player_id === 13);
    benchDef.elementType = ELEMENT_TYPE.FORWARD;
    benchDef.is_starter = true;
    benchDef.bench_order = null;
    const anotherStarter = lineup.find((p) => p.player_id === 8);
    anotherStarter.is_starter = false;
    anotherStarter.bench_order = 2;
    expect(() => validateLineup(lineup)).toThrow(/position 4/);
  });

  it("throws when bench order is not a contiguous sequence starting at 1", () => {
    const lineup = makeBaseLineup();
    lineup.find((p) => p.player_id === 12).bench_order = 2;
    lineup.find((p) => p.player_id === 13).bench_order = 2;
    expect(() => validateLineup(lineup)).toThrow(
      "Bench order must be a contiguous sequence",
    );
  });
});

describe("swapLineupSlots", () => {
  it("swaps is_starter and bench_order between a starter and a bench player", () => {
    const lineup = makeBaseLineup();
    const result = swapLineupSlots(lineup, 1, 12);

    const newStarterGk = result.find((p) => p.player_id === 12);
    const newBenchGk = result.find((p) => p.player_id === 1);

    expect(newStarterGk).toMatchObject({ is_starter: true, bench_order: null });
    expect(newBenchGk).toMatchObject({ is_starter: false, bench_order: 1 });
  });

  it("leaves every other player in the lineup untouched", () => {
    const lineup = makeBaseLineup();
    const result = swapLineupSlots(lineup, 1, 12);
    const untouched = result.find((p) => p.player_id === 6);
    expect(untouched).toEqual(lineup.find((p) => p.player_id === 6));
  });

  it("swaps bench_order between two bench players (bench-to-bench reorder)", () => {
    const lineup = makeBaseLineup();
    const result = swapLineupSlots(lineup, 13, 14);

    expect(result.find((p) => p.player_id === 13)).toMatchObject({
      is_starter: false,
      bench_order: 3,
    });
    expect(result.find((p) => p.player_id === 14)).toMatchObject({
      is_starter: false,
      bench_order: 2,
    });
  });

  it("throws when attempting to swap two starters with each other", () => {
    const lineup = makeBaseLineup();
    expect(() => swapLineupSlots(lineup, 1, 2)).toThrow(
      "Cannot swap two starters with each other — select a bench player to substitute in.",
    );
  });

  it("throws when playerIdA is not found in the lineup", () => {
    const lineup = makeBaseLineup();
    expect(() => swapLineupSlots(lineup, 999, 12)).toThrow(
      "Player 999 not found in lineup",
    );
  });

  it("throws when playerIdB is not found in the lineup", () => {
    const lineup = makeBaseLineup();
    expect(() => swapLineupSlots(lineup, 1, 999)).toThrow(
      "Player 999 not found in lineup",
    );
  });

  it("produces a lineup that still passes validateLineup after a legal swap", () => {
    const lineup = makeBaseLineup();
    const result = swapLineupSlots(lineup, 10, 15);
    expect(() => validateLineup(result)).not.toThrow();
  });
});

describe("getValidSwapTargets", () => {
  it("only allows the sole starting forward to swap with the bench forward (not other positions)", () => {
    const lineup = makeSingleForwardLineup();
    const source = lineup.find((p) => p.player_id === 11);
    const targets = getValidSwapTargets(lineup, source);

    expect(targets).toEqual([15]);
  });

  it("excludes all other starters from a starter's valid targets", () => {
    const lineup = makeBaseLineup();
    const source = lineup.find((p) => p.player_id === 1);
    const targets = getValidSwapTargets(lineup, source);

    const starterIds = lineup
      .filter((p) => p.is_starter && p.player_id !== 1)
      .map((p) => p.player_id);
    for (const starterId of starterIds) {
      expect(targets).not.toContain(starterId);
    }
  });

  it("allows the starting goalkeeper to swap only with the bench goalkeeper", () => {
    const lineup = makeBaseLineup();
    const source = lineup.find((p) => p.player_id === 1);
    const targets = getValidSwapTargets(lineup, source);

    expect(targets).toEqual([12]);
  });

  it("returns an empty array when no bench player can legally replace the source", () => {
    const lineup = makeLineupWithNoBenchGoalkeeper();
    const source = lineup.find((p) => p.player_id === 1); // starting GK, no bench GK exists
    const targets = getValidSwapTargets(lineup, source);

    expect(targets).toEqual([]);
  });

  it("allows bench players to swap with each other (reordering)", () => {
    const lineup = makeBaseLineup();
    const source = lineup.find((p) => p.player_id === 13); // bench DEF
    const targets = getValidSwapTargets(lineup, source);

    expect(targets).toContain(14);
    expect(targets).toContain(12);
  });

  it("never includes the source player's own id", () => {
    const lineup = makeBaseLineup();
    const source = lineup.find((p) => p.player_id === 13);
    const targets = getValidSwapTargets(lineup, source);

    expect(targets).not.toContain(13);
  });
});
