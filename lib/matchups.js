import React, { useState } from "react";
import utilStyles from "../styles/utils.module.css";

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
      <h1>Gameweek {gameweekId}</h1>
      <div className={utilStyles.scoreBoard}>
        {processedMatchups.map((match) => (
          <div
            key={match.id}
            className={utilStyles.matchupCard}
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

            {openMatchupId === match.id && (
              <div className={utilStyles.detailsPanel}>
                <div className={utilStyles.teamPlayers}>
                  {match.manager1.team.map((player, index) => (
                    <React.Fragment key={player.id}>
                      <div key={player.id} className={utilStyles.playerRow}>
                        <span>{player.name}</span>
                        <span className={utilStyles.playerScore}>
                          {player.score}
                        </span>
                      </div>
                      {index === 10 && (
                        <div className={utilStyles.benchSeparator} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className={utilStyles.teamPlayers}>
                  {match.manager2.team.map((player, index) => (
                    <React.Fragment key={player.id}>
                      <div key={player.id} className={utilStyles.playerRow}>
                        <span>{player.name}</span>
                        <span className={utilStyles.playerScore}>
                          {player.score}
                        </span>
                      </div>
                      {index === 10 && (
                        <div className={utilStyles.benchSeparator} />
                      )}
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
