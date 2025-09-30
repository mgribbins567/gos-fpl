export function Scorebox({
  match,
  processedMatchups,
  viewedGameweek,
  gameweekId,
}) {
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
