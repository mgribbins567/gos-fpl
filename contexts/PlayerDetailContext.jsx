import { createContext, useContext, useState, useCallback } from "react";
import { PlayerDetailModal } from "../components/Team/PlayerDetailModal";
import { useManager } from "./ManagerContext";
import { useWatchlist } from "./WatchlistContext";

const PlayerDetailContext = createContext(null);

export function PlayerDetailProvider({ children }) {
  const { supabase } = useManager();
  const watchlist = useWatchlist();

  const [viewingPlayer, setViewingPlayer] = useState(null);
  const [modalOptions, setModalOptions] = useState({});

  const openPlayerDetail = useCallback((player, options = {}) => {
    setViewingPlayer(player);
    setModalOptions(options);
  }, []);

  const closePlayerDetail = useCallback(() => {
    setViewingPlayer(null);
  }, []);

  const handleMoveClick = modalOptions.onMoveClick
    ? (player) => {
        closePlayerDetail();
        modalOptions.onMoveClick(player);
      }
    : undefined;

  const handleTradeClick = modalOptions.onTradeClick
    ? (player) => {
        closePlayerDetail();
        modalOptions.onTradeClick(player);
      }
    : undefined;

  const playerId = viewingPlayer?.player_id ?? viewingPlayer?.id;

  return (
    <PlayerDetailContext.Provider value={openPlayerDetail}>
      {children}
      <PlayerDetailModal
        player={viewingPlayer}
        opened={!!viewingPlayer}
        onClose={closePlayerDetail}
        onMoveClick={handleMoveClick}
        onTradeClick={handleTradeClick}
        canEdit={modalOptions.canEdit ?? false}
        isOverview={modalOptions.isOverview ?? false}
        supabase={supabase}
        isWatchlisted={
          viewingPlayer ? watchlist.isWatchlisted(playerId) : false
        }
        onToggleWatchlist={watchlist.toggle}
      />
    </PlayerDetailContext.Provider>
  );
}

export function usePlayerDetail() {
  const openPlayerDetail = useContext(PlayerDetailContext);
  if (!openPlayerDetail) {
    throw new Error(
      "usePlayerDetail must be used within a PlayerDetailProvider",
    );
  }
  return openPlayerDetail;
}
