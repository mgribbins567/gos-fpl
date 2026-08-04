export function determineWinner(
  manager1Score,
  manager2Score,
  manager1Name,
  manager2Name,
) {
  if (manager1Score === manager2Score) return null;
  return manager1Score > manager2Score ? manager1Name : manager2Name;
}

export function buildFinalizedMatchupUpdates(matchups, scoreByManagerName) {
  return matchups.map((matchup) => {
    const score1 = scoreByManagerName.get(matchup.manager_1);
    const score2 = scoreByManagerName.get(matchup.manager_2);
    if (score1 === undefined || score2 === undefined) {
      throw new Error(
        `Missing finalized score for matchup ${matchup.id} (manager_1=${matchup.manager_1}, manager_2=${matchup.manager_2})`,
      );
    }
    return {
      id: matchup.id,
      manager_1_score: score1,
      manager_2_score: score2,
      winner: determineWinner(
        score1,
        score2,
        matchup.manager_1,
        matchup.manager_2,
      ),
    };
  });
}
