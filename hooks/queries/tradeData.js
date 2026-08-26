import { defineQuery } from "./defineQuery.js";
import { useSupabaseQuery } from "./useSupabaseQuery.js";
import { STALE_TIME } from "../../lib/queryConfig";
import {
  getLeaguesByIds,
  getManagersByIds,
  getPendingTradesForAdmin,
  getPendingTradesForReceiver,
  getReceivingManagerRoster,
} from "../../lib/tradeData.js";

export function useReceivingManagerRoster(
  supabase,
  leagueId,
  receivingManagerId,
) {
  return useSupabaseQuery(
    ["receivingManagerRoster", leagueId, receivingManagerId],
    () => getReceivingManagerRoster(supabase, leagueId, receivingManagerId),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const receivingManagerRosterQuery = defineQuery(
  (supabase, leagueId, receivingManagerId) => [
    "receivingManagerRoster",
    leagueId,
    receivingManagerId,
  ],
  (supabase, leagueId, receivingManagerId) =>
    getReceivingManagerRoster(supabase, leagueId, receivingManagerId),
  STALE_TIME.FAST,
);

export function usePendingTradesForReceiver(supabase, managerId) {
  return useSupabaseQuery(
    ["pendingTradesForReceiver", managerId],
    () => getPendingTradesForReceiver(supabase, managerId),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const pendingTradesForReceiverQuery = defineQuery(
  (supabase, managerId) => ["pendingTradesForReceiver", managerId],
  (supabase, managerId) => getPendingTradesForReceiver(supabase, managerId),
  STALE_TIME.FAST,
);

export function usePendingTradesForAdmin(supabase) {
  return useSupabaseQuery(
    ["pendingTradesForAdmin"],
    () => getPendingTradesForReceiver(supabase),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const pendingTradesForAdminQuery = defineQuery(
  () => ["pendingTradesForAdmin"],
  (supabase) => getPendingTradesForAdmin(supabase),
  STALE_TIME.FAST,
);

export function useManagersByIds(supabase, managerIds) {
  return useSupabaseQuery(
    ["managersByIds", managerIds],
    () => getManagersByIds(supabase, managerIds),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managersByIdsQuery = defineQuery(
  (supabase, managerIds) => ["managersByIds", managerIds],
  (supabase, managerIds) => getManagersByIds(supabase, managerIds),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useLeaguesByIds(supabase, leagueIds) {
  return useSupabaseQuery(
    ["leaguesByIds", leagueIds],
    () => getLeaguesByIds(supabase, leagueIds),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const leaguesByIdsQuery = defineQuery(
  (supabase, leagueIds) => ["leaguesByIds", leagueIds],
  (supabase, leagueIds) => getLeaguesByIds(supabase, leagueIds),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);
