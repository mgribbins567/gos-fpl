import { createContext, useContext, useState, useCallback } from "react";
import { PlayerDetailModal } from "../components/Team/PlayerDetailModal";

const PlayerDetailContext = createContext(null);

export function PlayerDetailProvider({ children }) {
  const [viewingPlayer, setViewingPlayer] = useState(null);
  const [modalOptions, setModalOptions] = useState({});

  const openPlayerDetail = useCallback((player, options = {}) => {
    setViewingPlayer(player);
    setModalOptions(options);
  }, []);

  const closePlayerDetail = useCallback(() => {
    setViewingPlayer(null);
  }, []);

  const handleTradeClick = modalOptions.onTradeClick
    ? (player) => {
        closePlayerDetail();
        modalOptions.onTradeClick(player);
      }
    : undefined;

  return (
    <PlayerDetailContext.Provider value={openPlayerDetail}>
      {children}
      <PlayerDetailModal
        player={viewingPlayer}
        opened={!!viewingPlayer}
        onClose={closePlayerDetail}
        onMoveClick={modalOptions.onMoveClick}
        onTradeClick={handleTradeClick}
        canEdit={modalOptions.canEdit ?? false}
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
