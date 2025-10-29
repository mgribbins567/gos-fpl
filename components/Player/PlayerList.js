import React, { useState, useEffect } from "react";
import { PlayerCard } from "./PlayerCard";
import utilStyles from "../../styles/utils.module.css";

export function PlayerList({ gameweek, player, index, fixturesData }) {
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
      <React.Fragment key={player.details.id}>
        <PlayerCard
          playerData={player}
          gameweek={gameweek}
          isOpen={openPlayerId === player.details.id}
          index={index}
          onCardClick={() => {
            setOpenPlayerId(
              openPlayerId === player.details.id ? null : player.details.id
            );
          }}
          fixturesData={fixturesData}
        />
      </React.Fragment>
    </div>
  );
}
