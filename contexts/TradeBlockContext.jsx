import { createContext, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useManager } from "./ManagerContext";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { useCurrentSeason } from "../hooks/useCurrentSeason";
import { useTradeBlockData } from "../hooks/useTradeBlockData";

const TradeBlockContext = createContext(null);

export function TradeBlockProvider({ children }) {
  const { manager, supabase } = useManager();
  const { data: league } = useSingleLeagueForManager(manager, supabase);
  const { seasonId, error: seasonError } = useCurrentSeason(supabase);

  const tradeBlock = useTradeBlockData({
    leagueId: league?.id,
    seasonId,
    supabase,
  });

  useEffect(() => {
    const message = seasonError || tradeBlock.error;
    if (message) {
      notifications.show({ color: "red", message });
    }
  }, [seasonError, tradeBlock.error]);

  return (
    <TradeBlockContext.Provider value={tradeBlock}>
      {children}
    </TradeBlockContext.Provider>
  );
}

export function useTradeBlock() {
  const tradeBlock = useContext(TradeBlockContext);
  if (!tradeBlock) {
    throw new Error("useTradeBlock must be used within a TradeBlockProvider");
  }
  return tradeBlock;
}
