import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic, useUpcomingFixtures } from "./useFplData";
import { getActiveGameweekContext } from "../lib/gameweek";
import {
  sortPlayers,
  filterPlayers,
  buildOwnershipMap,
  buildUnavailablePlayerIds,
  excludeOwnRoster,
  DEFAULT_SORT_KEY,
} from "../lib/playerSearch";
import { attachFixtureStatus } from "../lib/fplData";
import {
  leagueRosterQuery,
  playerAvailabilityQuery,
} from "./queries/leagueData";
import { useWatchlist } from "../contexts/WatchlistContext";

export function usePlayerSearch(leagueId, viewingManagerId, supabase) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const [roster, setRoster] = useState(undefined);
  const [availability, setAvailability] = useState(undefined);
  const [dataError, setDataError] = useState(null);

  const { watchlistedPlayerIds, error: watchlistError } = useWatchlist();

  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;
    Promise.all([
      leagueRosterQuery.fetch(supabase, leagueId),
      playerAvailabilityQuery.fetch(supabase, leagueId),
    ])
      .then(([rosterData, availabilityData]) => {
        if (cancelled) return;
        setRoster(rosterData);
        setAvailability(availabilityData);
      })
      .catch((err) => !cancelled && setDataError(err.message));
    return () => {
      cancelled = true;
    };
  }, [leagueId, supabase]);

  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY);
  const [filters, setFilters] = useState({
    position: null,
    teamId: null,
    searchText: "",
    onlyAvailable: false,
    onlyWatchlisted: false,
  });

  const context = useMemo(() => {
    if (!bootstrap) return undefined;
    try {
      return getActiveGameweekContext(bootstrap);
    } catch {
      return undefined;
    }
  }, [bootstrap]);
  const currentGameweekNumber = context?.upcoming?.event.id;
  const { data: fixtures, error: fixturesError } = useUpcomingFixtures(
    currentGameweekNumber ? currentGameweekNumber : undefined,
  );

  const ownershipMap = useMemo(
    () => (roster ? buildOwnershipMap(roster) : undefined),
    [roster],
  );
  const unavailablePlayerIds = useMemo(
    () =>
      availability && currentGameweekNumber
        ? buildUnavailablePlayerIds(availability, currentGameweekNumber)
        : undefined,
    [availability, currentGameweekNumber],
  );

  const teamsById = useMemo(
    () => new Map((bootstrap?.teams ?? []).map((t) => [t.id, t])),
    [bootstrap],
  );

  const enrichedPlayersById = useMemo(() => {
    if (!bootstrap || !fixtures || !currentGameweekNumber) return undefined;
    const enriched = attachFixtureStatus(
      bootstrap.elements,
      bootstrap,
      fixtures,
      currentGameweekNumber,
    );
    return new Map(
      enriched.map((player) => [
        player.id,
        { ...player, teamName: teamsById.get(player.team)?.name },
      ]),
    );
  }, [bootstrap, fixtures, currentGameweekNumber, teamsById]);

  const results = useMemo(() => {
    if (!enrichedPlayersById || !ownershipMap || !unavailablePlayerIds) {
      return undefined;
    }
    const allEnriched = Array.from(enrichedPlayersById.values());
    const withoutOwnRoster = excludeOwnRoster(
      allEnriched,
      ownershipMap,
      viewingManagerId,
    );
    const filteredPlayers = filterPlayers(
      withoutOwnRoster,
      filters,
      ownershipMap,
      unavailablePlayerIds,
    );
    const watchlistFiltered = filters.onlyWatchlisted
      ? filteredPlayers.filter((p) => watchlistedPlayerIds.has(p.id))
      : filteredPlayers;
    return sortPlayers(watchlistFiltered, sortKey);
  }, [
    enrichedPlayersById,
    ownershipMap,
    unavailablePlayerIds,
    viewingManagerId,
    filters,
    sortKey,
    watchlistedPlayerIds,
  ]);

  return {
    results,
    sortKey,
    setSortKey,
    filters,
    setFilters,
    ownershipMap,
    unavailablePlayerIds,
    bootstrap,
    teamsById,
    enrichedPlayersById,
    error: bootstrapError || dataError || fixturesError || watchlistError,
  };
}
