import utilStyles from "../../styles/utils.module.css";
import { useState, useEffect } from "react";
import { ExpandedPlayerCard } from "./ExpandedPlayerCard";

export function createCurrentGameweekPlayer(
  playerData,
  fixturesData,
  gameweek
) {
  const teamId = fixturesData.teamCodesToId[playerData.details.teamCode];
  const fixturesForViewedGameweek = fixturesData.fixtures.filter(
    (fixture) =>
      fixture.event === gameweek &&
      (fixture.team_a === teamId || fixture.team_h === teamId)
  );
  const isHome = fixturesForViewedGameweek[0].team_h === teamId;

  const isGKP = playerData.details.position === "GKP" ? "_1" : "";
  const jerseyUrl = `https://draft.premierleague.com/img/shirts/standard/shirt_${playerData.details.teamCode}${isGKP}-66.png`;
  return {
    id: playerData.details.id,
    name: playerData.details.webName,
    position: playerData.details.position,
    teamJersey: jerseyUrl,
    score: playerData.gameweeks[gameweek].stats.total_points,
    minutes: playerData.gameweeks[gameweek].stats.minutes,
    stats: playerData.gameweeks[gameweek].explain[0].stats,
    status: playerData.details.status,
    teamMinutes: fixturesForViewedGameweek[0].finished
      ? "Final"
      : fixturesForViewedGameweek[0].minutes + "'",
    teamH: fixturesData.teams[fixturesForViewedGameweek[0].team_h].short_name,
    teamA: fixturesData.teams[fixturesForViewedGameweek[0].team_a].short_name,
    teamHScore: fixturesForViewedGameweek[0].team_h_score || 0,
    teamAScore: fixturesForViewedGameweek[0].team_a_score || 0,
    home: isHome,
  };
}

export function PlayerCard({
  playerData,
  gameweek,
  isOpen,
  onCardClick,
  index,
  fixturesData,
}) {
  const [openPlayerId, setOpenPlayerId] = useState(null);
  const player = createCurrentGameweekPlayer(
    playerData,
    fixturesData,
    gameweek
  );

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
              <ExpandedPlayerCard
                playerData={playerData}
                isOpen={openPlayerId === player.id}
                onCardClick={() => {
                  setOpenPlayerId(
                    openPlayerId === player.id ? null : player.id
                  );
                }}
                fixturesData={fixturesData}
              />
            </div>
            <div className={utilStyles.pointsBreakdownMiniScore}>
              <div className={player.home ? utilStyles.playerTeam : ""}>
                {player.teamH}
              </div>
              {" vs "}
              <div className={player.home ? "" : utilStyles.playerTeam}>
                {player.teamA}{" "}
              </div>
              <div className={player.home ? utilStyles.playerTeam : ""}>
                {player.teamHScore}
              </div>
              {" - "}
              <div className={player.home ? "" : utilStyles.playerTeam}>
                {player.teamAScore}
              </div>
              <div className={utilStyles.pointsBreakdownMiniScoreMinutes}>
                {" "}
                {player.teamMinutes}
              </div>
            </div>
          </div>

          <div>
            <ul>
              {player.stats.map((stat) => (
                <li key={player + " " + stat.identifier}>
                  {stat.identifier
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")}{" "}
                  ({stat.value})
                  <span className={utilStyles.playerScore}>{stat.points}</span>
                </li>
              ))}
              <hr style={{ width: "100%" }} />
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
