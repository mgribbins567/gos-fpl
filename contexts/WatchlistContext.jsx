import { createContext, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useManager } from "./ManagerContext";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { useCurrentSeason } from "../hooks/useCurrentSeason";
import { useWatchlistData } from "../hooks/useWatchlistData";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { manager, supabase } = useManager();
  const { data: league } = useSingleLeagueForManager(manager, supabase);
  const { seasonId, error: seasonError } = useCurrentSeason(supabase);

  const watchlist = useWatchlistData({
    leagueId: league?.id,
    seasonId,
    managerId: manager?.id,
    supabase,
  });

  useEffect(() => {
    const message = seasonError || watchlist.error;
    if (message) {
      notifications.show({ color: "red", message });
    }
  }, [seasonError, watchlist.error]);

  return (
    <WatchlistContext.Provider value={watchlist}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const watchlist = useContext(WatchlistContext);
  if (!watchlist) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return watchlist;
}
