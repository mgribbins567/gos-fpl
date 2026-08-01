import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic } from "./useFplData";
import { getLeagueRoster, getPlayerAvailability } from "../lib/leagueData";
import { getActiveGameweekContext } from "../lib/gameweek";
import {
  sortPlayers,
  filterPlayers,
  buildOwnershipMap,
  buildUnavailablePlayerIds,
  excludeOwnRoster,
  DEFAULT_SORT_KEY,
} from "../lib/playerSearch";

export function usePlayerSearch(leagueId, viewingManagerId, supabase) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const [roster, setRoster] = useState(undefined);
  const [availability, setAvailability] = useState(undefined);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;
    Promise.all([
      getLeagueRoster(supabase, leagueId),
      getPlayerAvailability(supabase, leagueId),
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
  console.log("context: ", context);
  const currentGameweekNumber =
    context?.mode === "live" ? context.event.id : context?.nextEvent?.id;

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
  console.log("unavailablePlayerIds: ", unavailablePlayerIds);

  const results = useMemo(() => {
    if (!bootstrap || !ownershipMap || !unavailablePlayerIds) {
      return undefined;
    }
    const withoutOwnRoster = excludeOwnRoster(
      bootstrap.elements,
      ownershipMap,
      viewingManagerId,
    );
    return sortPlayers(
      filterPlayers(
        withoutOwnRoster,
        filters,
        ownershipMap,
        unavailablePlayerIds,
      ),
      sortKey,
    );
  }, [
    bootstrap,
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
    error: bootstrapError || dataError,
  };
}
