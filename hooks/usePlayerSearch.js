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

export function usePlayerSearch(leagueId, viewingManagerId, supabase) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const [roster, setRoster] = useState(undefined);
  const [availability, setAvailability] = useState(undefined);
  const [dataError, setDataError] = useState(null);

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

  const results = useMemo(() => {
    if (
      !bootstrap ||
      !fixtures ||
      !ownershipMap ||
      !unavailablePlayerIds ||
      !currentGameweekNumber
    ) {
      return undefined;
    }
    const withoutOwnRoster = excludeOwnRoster(
      bootstrap.elements,
      ownershipMap,
      viewingManagerId,
    );
    const filteredPlayers = filterPlayers(
      withoutOwnRoster,
      filters,
      ownershipMap,
      unavailablePlayerIds,
    );
    return sortPlayers(
      attachFixtureStatus(
        filteredPlayers,
        bootstrap,
        fixtures,
        currentGameweekNumber,
      ),
      sortKey,
    );
  }, [
    bootstrap,
    currentGameweekNumber,
    fixtures,
    ownershipMap,
    unavailablePlayerIds,
    viewingManagerId,
    filters,
    sortKey,
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
    error: bootstrapError || dataError || fixturesError,
  };
}
