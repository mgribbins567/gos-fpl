import { useState } from "react";
import { proposeTrade } from "../lib/tradeData";

export function useTradeBuilder({
  leagueId,
  manager,
  supabase,
  gameweekId,
  onProposed,
}) {
  const [receivingManagerId, setReceivingManagerId] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [pendingReceiverPlayer, setPendingReceiverPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  function startWithTarget(targetManagerId, receiverPlayer) {
    setError(null);
    if (receivingManagerId && receivingManagerId !== targetManagerId) {
      setPairings([]);
    }
    setReceivingManagerId(targetManagerId);
    setPendingReceiverPlayer(receiverPlayer);
  }

  function addAnotherReceiverPlayer(receiverPlayer) {
    setPendingReceiverPlayer(receiverPlayer);
  }

  function selectProposerPlayer(ownPlayer) {
    setPairings((prev) => [
      ...prev,
      {
        proposerPlayerId: ownPlayer.player_id,
        proposerPlayerName: ownPlayer.name,
        receiverPlayerId: pendingReceiverPlayer.id,
        receiverPlayerName: pendingReceiverPlayer.web_name,
      },
    ]);
    setPendingReceiverPlayer(null);
  }

  function removePairing(receiverPlayerId) {
    setPairings((prev) =>
      prev.filter((p) => p.receiverPlayerId !== receiverPlayerId),
    );
  }

  function cancel() {
    setReceivingManagerId(null);
    setPairings([]);
    setPendingReceiverPlayer(null);
    setSubmitting(false);
    setError(null);
    setConfirming(false);
  }

  async function send() {
    setSubmitting(true);
    try {
      await proposeTrade(supabase, {
        leagueId,
        proposingManagerId: manager.id,
        receivingManagerId,
        gameweekId,
        pairings,
      });
      onProposed();
      cancel();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function cancelPendingSelection() {
    setPendingReceiverPlayer(null);
  }

  return {
    receivingManagerId,
    pairings,
    pendingReceiverPlayer,
    isSelectingProposerPlayer: !!pendingReceiverPlayer,
    isActive: !!receivingManagerId,
    confirming,
    submitting,
    error,
    startWithTarget,
    addAnotherReceiverPlayer,
    selectProposerPlayer,
    removePairing,
    cancelPendingSelection,
    openConfirm: () => setConfirming(true),
    closeConfirm: () => setConfirming(false),
    cancel,
    send,
  };
}
