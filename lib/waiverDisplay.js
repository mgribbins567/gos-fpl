export function resolveWaiverClaims(claims, bootstrap) {
  const elementsById = new Map(bootstrap.elements.map((e) => [e.id, e]));
  return claims.map((claim) => ({
    id: claim.id,
    priority: claim.priority,
    dropPlayerName:
      elementsById.get(claim.drop_player_id)?.web_name ??
      `#${claim.drop_player_id}`,
    addPlayerName:
      elementsById.get(claim.add_player_id)?.web_name ??
      `#${claim.add_player_id}`,
  }));
}
