import utilStyles from "../../styles/utils.module.css";
import { useState, useEffect } from "react";
import { ExpandedPlayerCard } from "./ExpandedPlayerCard";
import { useLiveData } from "../../contexts/LiveDataContext";
import { HiBars3 } from "react-icons/hi2";

export function createCurrentGameweekPlayer(playerData, gameweek) {
  const fixturesData = useLiveData().fixturesData;
  const teamId = fixturesData.teamCodesToId[playerData.details.teamCode];
  const fixturesForViewedGameweek = fixturesData.fixtures.filter(
    (fixture) =>
      fixture.event === gameweek &&
      (fixture.team_a === teamId || fixture.team_h === teamId),
  );

  const playerStats = [];
  var match = 0;

  fixturesForViewedGameweek.forEach((fixture) => {
    playerStats.push({
      stats: playerData.gameweeks[gameweek].explain[match].stats,
      teamMinutes: fixture.finished ? "Final" : fixture.minutes + "'",
      teamH: fixturesData.teams[fixture.team_h].short_name,
      teamA: fixturesData.teams[fixture.team_a].short_name,
      teamHScore: fixture.team_h_score || 0,
      teamAScore: fixture.team_a_score || 0,
      home: fixture.team_h === teamId,
    });
    match++;
  });

  const isGKP = playerData.details.position === "GKP" ? "_1" : "";
  const jerseyUrl = `https://draft.premierleague.com/img/shirts/standard/shirt_${playerData.details.teamCode}${isGKP}-66.png`;
  return {
    id: playerData.details.id,
    name: playerData.details.webName,
    position: playerData.details.position,
    teamJersey: jerseyUrl,
    score: playerData.gameweeks[gameweek].stats.total_points,
    minutes: playerData.gameweeks[gameweek].stats.minutes,
    status: playerData.details.status,
    playerStats: playerStats,
  };
}

export function PlayerCard({
  playerData,
  gameweek,
  isOpen,
  onCardClick,
  index,
}) {
  const [openPlayerId, setOpenPlayerId] = useState(null);
  const player = createCurrentGameweekPlayer(playerData, gameweek);

  function handlePopoutClick(event) {
    event.stopPropagation();
  }

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
    <div className={utilStyles.playerCard} onClick={onCardClick}>
      <div key={player.id} className={utilStyles.playerRow}>
        <div className={utilStyles.playerStats}>
          <img src={player.teamJersey} />
          <span className={utilStyles.playerPosition}>
            {player.position[0]}
          </span>
          <span status={player.status} className={utilStyles.playerName}>
            {player.name}
          </span>
          <span className={utilStyles.playerMinutes}>({player.minutes}')</span>
        </div>
        <span className={utilStyles.playerScore}>{player.score}</span>
      </div>
      {index === 10 && <div className={utilStyles.benchSeparator} />}

      {isOpen && (
        <div className={utilStyles.pointsBreakdown} onClick={handlePopoutClick}>
          <div className={utilStyles.pointsBreakdownHeaderContainer}>
            <div className={utilStyles.pointsBreakdownHeader}>
              <h4>{player.name}</h4>
              <HiBars3
                className={utilStyles.expandPointsButton}
                onClick={() => {
                  setOpenPlayerId(
                    openPlayerId === player.id ? null : player.id,
                  );
                }}
              />
              <ExpandedPlayerCard
                playerData={playerData}
                isOpen={openPlayerId === player.id}
                onCardClick={() => {
                  setOpenPlayerId(
                    openPlayerId === player.id ? null : player.id,
                  );
                }}
              />
            </div>
          </div>
          <div>
            {player.playerStats.map((fixtureStats) => (
              <div>
                <div className={utilStyles.pointsBreakdownMiniScore}>
                  <div
                    className={fixtureStats.home ? utilStyles.playerTeam : ""}
                  >
                    {fixtureStats.teamH}
                  </div>
                  {" vs "}
                  <div
                    className={fixtureStats.home ? "" : utilStyles.playerTeam}
                  >
                    {fixtureStats.teamA}{" "}
                  </div>
                  <div
                    className={fixtureStats.home ? utilStyles.playerTeam : ""}
                  >
                    {fixtureStats.teamHScore}
                  </div>
                  {" - "}
                  <div
                    className={fixtureStats.home ? "" : utilStyles.playerTeam}
                  >
                    {fixtureStats.teamAScore}
                  </div>
                  <div className={utilStyles.pointsBreakdownMiniScoreMinutes}>
                    {" "}
                    {fixtureStats.teamMinutes}
                  </div>
                </div>

                <div>
                  <ul>
                    {fixtureStats.stats.map((stat) => (
                      <li key={fixtureStats + " " + stat.identifier}>
                        {stat.identifier
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1),
                          )
                          .join(" ")}{" "}
                        ({stat.value})
                        <span className={utilStyles.playerScore}>
                          {stat.points}
                        </span>
                      </li>
                    ))}
                    <hr style={{ width: "100%" }} />
                  </ul>
                </div>
              </div>
            ))}
            <div className={utilStyles.pointsBreakdownTotalScore}>
              Total:{" "}
              <span className={utilStyles.playerScore}>{player.score}</span>
            </div>
          </div>
          <button className={utilStyles.closePopout} onClick={onCardClick}>
            x
          </button>
        </div>
      )}
    </div>
  );
}
