import { Field } from "./Field";
import { getPositionMatchedPlayers } from "../../lib/lineup";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";

export function FieldViewer({ players, onTradeClick, fieldSelection }) {
  const openPlayerDetail = usePlayerDetail();

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
    <Field
      players={players}
      onPlayerClick={(player) =>
        openPlayerDetail(player, { onTradeClick, canEdit: false })
      }
    />
  );
}
