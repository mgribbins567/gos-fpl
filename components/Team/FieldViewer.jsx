import { useState } from "react";
import { Field } from "./Field";
import { PlayerDetailModal } from "./PlayerDetailModal";
import { getPositionMatchedPlayers } from "../../lib/lineup";

export function FieldViewer({ players, onTradeClick, fieldSelection }) {
  const [viewingPlayer, setViewingPlayer] = useState(null);

  function handleTradeClick(player) {
    setViewingPlayer(null);
    onTradeClick?.(player);
  }

  if (fieldSelection) {
    const matchingIds = new Set(
      getPositionMatchedPlayers(players, fieldSelection.elementType).map(
        (p) => p.player_id,
      ),
    );
    return (
      <Field
        players={players}
        onPlayerClick={(player) =>
          matchingIds.has(player.player_id) && fieldSelection.onSelect(player)
        }
        highlightedPlayerIds={matchingIds}
      />
    );
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
