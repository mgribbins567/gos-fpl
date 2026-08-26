import { defineQuery } from "./defineQuery.js";
import { useSupabaseQuery } from "./useSupabaseQuery.js";
import {
  getLeaguesForManager,
  getLeagues,
  getLeagueMatchups,
  getCupMatchups,
  getCupMatchupsByCup,
  getCupMatchupsByRound,
  getLeagueMatchupsForSeason,
  getManagersByNames,
  getTeamsForManagersByGameweek,
  getTeamsForManagers,
  getLeagueRoster,
  getPlayerAvailability,
  getManagersInLeague,
  getManagers,
  getManagerLeagueIds,
  getEarliestLeagueGameweekNumber,
  getLatestLeagueGameweekNumber,
  getCupGameweekBounds,
  getDraftOrder,
  getGameweeksForSeason,
} from "../../lib/leagueData.js";
import { STALE_TIME } from "../../lib/queryConfig.js";

export function useLeaguesForManager(supabase, managerId, seasonId) {
  return useSupabaseQuery(
    ["leaguesForManager", managerId, seasonId],
    () => getLeaguesForManager(supabase, managerId, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const leaguesForManagerQuery = defineQuery(
  (supabase, managerId, seasonId) => ["leaguesForManager", managerId, seasonId],
  (supabase, managerId, seasonId) =>
    getLeaguesForManager(supabase, managerId, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useLeagues(supabase) {
  return useSupabaseQuery(["leagues"], () => getLeagues(supabase), {
    staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
  });
}

export const leaguesQuery = defineQuery(
  () => ["leagues"],
  (supabase) => getLeagues(supabase),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useLeagueMatchups(supabase, leagueId, gameweekId) {
  return useSupabaseQuery(
    ["leagueMatchups", leagueId, gameweekId],
    () => getLeagueMatchups(supabase, leagueId, gameweekId),
    {
      staleTime: STALE_TIME.STATIC,
    },
  );
}

export const leagueMatchupsQuery = defineQuery(
  (supabase, leagueId, gameweekId) => ["leagueMatchups", leagueId, gameweekId],
  (supabase, leagueId, gameweekId) =>
    getLeagueMatchups(supabase, leagueId, gameweekId),
  STALE_TIME.STATIC,
);

export function useCupMatchups(supabase, gameweekId) {
  return useSupabaseQuery(
    ["cupMatchups", gameweekId],
    () => getCupMatchups(supabase, gameweekId),
    {
      staleTime: STALE_TIME.STATIC,
    },
  );
}

export const cupMatchupsQuery = defineQuery(
  (supabase, gameweekId) => ["cupMatchups", gameweekId],
  (supabase, gameweekId) => getCupMatchups(supabase, gameweekId),
  STALE_TIME.STATIC,
);

export function useCupMatchupsByCup(supabase, cupName) {
  return useSupabaseQuery(
    ["cupMatchupsByCup", cupName],
    () => getCupMatchupsByCup(supabase, cupName),
    {
      staleTime: STALE_TIME.STATIC,
    },
  );
}

export const cupMatchupsByCupQuery = defineQuery(
  (supabase, cupName) => ["cupMatchupsByCup", cupName],
  (supabase, cupName) => getCupMatchupsByCup(supabase, cupName),
  STALE_TIME.STATIC,
);

export function useCupMatchupsByRound(
  supabase,
  seasonId,
  cupName,
  roundId,
  teamAId,
  teamBId,
) {
  return useSupabaseQuery(
    ["cupMatchupsByRound", seasonId, cupName, roundId, teamAId, teamBId],
    () =>
      getCupMatchupsByRound(
        supabase,
        seasonId,
        cupName,
        roundId,
        teamAId,
        teamBId,
      ),
    {
      staleTime: STALE_TIME.STATIC,
    },
  );
}

export const cupMatchupsByRoundQuery = defineQuery(
  (supabase, seasonId, cupName, roundId, teamAId, teamBId) => [
    "cupMatchupsByRound",
    seasonId,
    cupName,
    roundId,
    teamAId,
    teamBId,
  ],
  (supabase, seasonId, cupName, roundId, teamAId, teamBId) =>
    getCupMatchupsByRound(
      supabase,
      seasonId,
      cupName,
      roundId,
      teamAId,
      teamBId,
    ),
  STALE_TIME.STATIC,
);

export function useLeagueMatchupsForSeason(supabase, leagueId, seasonId) {
  return useSupabaseQuery(
    ["leagueMatchupsForSeason", leagueId, seasonId],
    () => getLeagueMatchupsForSeason(supabase, leagueId, seasonId),
    {
      staleTime: STALE_TIME.STATIC,
    },
  );
}

export const leagueMatchupsForSeasonQuery = defineQuery(
  (supabase, leagueId, seasonId) => [
    "leagueMatchupsForSeason",
    leagueId,
    seasonId,
  ],
  (supabase, leagueId, seasonId) =>
    getLeagueMatchupsForSeason(supabase, leagueId, seasonId),
  STALE_TIME.STATIC,
);

export function useManagersByNames(supabase, names) {
  return useSupabaseQuery(
    ["managersByNames", names],
    () => getManagersByNames(supabase, names),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managersByNamesQuery = defineQuery(
  (supabase, names) => ["managersByNames", names],
  (supabase, names) => getManagersByNames(supabase, names),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useManagersInLeague(supabase, leagueId, seasonId) {
  return useSupabaseQuery(
    ["managersInLeague", leagueId, seasonId],
    () => getManagersInLeague(supabase, leagueId, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managersInLeagueQuery = defineQuery(
  (supabase, leagueId, seasonId) => ["managersInLeague", leagueId, seasonId],
  (supabase, leagueId, seasonId) =>
    getManagersInLeague(supabase, leagueId, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useManagers(supabase, seasonId) {
  return useSupabaseQuery(
    ["managers", seasonId],
    () => getManagers(supabase, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managersQuery = defineQuery(
  (supabase, seasonId) => ["managers", seasonId],
  (supabase, seasonId) => getManagers(supabase, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useManagerLeagueIds(supabase, seasonId) {
  return useSupabaseQuery(
    ["managerLeagueIds", seasonId],
    () => getManagerLeagueIds(supabase, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const managerLeagueIdsQuery = defineQuery(
  (supabase, seasonId) => ["managerLeagueIds", seasonId],
  (supabase, seasonId) => getManagerLeagueIds(supabase, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useTeamsForManagersByGameweek(
  supabase,
  managerIds,
  gameweekId,
) {
  return useSupabaseQuery(
    ["teamsForManagersByGameweek", managerIds, gameweekId],
    () => getTeamsForManagersByGameweek(supabase, managerIds, gameweekId),
    {
      staleTime: STALE_TIME.SLOW,
    },
  );
}

export const teamsForManagersByGameweekQuery = defineQuery(
  (supabase, managerIds, gameweekId) => [
    "teamsForManagersByGameweek",
    managerIds,
    gameweekId,
  ],
  (supabase, managerIds, gameweekId) =>
    getTeamsForManagersByGameweek(supabase, managerIds, gameweekId),
  STALE_TIME.SLOW,
);

export function useTeamsForManagers(supabase, managerIds) {
  return useSupabaseQuery(
    ["teamsForManagers", managerIds],
    () => getTeamsForManagers(supabase, managerIds),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const teamsForManagersQuery = defineQuery(
  (supabase, managerIds) => ["teamsForManagers", managerIds],
  (supabase, managerIds) => getTeamsForManagers(supabase, managerIds),
  STALE_TIME.FAST,
);

export function useLeagueRoster(supabase, leagueId) {
  return useSupabaseQuery(
    ["leagueRoster", leagueId],
    () => getLeagueRoster(supabase, leagueId),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const leagueRosterQuery = defineQuery(
  (supabase, leagueId) => ["leagueRoster", leagueId],
  (supabase, leagueId) => getLeagueRoster(supabase, leagueId),
  STALE_TIME.FAST,
);

export function usePlayerAvailability(supabase, leagueId) {
  return useSupabaseQuery(
    ["playerAvailability", leagueId],
    () => getPlayerAvailability(supabase, leagueId),
    {
      staleTime: STALE_TIME.FAST,
    },
  );
}

export const playerAvailabilityQuery = defineQuery(
  (supabase, leagueId) => ["playerAvailability", leagueId],
  (supabase, leagueId) => getPlayerAvailability(supabase, leagueId),
  STALE_TIME.FAST,
);

export function useEarliestLeagueGameweekNumber(supabase, seasonId) {
  return useSupabaseQuery(
    ["earliestLeagueGameweekNumber", seasonId],
    () => getEarliestLeagueGameweekNumber(supabase, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const earliestLeagueGameweekNumberQuery = defineQuery(
  (supabase, seasonId) => ["earliestLeagueGameweekNumber", seasonId],
  (supabase, seasonId) => getEarliestLeagueGameweekNumber(supabase, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useLatestLeagueGameweekNumber(supabase, seasonId) {
  return useSupabaseQuery(
    ["latestLeagueGameweekNumber", seasonId],
    () => getLatestLeagueGameweekNumber(supabase, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const latestLeagueGameweekNumberQuery = defineQuery(
  (supabase, seasonId) => ["latestLeagueGameweekNumber", seasonId],
  (supabase, seasonId) => getLatestLeagueGameweekNumber(supabase, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useCupGameweekBounds(supabase, seasonId, cupName) {
  return useSupabaseQuery(
    ["cupGameweekBounds", seasonId, cupName],
    () => getCupGameweekBounds(supabase, seasonId, cupName),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const cupGameweekBoundsQuery = defineQuery(
  (supabase, seasonId, cupName) => ["cupGameweekBounds", seasonId, cupName],
  (supabase, seasonId, cupName) =>
    getCupGameweekBounds(supabase, seasonId, cupName),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useDraftOrder(supabase, leagueId, seasonId) {
  return useSupabaseQuery(
    ["draftOrder", leagueId, seasonId],
    () => getDraftOrder(supabase, leagueId, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const draftOrderQuery = defineQuery(
  (supabase, leagueId, seasonId) => ["draftOrder", leagueId, seasonId],
  (supabase, leagueId, seasonId) => getDraftOrder(supabase, leagueId, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);

export function useGameweeksForSeason(supabase, seasonId) {
  return useSupabaseQuery(
    ["gameweeksForSeason", seasonId],
    () => getGameweeksForSeason(supabase, seasonId),
    {
      staleTime: STALE_TIME.EXTRA_EXTRA_SLOW,
    },
  );
}

export const gameweeksForSeasonQuery = defineQuery(
  (supabase, seasonId) => ["gameweeksForSeason", seasonId],
  (supabase, seasonId) => getGameweeksForSeason(supabase, seasonId),
  STALE_TIME.EXTRA_EXTRA_SLOW,
);
