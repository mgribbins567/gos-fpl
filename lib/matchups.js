import React, { useState } from "react";
import utilStyles from "../styles/utils.module.css";
import { Scorebox } from "../components/Scorebox";
import { PlayerList } from "../components/Player/PlayerList";
import { checkElementId } from "./player_util";

function ScoreDetails({ match }) {
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

function PastGameweek(
  matchesForViewedGameweek,
  playerScoreMap,
  managerPlayerMap,
  tableData,
  isCurrentGameweek,
  fixturesData
) {
  const [openMatchupId, setOpenMatchupId] = useState(null);

  const handleCardClick = (matchupId) => {
    setOpenMatchupId(openMatchupId === matchupId ? null : matchupId);
  };
  return matchesForViewedGameweek.map((match) => (
    <div
      key={match.league_entry_1 + "-" + match.league_entry_2}
      className={utilStyles.matchupCard}
    >
      <div
        className={utilStyles.matchupHeader}
        onClick={() =>
          handleCardClick(match.league_entry_1 + "-" + match.league_entry_2)
        }
      >
        <div className={utilStyles.summaryRow}>
          <Scorebox
            isCurrentGameweek={isCurrentGameweek}
            match={match}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            tableData={tableData}
          />
        </div>
      </div>

      {openMatchupId === match.league_entry_1 + "-" + match.league_entry_2 && (
        <div className={utilStyles.detailsPanel}>
          <div className={utilStyles.teamPlayers}>
            {managerPlayerMap[match.league_entry_1].gameweeks[match.event].map(
              (player, index) => (
                <React.Fragment key={player.id}>
                  <PlayerList
                    gameweek={match.event}
                    player={playerScoreMap[checkElementId(player.element)]}
                    index={index}
                    fixturesData={fixturesData}
                  />
                </React.Fragment>
              )
            )}
          </div>
          <div className={utilStyles.teamPlayers}>
            {managerPlayerMap[match.league_entry_2].gameweeks[match.event].map(
              (player, index) => (
                <React.Fragment key={player.id}>
                  <PlayerList
                    gameweek={match.event}
                    player={playerScoreMap[checkElementId(player.element)]}
                    index={index}
                    fixturesData={fixturesData}
                  />
                </React.Fragment>
              )
            )}
          </div>
        </div>
      )}
    </div>
  ));
}

function FutureGameweek(matchesForViewedGameweek, tableData) {
  const [openMatchupId, setOpenMatchupId] = useState(null);

  const handleCardClick = (matchupId) => {
    setOpenMatchupId(openMatchupId === matchupId ? null : matchupId);
  };
  return matchesForViewedGameweek.map((match) => (
    <div key={match.id} className={utilStyles.matchupCard}>
      <div
        className={utilStyles.matchupHeader}
        onClick={() => handleCardClick(match.id)}
      >
        <div className={utilStyles.summaryRow}>
          <Scorebox
            isCurrentGameweek={false}
            match={match}
            playerScoreMap={null}
            managerPlayerMap={null}
            tableData={tableData}
          />
        </div>
      </div>
    </div>
  ));
}

export function Matchups({
  gameweek,
  isFinished,
  allMatchups,
  playerScoreMap,
  managerPlayerMap,
  tableData,
  isCup,
  fixturesData,
}) {
  const [viewedGameweek, setViewedGameweek] = useState(gameweek);

  if (!allMatchups || allMatchups.length === 0) {
    return (
      <div className={utilStyles.container}>
        <h1>Gameweek {gameweek}</h1>
        <p>Could not load matchup data.</p>
      </div>
    );
  }

  const matchesForViewedGameweek = allMatchups.matches.filter(
    (match) => match.event === viewedGameweek
  );

  const weekAmount = isCup ? 8 : 38;

  var isFinal =
    (viewedGameweek === gameweek && isFinished) || viewedGameweek < gameweek;

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
          {viewedGameweek === gameweek && !isFinal && (
            <span className={utilStyles.liveBadge}>Live</span>
          )}
          {isFinal && <span className={utilStyles.finalBadge}>Final</span>}
        </h3>
        <button
          onClick={() => setViewedGameweek((gw) => gw + 1)}
          disabled={viewedGameweek === weekAmount}
          className={utilStyles.gameweekButton}
        >
          Next &rarr;
        </button>
      </div>

      <div className={utilStyles.scoreBoard}>
        {!isCup &&
          viewedGameweek < gameweek &&
          PastGameweek(
            matchesForViewedGameweek,
            playerScoreMap,
            managerPlayerMap,
            tableData,
            /*isCurrentGameweekOrCup=*/ false,
            fixturesData
          )}
        {!isCup &&
          viewedGameweek === gameweek &&
          PastGameweek(
            matchesForViewedGameweek,
            playerScoreMap,
            managerPlayerMap,
            tableData,
            /*isCurrentGameweekOrCup=*/ true,
            fixturesData
          )}
        {!isCup &&
          viewedGameweek > gameweek &&
          FutureGameweek(matchesForViewedGameweek, tableData)}
        {isCup &&
          viewedGameweek <= gameweek &&
          PastGameweek(
            matchesForViewedGameweek,
            playerScoreMap,
            managerPlayerMap,
            tableData,
            /*isCurrentGameweekOrCup=*/ true,
            fixturesData
          )}
        {isCup &&
          viewedGameweek > gameweek &&
          FutureGameweek(matchesForViewedGameweek, tableData)}
      </div>
    </div>
  );
}
