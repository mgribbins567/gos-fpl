import { defineQuery } from "./defineQuery.js";
import { useSupabaseQuery } from "./useSupabaseQuery.js";
import { STALE_TIME } from "../../lib/queryConfig";
import {
  getGameweekLineup,
  getGameweekLineupsForManagers,
  getPlayerOwnershipHistory,
} from "../../lib/teamHistory.js";

export function useGameweekLineup(supabase, managerId, gameweekId) {
  return useSupabaseQuery(
    ["gameweekLineup", managerId, gameweekId],
    () => getGameweekLineup(supabase, managerId, gameweekId),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const gameweekLineupQuery = defineQuery(
  (supabase, managerId, gameweekId) => [
    "gameweekLineup",
    managerId,
    gameweekId,
  ],
  (supabase, managerId, gameweekId) =>
    getGameweekLineup(supabase, managerId, gameweekId),
  STALE_TIME.SLOW,
);

export function useGameweekLineupsForManagers(
  supabase,
  managerIds,
  gameweekId,
) {
  return useSupabaseQuery(
    ["gameweekLineupsForManagers", managerIds, gameweekId],
    () => getGameweekLineupsForManagers(supabase, managerIds, gameweekId),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const gameweekLineupsForManagersQuery = defineQuery(
  (supabase, managerIds, gameweekId) => [
    "gameweekLineupsForManagers",
    managerIds,
    gameweekId,
  ],
  (supabase, managerIds, gameweekId) =>
    getGameweekLineupsForManagers(supabase, managerIds, gameweekId),
  STALE_TIME.SLOW,
);

export function usePlayerOwnershipHistory(supabase, seasonId, playerId) {
  return useSupabaseQuery(
    ["playerOwnershipHistory", seasonId, playerId],
    () => getPlayerOwnershipHistory(supabase, seasonId, playerId),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const playerOwnershipHistoryQuery = defineQuery(
  (supabase, seasonId, playerId) => [
    "playerOwnershipHistory",
    seasonId,
    playerId,
  ],
  (supabase, seasonId, playerId) =>
    getPlayerOwnershipHistory(supabase, seasonId, playerId),
  STALE_TIME.SLOW,
);
