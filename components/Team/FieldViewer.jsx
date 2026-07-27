import { useState } from "react";
import { Field } from "./Field";
import { PlayerDetailModal } from "./PlayerDetailModal";

export function FieldViewer({ players }) {
  const [viewingPlayer, setViewingPlayer] = useState(null);

  return (
    <>
      <Field players={players} onPlayerClick={setViewingPlayer} />
      <PlayerDetailModal
        player={viewingPlayer}
        opened={!!viewingPlayer}
        onClose={() => setViewingPlayer(null)}
        canEdit={false}
      />
    </>
  );
}
