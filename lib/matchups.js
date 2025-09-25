import React, { useState, useEffect } from "react";
import utilStyles from "../styles/utils.module.css";
import managers from "../data/managers.json";

function Scorebox({ match, processedMatchups, viewedGameweek, gameweekId }) {
  const team1Id = match.league_entry_1;
  const team2Id = match.league_entry_2;
  const team1Name = managers[team1Id].name;
  const team2Name = managers[team2Id].name;

  const matchId = gameweekId + "-" + team1Id + "-" + team2Id;

  let score1, score2;

  if (viewedGameweek < gameweekId) {
    score1 = match.league_entry_1_points;
    score2 = match.league_entry_2_points;
  } else if (viewedGameweek > gameweekId) {
    score1 = null;
    score2 = null;
  } else {
    const liveMatchups = processedMatchups.filter(
      (matchup) => matchup.id === matchId
    )[0];
    score1 = liveMatchups.manager1.liveScore;
    score2 = liveMatchups.manager2.liveScore;
  }

  return (
    <div className={utilStyles.summaryRow}>
      <div className={utilStyles.team}>
        <span className={utilStyles.managerName}>{team1Name}</span>
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>{score1 && `${score1}`}</span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>{score2 && `${score2}`}</span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={utilStyles.managerName}>{team2Name}</span>
      </div>
    </div>
  );
}

async function getPicks({ managerId, gameweek }) {
  const leagueDetailsRes = await fetch(
    `https://draft.premierleague.com/api/league/${league}/details`
  );
  return await leagueDetailsRes.json();
}

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
