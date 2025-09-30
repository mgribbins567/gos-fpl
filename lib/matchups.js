import React, { useState } from "react";
import utilStyles from "../styles/utils.module.css";
import { Scorebox } from "../components/Scorebox";
import { PlayerList } from "../components/Player/PlayerList";
import { getPicks } from "../api/draftService";

function ScoreDetails({
  match,
  processedMatchups,
  viewedGameweek,
  gameweekId,
}) {
  return (
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
  );
}

export function Matchups({ allMatchups, processedMatchups, gameweekId }) {
  const [viewedGameweek, setViewedGameweek] = useState(gameweekId);
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

  const matchesForViewedGameweek = allMatchups.matches.filter(
    (match) => match.event === viewedGameweek
  );

  return (
    <div className={utilStyles.container}>
      <div className={utilStyles.gameweekHeader}>
        <button
          onClick={() => setViewedGameweek((gw) => gw - 1)}
          disabled={viewedGameweek === 1}
          className={utilStyles.gameweekButton}
        >
          &larr; Prev
        </button>
        <h3>
          Gameweek {viewedGameweek}{" "}
          {viewedGameweek === gameweekId ? "(Live)" : ""}
        </h3>
        <button
          onClick={() => setViewedGameweek((gw) => gw + 1)}
          disabled={viewedGameweek === 38}
          className={utilStyles.gameweekButton}
        >
          Next &rarr;
        </button>
      </div>

      <div className={utilStyles.scoreBoard}>
        {!(viewedGameweek === gameweekId) &&
          matchesForViewedGameweek.map((match) => (
            <div key={match.id} className={utilStyles.matchupCard}>
              <div
                className={utilStyles.matchupHeader}
                onClick={() => handleCardClick(match.id)}
              >
                <div className={utilStyles.summaryRow}>
                  <Scorebox
                    match={match}
                    processedMatchups={processedMatchups}
                    viewedGameweek={viewedGameweek}
                    gameweekId={gameweekId}
                  />
                </div>
              </div>

              {/* {openMatchupId === match.id && (
                <ScoreDetails
                  match={match}
                  processedMatchups={processedMatchups}
                  viewedGameweek={viewedGameweek}
                  gameweekId={gameweekId}
                />
              )} */}
            </div>
          ))}
        {viewedGameweek === gameweekId &&
          processedMatchups.map((match) => (
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
