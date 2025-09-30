import managers from "../data/managers.json";
import utilStyles from "../styles/utils.module.css";

function PastGameweek(match) {
  return [
    managers[match.league_entry_1].name,
    match.league_entry_1_points,
    managers[match.league_entry_2].name,
    match.league_entry_2_points,
  ];
}

function CurrentGameweek(match) {
  return [
    match.manager1.managerName,
    match.manager1.liveScore,
    match.manager2.managerName,
    match.manager2.liveScore,
  ];
}

function FutureGameweek(match) {
  return [
    managers[match.league_entry_1].name,
    null,
    managers[match.league_entry_2].name,
    null,
  ];
}

export function Scorebox({ match }) {
  let matchup;
  if (match.finished) {
    matchup = PastGameweek(match);
  } else if (match.id) {
    matchup = CurrentGameweek(match);
  } else {
    matchup = FutureGameweek(match);
  }

  return (
    <div className={utilStyles.summaryRow}>
      <div className={utilStyles.team}>
        <span className={utilStyles.managerName}>{matchup[0]}</span>
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>
          {matchup[1] && `${matchup[1]}`}
        </span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>
          {matchup[3] && `${matchup[3]}`}
        </span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={utilStyles.managerName}>{matchup[2]}</span>
      </div>
    </div>
  );
}
