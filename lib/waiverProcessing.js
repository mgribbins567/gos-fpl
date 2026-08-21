export function groupClaimsByManager(claims) {
  const map = new Map();
  for (const claim of claims) {
    if (!map.has(claim.manager_id)) map.set(claim.manager_id, []);
    map.get(claim.manager_id).push(claim);
  }
  return map;
}

export function getWaiverPriorityOrder(
  managerIds,
  managersInLeague,
  standingsRows,
  draftOrderByManagerId,
) {
  const standingsByName = new Map(standingsRows.map((r) => [r.name, r]));
  return managerIds
    .map((id) => {
      const name = managersInLeague.get(id)?.name ?? String(id);
      const record = standingsByName.get(name);
      const draftPosition = draftOrderByManagerId.get(id);
      if (draftPosition === undefined) {
        throw new Error(
          `No draft order recorded for manager ${id} (name: "${name}") — cannot determine waiver tiebreak order`,
        );
      }
      return {
        managerId: id,
        wins: record?.wins ?? 0,
        pointsFor: record?.pointsFor ?? 0,
        draftPosition,
      };
    })
    .sort(
      (a, b) =>
        a.wins - b.wins ||
        a.pointsFor - b.pointsFor ||
        b.draftPosition - a.draftPosition,
    )
    .map((r) => r.managerId);
}

export function buildWaiverProcessingOrder(
  claims,
  standingsRows,
  managersInLeague,
  draftOrderByManagerId,
) {
  const managerIds = [...new Set(claims.map((c) => c.manager_id))];
  return getWaiverPriorityOrder(
    managerIds,
    managersInLeague,
    standingsRows,
    draftOrderByManagerId,
  );
}

export async function processWaivers(claimsByManagerId, order, attemptClaim) {
  const remaining = new Map(
    [...claimsByManagerId.entries()].map(([id, claims]) => [id, [...claims]]),
  );
  const results = [];

  let anyAttempted = true;
  while (anyAttempted) {
    anyAttempted = false;
    for (const managerId of order) {
      const queue = remaining.get(managerId);
      if (!queue || queue.length === 0) continue;

      let succeededThisTurn = false;
      while (queue.length > 0 && !succeededThisTurn) {
        const claim = queue.shift();
        anyAttempted = true;
        const status = await attemptClaim(claim);
        results.push({ claimId: claim.id, status });
        if (status === "successful") succeededThisTurn = true;
      }
    }
  }
  return results;
}

export function computeWaiverDisplayOrder(claims, order) {
  const claimsByManagerId = groupClaimsByManager(claims);
  const remaining = new Map(
    [...claimsByManagerId.entries()].map(([id, claims]) => [id, [...claims]]),
  );
  const sequence = [];

  let anyAttempted = true;
  while (anyAttempted) {
    anyAttempted = false;
    for (const managerId of order) {
      const queue = remaining.get(managerId);
      if (!queue || queue.length === 0) continue;

      let succeededThisTurn = false;
      while (queue.length > 0 && !succeededThisTurn) {
        const claim = queue.shift();
        anyAttempted = true;
        sequence.push(claim);
        if (claim.status === "successful") succeededThisTurn = true;
      }
    }
  }
  return sequence;
}

export function filterGameweeksDueForProcessing(gameweeks, now = new Date()) {
  return gameweeks.filter((gw) => {
    if (!gw.deadline_time) return false;
    const cutoff = new Date(
      new Date(gw.deadline_time).getTime() - 24 * 60 * 60 * 1000,
    );
    return now >= cutoff;
  });
}
