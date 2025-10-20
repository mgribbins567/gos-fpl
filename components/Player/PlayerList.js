import React, { useState, useEffect } from "react";
import { PlayerCard } from "./PlayerCard";
import utilStyles from "../../styles/utils.module.css";

export function PlayerList({ gameweek, player, index }) {
  const [openPlayerId, setOpenPlayerId] = useState(null);

  const isGKP = player.details.position === "GKP" ? "_1" : "";
  const jerseyUrl = `https://draft.premierleague.com/img/shirts/standard/shirt_${player.details.teamCode}${isGKP}-66.png`;
  const newPlayer = {
    id: player.details.id,
    name: player.details.webName,
    position: player.details.position,
    teamJersey: jerseyUrl,
    score: player.gameweeks[gameweek].stats.total_points,
    minutes: player.gameweeks[gameweek].stats.minutes,
    stats: player.gameweeks[gameweek].explain[0].stats,
    status: player.details.status,
  };

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
          player={newPlayer}
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
