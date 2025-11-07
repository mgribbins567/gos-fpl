import { useState } from "react";
import utilStyles from "../../styles/utils.module.css";
import styles from "../Live/LiveFixtures.module.css";
import { ExpandedPlayerCard } from "../Player/ExpandedPlayerCard";
import { useLiveData } from "../../contexts/LiveDataContext";

function Scorebox({ fixture, teams }) {
  return (
    <div className={utilStyles.summaryRow}>
      <div className={`${utilStyles.team} ${utilStyles.teamLeft}`}>
        <span className={styles.fixturesTeamName}>
          {teams[fixture.team_h].name}
        </span>
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>{fixture.team_h_score}</span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>{fixture.team_a_score}</span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={styles.fixturesTeamName}>
          {teams[fixture.team_a].name}
        </span>
      </div>
    </div>
  );
}

function StatsList({ identifier, statMap, playerScoreMap }) {
  const [openPlayerId, setOpenPlayerId] = useState(null);
  if (
    Object.keys(statMap.h).length === 0 &&
    Object.keys(statMap.a).length === 0
  ) {
    return;
  }
  return (
    <div className={styles.fixtureContainer}>
      <div className={styles.identifier}>
        {identifier
          .replace(/_/g, " ")
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")}
      </div>
      <div className={styles.players}>
        <div className={styles.homePlayers}>
          {statMap.h.map((element) => (
            <div>
              <a
                className={utilStyles.expandPointsButton}
                onClick={() => {
                  setOpenPlayerId(
                    openPlayerId === element.element ? null : element.element
                  );
                }}
              >
                {playerScoreMap[element.element].details.webName} (
                {element.value})
              </a>
              <ExpandedPlayerCard
                playerData={playerScoreMap[element.element]}
                isOpen={openPlayerId === element.element}
                onCardClick={() => {
                  setOpenPlayerId(
                    openPlayerId === element.element ? null : element.element
                  );
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.awayPlayers}>
          {statMap.a.map((element) => (
            <div>
              <a
                className={utilStyles.expandPointsButton}
                onClick={() => {
                  setOpenPlayerId(
                    openPlayerId === element.element ? null : element.element
                  );
                }}
              >
                {playerScoreMap[element.element].details.webName} (
                {element.value})
              </a>
              <ExpandedPlayerCard
                playerData={playerScoreMap[element.element]}
                isOpen={openPlayerId === element.element}
                onCardClick={() => {
                  setOpenPlayerId(
                    openPlayerId === element.element ? null : element.element
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiveFixtures({ gameweek, playerScoreMap }) {
  const [viewedGameweek, setViewedGameweek] = useState(gameweek);
  const [openMatchupId, setOpenMatchupId] = useState(null);
  const fixturesData = useLiveData().fixturesData;

  const fixturesForViewedGameweek = fixturesData.fixtures.filter(
    (fixture) => fixture.event === viewedGameweek
  );

  const handleCardClick = (matchupId) => {
    setOpenMatchupId(openMatchupId === matchupId ? null : matchupId);
  };

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
        <h3>Gameweek {viewedGameweek} </h3>
        <button
          onClick={() => setViewedGameweek((gw) => gw + 1)}
          disabled={viewedGameweek === 38}
          className={utilStyles.gameweekButton}
        >
          Next &rarr;
        </button>
      </div>
      {fixturesForViewedGameweek.map((fixture) => (
        <div key={fixture.code} className={utilStyles.matchupCard}>
          <div
            className={utilStyles.matchupHeader}
            onClick={() => handleCardClick(fixture.code)}
          >
            <div className={utilStyles.summaryRow}>
              <Scorebox fixture={fixture} teams={fixturesData.teams} />
            </div>
          </div>
          {openMatchupId === fixture.code && (
            <div className={styles.fixtureDetailsPanel}>
              <div className={styles.teamPlayers}>
                {fixture.stats.map((stat) => (
                  <StatsList
                    identifier={stat.identifier}
                    statMap={stat}
                    playerScoreMap={playerScoreMap}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className={utilStyles.scoreBoard}></div>
    </div>
  );
}
