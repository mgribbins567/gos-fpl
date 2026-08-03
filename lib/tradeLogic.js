export const ADMIN_MANAGER_ID = 21;

export function isAdmin(managerId) {
  return managerId === ADMIN_MANAGER_ID;
}

export function buildResolvedTrades(
  trades,
  pairings,
  bootstrap,
  managersById,
  leaguesById,
) {
  const elementsById = new Map(bootstrap.elements.map((e) => [e.id, e]));
  return trades.map((trade) => ({
    id: trade.id,
    leagueName: leaguesById?.get(trade.league_id)?.name ?? trade.league_id,
    proposingManagerName:
      managersById.get(trade.proposing_manager_id)?.name ??
      `Manager ${trade.proposing_manager_id}`,
    receivingManagerName:
      managersById.get(trade.receiving_manager_id)?.name ??
      `Manager ${trade.receiving_manager_id}`,
    pairings: pairings
      .filter((p) => p.trade_id === trade.id)
      .map((p) => ({
        id: p.id,
        proposerPlayerName:
          elementsById.get(p.proposer_player_id)?.web_name ??
          `#${p.proposer_player_id}`,
        receiverPlayerName:
          elementsById.get(p.receiver_player_id)?.web_name ??
          `#${p.receiver_player_id}`,
      })),
  }));
}
