import { ELEMENT_TYPE } from "./fplData";

const FORMATION_RULES = {
  totalStarters: 11,
  [ELEMENT_TYPE.GOALKEEPER]: { min: 1, max: 1 },
  [ELEMENT_TYPE.DEFENDER]: { min: 3, max: 5 },
  [ELEMENT_TYPE.MIDFIELDER]: { min: 2, max: 5 },
  [ELEMENT_TYPE.FORWARD]: { min: 1, max: 3 },
};

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
