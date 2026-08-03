export async function getReceivingManagerRoster(
  supabase,
  leagueId,
  receivingManagerId,
) {
  const { data, error } = await supabase
    .from("team_players")
    .select("player_id")
    .eq("league_id", leagueId)
    .eq("manager_id", receivingManagerId);
  if (error) throw new Error(error.message);
  return data.map((row) => row.player_id);
}

export async function proposeTrade(
  supabase,
  { leagueId, proposingManagerId, receivingManagerId, gameweekId, pairings },
) {
  const { data, error } = await supabase.rpc("propose_trade", {
    p_league_id: leagueId,
    p_proposing_manager_id: proposingManagerId,
    p_receiving_manager_id: receivingManagerId,
    p_gameweek_id: gameweekId,
    p_pairings: pairings.map((p) => ({
      proposer_player_id: p.proposerPlayerId,
      receiver_player_id: p.receiverPlayerId,
    })),
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function respondToTradeAsReceiver(supabase, tradeId, accept) {
  const { error } = await supabase.rpc("respond_to_trade_as_receiver", {
    p_trade_id: tradeId,
    p_accept: accept,
  });
  if (error) throw new Error(error.message);
}

export async function respondToTradeAsAdmin(
  supabase,
  tradeId,
  accept,
  adminManagerId,
) {
  const { error } = await supabase.rpc("respond_to_trade_as_admin", {
    p_trade_id: tradeId,
    p_accept: accept,
    p_admin_manager_id: adminManagerId,
  });
  if (error) throw new Error(error.message);
}

async function getTradesWithPairings(supabase, query) {
  const { data: trades, error } = await query;
  if (error) throw new Error(error.message);
  if (trades.length === 0) return { trades: [], pairings: [] };
  const { data: pairings, error: pairingsError } = await supabase
    .from("TradePairing")
    .select("*")
    .in(
      "trade_id",
      trades.map((t) => t.id),
    );
  if (pairingsError) throw new Error(pairingsError.message);
  return { trades, pairings };
}

export function getPendingTradesForReceiver(supabase, managerId) {
  return getTradesWithPairings(
    supabase,
    supabase
      .from("Trade")
      .select("*")
      .eq("receiving_manager_id", managerId)
      .eq("status", "pending_receiver"),
  );
}

export function getPendingTradesForAdmin(supabase) {
  return getTradesWithPairings(
    supabase,
    supabase.from("Trade").select("*").eq("status", "pending_admin"),
  );
}

export async function getManagersByIds(supabase, managerIds) {
  const { data, error } = await supabase
    .from("Manager")
    .select("*")
    .in("id", managerIds);
  if (error) throw new Error(error.message);
  return new Map(data.map((m) => [m.id, m]));
}

export async function getLeaguesByIds(supabase, leagueIds) {
  const { data, error } = await supabase
    .from("League")
    .select("*")
    .in("id", leagueIds);
  if (error) throw new Error(error.message);
  return new Map(data.map((l) => [l.id, l]));
}
