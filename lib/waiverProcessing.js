export function groupClaimsByManager(claims) {
  const map = new Map();
  for (const claim of claims) {
    if (!map.has(claim.manager_id)) map.set(claim.manager_id, []);
    map.get(claim.manager_id).push(claim);
  }
  return map;
}

export function buildWaiverProcessingOrder(
  claims,
  standingsRows,
  managersInLeague,
) {
  const managerIds = [...new Set(claims.map((c) => c.manager_id))];
  const standingsByName = new Map(standingsRows.map((r) => [r.name, r]));

  return managerIds
    .map((id) => {
      const name = managersInLeague.get(id)?.name ?? String(id);
      const record = standingsByName.get(name);
      return {
        managerId: id,
        wins: record?.wins ?? 0,
        pointsFor: record?.pointsFor ?? 0,
        name,
      };
    })
    .sort(
      (a, b) =>
        a.wins - b.wins ||
        a.pointsFor - b.pointsFor ||
        a.name.localeCompare(b.name),
    )
    .map((r) => r.managerId);
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

export function filterGameweeksDueForProcessing(gameweeks, now = new Date()) {
  return gameweeks.filter((gw) => {
    if (!gw.deadline_time) return false;
    const cutoff = new Date(
      new Date(gw.deadline_time).getTime() - 24 * 60 * 60 * 1000,
    );
    return now >= cutoff;
  });
}
