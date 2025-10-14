import utilStyles from "../../styles/utils.module.css";

export function PlayerCard({ player, isOpen, onCardClick, index }) {
  function handlePopoutClick(event) {
    event.stopPropagation();
  }

  return (
    <div className={utilStyles.playerCard} onClick={onCardClick}>
      <div key={player.id} className={utilStyles.playerRow}>
        <div className={utilStyles.playerStats}>
          <img src={player.teamJersey} />
          <span className={utilStyles.playerPosition}>
            {player.position[0]}
          </span>
          <span>{player.name}</span>
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
                    .join(" ")}{" "}
                  ({stat.value})
                  <span className={utilStyles.playerScore}>{stat.points}</span>
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
