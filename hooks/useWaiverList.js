import { useEffect, useState } from "react";
import {
  getWaiverClaimsForManager,
  deleteWaiverClaim,
  reorderWaiverClaim,
} from "../lib/waiverData";
import { resolveWaiverClaims } from "../lib/waiverDisplay";

export function useWaiverList(
  manager,
  leagueId,
  gameweekId,
  supabase,
  bootstrap,
) {
  const [claims, setClaims] = useState(undefined);
  const [error, setError] = useState(null);

  async function refresh() {
    try {
      const data = await getWaiverClaimsForManager(
        supabase,
        manager.id,
        leagueId,
        gameweekId,
      );
      setClaims(resolveWaiverClaims(data, bootstrap));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!manager || !leagueId || !gameweekId || !bootstrap) return;
    refresh();
  }, [manager, leagueId, gameweekId, supabase, bootstrap]);

  async function reorder(claim, newPriority) {
    await reorderWaiverClaim(supabase, claim.id, newPriority);
    await refresh();
  }
  async function remove(claim) {
    await deleteWaiverClaim(supabase, claim.id);
    await refresh();
  }

  return { claims, error, reorder, remove, refresh };
}
