import { useState } from "react";
import utilStyles from "../styles/utils.module.css";

function Scorebox({ fixture, teams }) {
  return (
    <div className={utilStyles.summaryRow}>
      <div className={`${utilStyles.team} ${utilStyles.teamLeft}`}>
        <span className={utilStyles.fixturesTeamName}>
          {teams[fixture.team_h]}
        </span>
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>{fixture.team_h_score}</span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>{fixture.team_a_score}</span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={utilStyles.fixturesTeamName}>
          {teams[fixture.team_a]}
        </span>
      </div>
    </div>
  );
}

function StatsList({ identifier, statMap, playerScoreMap }) {
  return (
    <div className={utilStyles.fixtureContainer}>
      <div className={utilStyles.identifier}>
        {identifier
          .replace(/_/g, " ")
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")}
      </div>
      <div className={utilStyles.players}>
        <div className={utilStyles.homePlayers}>
          {statMap.h.map((element) => (
            <div>
              {playerScoreMap[element.element].details.webName} ({element.value}
              )
            </div>
          ))}
        </div>
        <div className={utilStyles.awayPlayers}>
          {statMap.a.map((element) => (
            <div>
              {playerScoreMap[element.element].details.webName} ({element.value}
              )
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiveFixtures({ gameweek, fixturesData, playerScoreMap }) {
  const [viewedGameweek, setViewedGameweek] = useState(gameweek);
  const [openMatchupId, setOpenMatchupId] = useState(null);

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
            <div className={utilStyles.fixtureDetailsPanel}>
              <div className={utilStyles.teamPlayers}>
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
