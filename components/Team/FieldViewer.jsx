import { useState } from "react";
import { Field } from "./Field";
import { PlayerDetailModal } from "./PlayerDetailModal";

export function FieldViewer({ players, onTradeClick }) {
  const [viewingPlayer, setViewingPlayer] = useState(null);

  function handleTradeClick(player) {
    setViewingPlayer(null);
    onTradeClick?.(player);
  }

  return (
    <>
      <Field players={players} onPlayerClick={setViewingPlayer} />
      <PlayerDetailModal
        player={viewingPlayer}
        opened={!!viewingPlayer}
        onClose={() => setViewingPlayer(null)}
        onTradeClick={onTradeClick ? handleTradeClick : undefined}
        canEdit={false}
      />
    </>
  );
}
