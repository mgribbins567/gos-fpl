import utilStyles from "../styles/utils.module.css";

export async function calculateDraftManagerScore(
  managerId,
  gameweekId,
  playerScoreMap
) {
  const teamRes = await fetch(
    `https://draft.premierleague.com/api/entry/${managerId}/event/${gameweekId}`
  );
  const teamData = await teamRes.json();

  if (!teamData || !teamData.picks) {
    return 0;
  }

  let totalScore = 0;
  teamData.picks.forEach((pick) => {
    if (pick.position < 12) {
      const score = playerScoreMap.get(pick.element).points || 0;
      totalScore += score;
    }
  });

  return totalScore;
}

export function Matchups({ processedMatchups, gameweekId }) {
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
          <div key={match.id} className={utilStyles.matchupCard}>
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
        ))}
      </div>
    </div>
  );
}
