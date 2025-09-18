import React, { useState, useEffect } from "react";
import utilStyles from "../styles/utils.module.css";

function PlayerCard({ player, isOpen, onCardClick, index }) {
  function handlePopoutClick(event) {
    event.stopPropagation();
  }

  return (
    <div className={utilStyles.playerCard} onClick={onCardClick}>
      <div key={player.id} className={utilStyles.playerRow}>
        <div className={utilStyles.playerStats}>
          <span>{player.name} </span>
          <span className={utilStyles.playerMinutes}>({player.minutes}')</span>
        </div>
        <span className={utilStyles.playerScore}>{player.score}</span>
      </div>
      {index === 10 && <div className={utilStyles.benchSeparator} />}

      {isOpen && (
        <div className={utilStyles.pointsBreakdown} onClick={handlePopoutClick}>
          <h4>{player.name}</h4>
          <div>
            <ul>
              {player.stats.map((stat) => (
                <li key={player + " " + stat.identifier}>
                  {stat.identifier
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}
                  :<span className={utilStyles.playerScore}>{stat.points}</span>
                </li>
              ))}
              <h4></h4>
              <li>
                Total:{" "}
                <span className={utilStyles.playerScore}>{player.score}</span>
              </li>
            </ul>
          </div>
          <button className={utilStyles.closePopout} onClick={onCardClick}>
            x
          </button>
        </div>
      )}
    </div>
  );
}

function PlayerList({ player, index }) {
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

export function Matchups({ processedMatchups, gameweekId }) {
  const [openMatchupId, setOpenMatchupId] = useState(null);

  const handleCardClick = (matchupId) => {
    setOpenMatchupId(openMatchupId === matchupId ? null : matchupId);
  };

  if (!processedMatchups || processedMatchups.length === 0) {
    return (
      <div className={utilStyles.container}>
        <h1>Gameweek {gameweekId}</h1>
        <p>Could not load matchup data.</p>
      </div>
    );
  }

  return (
    <div className={utilStyles.container}>
      <h3>Gameweek {gameweekId}</h3>
      <div className={utilStyles.scoreBoard}>
        {processedMatchups.map((match) => (
          <div key={match.id} className={utilStyles.matchupCard}>
            <div
              className={utilStyles.matchupHeader}
              onClick={() => handleCardClick(match.id)}
            >
              <div className={utilStyles.summaryRow}>
                <div className={utilStyles.team}>
                  <span className={utilStyles.managerName}>
                    {match.manager1.managerName}
                  </span>
                </div>
                <div className={utilStyles.scoreBox}>
                  <span className={utilStyles.score}>
                    {match.manager1.liveScore}
                  </span>
                  <span className={utilStyles.versus}>-</span>
                  <span className={utilStyles.score}>
                    {match.manager2.liveScore}
                  </span>
                </div>
                <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
                  <span className={utilStyles.managerName}>
                    {match.manager2.managerName}
                  </span>
                </div>
              </div>
            </div>

            {openMatchupId === match.id && (
              <div className={utilStyles.detailsPanel}>
                <div className={utilStyles.teamPlayers}>
                  {match.manager1.team.map((player, index) => (
                    <React.Fragment key={player.id}>
                      <PlayerList player={player} index={index} />
                    </React.Fragment>
                  ))}
                </div>
                <div className={utilStyles.teamPlayers}>
                  {match.manager2.team.map((player, index) => (
                    <React.Fragment key={player.id}>
                      <PlayerList player={player} index={index} />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
