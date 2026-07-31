import { useEffect, useMemo, useState } from "react";
import { useBootstrapStatic } from "./useFplData";
import { getLeagueRoster } from "../lib/leagueData";
import {
  sortPlayers,
  filterPlayers,
  buildOwnershipMap,
  excludeOwnRoster,
  DEFAULT_SORT_KEY,
} from "../lib/playerSearch";

export function usePlayerSearch(leagueId, viewingManagerId, supabase) {
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const [roster, setRoster] = useState(undefined);
  const [rosterError, setRosterError] = useState(null);

  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;
    getLeagueRoster(supabase, leagueId)
      .then((data) => !cancelled && setRoster(data))
      .catch((err) => !cancelled && setRosterError(err.message));
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

  const ownershipMap = useMemo(
    () => (roster ? buildOwnershipMap(roster) : undefined),
    [roster],
  );

  const results = useMemo(() => {
    if (!bootstrap || !ownershipMap) return undefined;
    const withoutOwnRoster = excludeOwnRoster(
      bootstrap.elements,
      ownershipMap,
      viewingManagerId,
    );
    return sortPlayers(filterPlayers(withoutOwnRoster, filters, ownershipMap), sortKey);
  }, [bootstrap, ownershipMap, viewingManagerId, filters, sortKey]);

  return {
    results,
    sortKey,
    setSortKey,
    filters,
    setFilters,
    ownershipMap,
    bootstrap,
    error: bootstrapError || rosterError,
  };
}
