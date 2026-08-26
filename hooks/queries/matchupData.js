import { defineQuery } from "./defineQuery.js";
import { useSupabaseQuery } from "./useSupabaseQuery.js";
import {
  getGameweekByNumber,
  getManagerByName,
  getMatchupForManager,
} from "../../lib/matchupData";
import { STALE_TIME } from "../../lib/queryConfig";

export function useGameweekByNumber(supabase, seasonId, gameweekNumber) {
  return useSupabaseQuery(
    ["gameweekByNumber", seasonId, gameweekNumber],
    () => getGameweekByNumber(supabase, seasonId, gameweekNumber),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const gameweekByNumberQuery = defineQuery(
  (supabase, seasonId, gameweekNumber) => [
    "gameweekByNumber",
    seasonId,
    gameweekNumber,
  ],
  (supabase, seasonId, gameweekNumber) =>
    getGameweekByNumber(supabase, seasonId, gameweekNumber),
  STALE_TIME.SLOW,
);

export function useManagerByName(supabase, name) {
  return useSupabaseQuery(
    ["managerByName", name],
    () => getManagerByName(supabase, name),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managerByNameQuery = defineQuery(
  (supabase, name) => ["gameweekByNumber", name],
  (supabase, name) => getManagerByName(supabase, name),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useMatchupForManager(supabase, gameweekId, managerName) {
  return useSupabaseQuery(
    ["matchupForManager", gameweekId, managerName],
    () => getMatchupForManager(supabase, gameweekId, managerName),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const matchupForManagerQuery = defineQuery(
  (supabase, gameweekId, managerName) => [
    "matchupForManager",
    gameweekId,
    managerName,
  ],
  (supabase, gameweekId, managerName) =>
    getMatchupForManager(supabase, gameweekId, managerName),
  STALE_TIME.SLOW,
);
