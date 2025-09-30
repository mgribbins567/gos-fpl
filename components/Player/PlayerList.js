import React, { useState, useEffect } from "react";
import { PlayerCard } from "./PlayerCard";
import utilStyles from "../../styles/utils.module.css";

export function PlayerList({ player, index }) {
  const [openPlayerId, setOpenPlayerId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(`.${utilStyles.playerCard}`)) {
        setOpenPlayerId(null);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div>
      <React.Fragment key={player.id}>
        <PlayerCard
          player={player}
          isOpen={openPlayerId === player.id}
          index={index}
          onCardClick={() => {
            setOpenPlayerId(openPlayerId === player.id ? null : player.id);
          }}
        />
      </React.Fragment>
    </div>
  );
}
