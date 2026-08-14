import { ELEMENT_TYPE } from "./fplData";

const FORMATION_RULES = {
  totalStarters: 11,
  [ELEMENT_TYPE.GOALKEEPER]: { min: 1, max: 1 },
  [ELEMENT_TYPE.DEFENDER]: { min: 3, max: 5 },
  [ELEMENT_TYPE.MIDFIELDER]: { min: 2, max: 5 },
  [ELEMENT_TYPE.FORWARD]: { min: 1, max: 3 },
};

const AUTOSUB_STARTER_PRIORITY = [
  ELEMENT_TYPE.FORWARD,
  ELEMENT_TYPE.MIDFIELDER,
  ELEMENT_TYPE.DEFENDER,
];

export function validateLineup(players) {
  const starters = players.filter((p) => p.is_starter);

  if (starters.length !== FORMATION_RULES.totalStarters) {
    throw new Error(
      `A starting lineup must have exactly ${FORMATION_RULES.totalStarters} players (has ${starters.length})`,
    );
  }

  for (const elementType of [
    ELEMENT_TYPE.GOALKEEPER,
    ELEMENT_TYPE.DEFENDER,
    ELEMENT_TYPE.MIDFIELDER,
    ELEMENT_TYPE.FORWARD,
  ]) {
    const count = starters.filter((p) => p.elementType === elementType).length;
    const { min, max } = FORMATION_RULES[elementType];
    if (count < min || count > max) {
      throw new Error(
        `Invalid formation: ${count} players at position ${elementType} (must be between ${min} and ${max})`,
      );
    }
  }

  const bench = players.filter((p) => !p.is_starter);
  const benchOrders = bench.map((p) => p.bench_order).sort((a, b) => a - b);
  const expectedOrders = bench.map((_, i) => i + 1);
  if (JSON.stringify(benchOrders) !== JSON.stringify(expectedOrders)) {
    throw new Error(
      `Bench order must be a contiguous sequence starting at 1 (got: ${benchOrders.join(", ")})`,
    );
  }

  const benchSlotOne = bench.find((p) => p.bench_order === 1);
  if (benchSlotOne && benchSlotOne.elementType !== ELEMENT_TYPE.GOALKEEPER) {
    throw new Error("Bench slot 1 must be a goalkeeper.");
  }
  const misplacedGoalkeepers = bench.filter(
    (p) => p.bench_order !== 1 && p.elementType === ELEMENT_TYPE.GOALKEEPER,
  );
  if (misplacedGoalkeepers.length > 0) {
    throw new Error("A goalkeeper may only be placed in bench slot 1.");
  }
}

export function swapLineupSlots(players, playerIdA, playerIdB) {
  const a = players.find((p) => p.player_id === playerIdA);
  const b = players.find((p) => p.player_id === playerIdB);
  if (!a) throw new Error(`Player ${playerIdA} not found in lineup`);
  if (!b) throw new Error(`Player ${playerIdB} not found in lineup`);
  if (a.is_starter && b.is_starter) {
    throw new Error(
      "Cannot swap two starters with each other — select a bench player to substitute in.",
    );
  }

  return players.map((p) => {
    if (p.player_id === playerIdA)
      return { ...p, is_starter: b.is_starter, bench_order: b.bench_order };
    if (p.player_id === playerIdB)
      return { ...p, is_starter: a.is_starter, bench_order: a.bench_order };
    return p;
  });
}

export function getValidSwapTargets(players, sourcePlayer) {
  return players
    .filter((candidate) => candidate.player_id !== sourcePlayer.player_id)
    .filter((candidate) => {
      try {
        validateLineup(
          swapLineupSlots(players, sourcePlayer.player_id, candidate.player_id),
        );
        return true;
      } catch {
        return false;
      }
    })
    .map((candidate) => candidate.player_id);
}

export function getPositionMatchedPlayers(players, elementType) {
  return players.filter((p) => p.elementType === elementType);
}

export function applyAutoSubstitutions(players) {
  let working = players.map((p) => ({ ...p }));
  const subbedInPlayerIds = new Set();

  const startingGK = working.find(
    (p) => p.is_starter && p.elementType === ELEMENT_TYPE.GOALKEEPER,
  );
  const benchGK = working.find((p) => !p.is_starter && p.bench_order === 1);
  if (
    (startingGK?.minutes === 0 || !startingGK.minutes) &&
    benchGK?.minutes > 0
  ) {
    working = swapLineupSlots(working, startingGK.player_id, benchGK.player_id);
    subbedInPlayerIds.add(benchGK.player_id);
  }

  const outfieldBenchOrder = working
    .filter((p) => !p.is_starter && p.bench_order !== 1)
    .sort((a, b) => a.bench_order - b.bench_order)
    .map((p) => p.player_id);

  for (const benchPlayerId of outfieldBenchOrder) {
    const benchPlayer = working.find((p) => p.player_id === benchPlayerId);
    if (!benchPlayer || benchPlayer.is_starter || benchPlayer.minutes === 0)
      continue;

    const zeroMinuteStarters = working
      .filter(
        (p) =>
          p.is_starter &&
          p.elementType !== ELEMENT_TYPE.GOALKEEPER &&
          (p.minutes === 0 || !p.minutes),
      )
      .sort(
        (a, b) =>
          AUTOSUB_STARTER_PRIORITY.indexOf(a.elementType) -
          AUTOSUB_STARTER_PRIORITY.indexOf(b.elementType),
      );

    for (const starter of zeroMinuteStarters) {
      const candidate = swapLineupSlots(
        working,
        starter.player_id,
        benchPlayer.player_id,
      );
      try {
        validateLineup(candidate);
        working = candidate;
        subbedInPlayerIds.add(benchPlayer.player_id);
        break;
      } catch {}
    }
  }

  return { players: working, subbedInPlayerIds };
}

export function buildAutoSubUpdates(
  originalRows,
  subbedPlayers,
  subbedInPlayerIds,
) {
  const originalByPlayerId = new Map(originalRows.map((r) => [r.player_id, r]));
  const updates = [];
  for (const player of subbedPlayers) {
    const original = originalByPlayerId.get(player.player_id);
    if (!original) continue;
    if (
      original.is_starter !== player.is_starter ||
      original.bench_order !== player.bench_order
    ) {
      updates.push({
        player_id: player.player_id,
        is_starter: player.is_starter,
        bench_order: player.bench_order,
        was_auto_subbed: subbedInPlayerIds.has(player.player_id),
      });
    }
  }
  return updates;
}
