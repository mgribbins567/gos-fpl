import { useState } from "react";
import { submitWaiverClaim } from "../lib/waiverData";

export function useWaiverClaimBuilder({
  leagueId,
  manager,
  supabase,
  gameweekId,
  onSubmitted,
}) {
  const [pendingAddPlayer, setPendingAddPlayer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function startClaim(freeAgentPlayer) {
    setError(null);
    setPendingAddPlayer(freeAgentPlayer);
  }

  function cancel() {
    setPendingAddPlayer(null);
    setError(null);
    setSubmitting(false);
  }

  async function selectDropPlayer(ownPlayer) {
    setSubmitting(true);
    setError(null);
    try {
      await submitWaiverClaim(supabase, {
        leagueId,
        managerId: manager.id,
        dropPlayerId: ownPlayer.player_id,
        addPlayerId: pendingAddPlayer.id,
        gameweekId,
      });
      onSubmitted();
      cancel();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return {
    isSelecting: !!pendingAddPlayer,
    pendingAddPlayer,
    submitting,
    error,
    startClaim,
    selectDropPlayer,
    cancel,
  };
}
