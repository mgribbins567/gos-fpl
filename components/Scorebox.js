import managers from "../data/managers.json";
import { checkElementId } from "../lib/player_util";
import utilStyles from "../styles/utils.module.css";

function PastGameweek(match) {
  let score1, score2;
  if (match.league_entry_1_points) {
    score1 = match.league_entry_1_points;
    score2 = match.league_entry_2_points;
  }
  return { score1, score2 };
}

export function getTotalScore(
  gameweek,
  entry,
  playerScoreMap,
  managerPlayerMap
) {
  let totalScore = 0;
  managerPlayerMap[entry].gameweeks[gameweek].forEach((player) => {
    const elementId = checkElementId(player.element);
    let score;
    try {
      score =
        playerScoreMap[elementId].gameweeks[gameweek].stats.total_points || 0;
    } catch (error) {
      console.log("Error retrieving player: ", elementId, error);
      score = 0;
    }
    if (player.position < 12) {
      totalScore += score;
    }
  });
  return totalScore;
}

function CurrentGameweek(match, playerScoreMap, managerPlayerMap) {
  const score1 = getTotalScore(
    match.event,
    match.league_entry_1,
    playerScoreMap,
    managerPlayerMap
  );
  const score2 = getTotalScore(
    match.event,
    match.league_entry_2,
    playerScoreMap,
    managerPlayerMap
  );

  return { score1, score2 };
}

function FutureGameweek() {
  const score1 = null;
  const score2 = null;
  return { score1, score2 };
}

export function Scorebox({
  isCurrentGameweek,
  match,
  playerScoreMap,
  managerPlayerMap,
}) {
  let matchup;
  if (playerScoreMap === null) {
    matchup = FutureGameweek();
  } else if (!isCurrentGameweek) {
    matchup = PastGameweek(match);
  } else {
    matchup = CurrentGameweek(match, playerScoreMap, managerPlayerMap);
  }

  return (
    <div className={utilStyles.summaryRow}>
      <div className={utilStyles.team}>
        <span className={utilStyles.managerName}>
          {managers[match.league_entry_1].name}
        </span>
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>{matchup.score1}</span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>{matchup.score2}</span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={utilStyles.managerName}>
          {managers[match.league_entry_2].name}
        </span>
      </div>
    </div>
  );
}
