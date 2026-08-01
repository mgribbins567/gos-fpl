import { useState } from "react";
import { signFreeAgent } from "../lib/transactionsData";

export function useFreeAgentSigning({
  leagueId,
  manager,
  supabase,
  gameweekId,
  nextGameweekId,
  onSigned,
}) {
  const [pendingAddPlayer, setPendingAddPlayer] = useState(null);
  const [pendingDropPlayer, setPendingDropPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function startSigning(freeAgentPlayer) {
    setError(null);
    setPendingAddPlayer(freeAgentPlayer);
  }

  function selectDropPlayer(ownPlayer) {
    setPendingDropPlayer(ownPlayer);
  }

  function cancel() {
    setPendingAddPlayer(null);
    setPendingDropPlayer(null);
    setError(null);
  }

  async function confirm() {
    setSubmitting(true);
    try {
      await signFreeAgent(supabase, {
        leagueId,
        managerId: manager.id,
        dropPlayerId: pendingDropPlayer.player_id,
        addPlayerId: pendingAddPlayer.id,
        gameweekId,
        nextGameweekId,
      });
      onSigned();
      cancel();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return {
    isSelecting: !!pendingAddPlayer && !pendingDropPlayer,
    isConfirming: !!pendingAddPlayer && !!pendingDropPlayer,
    pendingAddPlayer,
    pendingDropPlayer,
    submitting,
    error,
    startSigning,
    selectDropPlayer,
    cancel,
    confirm,
  };
}
