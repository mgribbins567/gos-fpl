import managers from "../data/managers.json";
import { checkElementId } from "../lib/player_util";
import utilStyles from "../styles/utils.module.css";
import { VscHistory } from "react-icons/vsc";

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

function getManagerTableData(match, tableData) {
  var numbers = [
    "",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];

  let manager1Data, manager1Rank, manager2Data, manager2Rank;
  if (Object.keys(tableData).length == 2) {
    const tableAData = tableData.tableAData.startOfWeekTable;
    const tableBData = tableData.tableBData.startOfWeekTable;
    manager1Data =
      tableAData.find((team) => team.id === match.league_entry_1) ||
      tableBData.find((team) => team.id === match.league_entry_1);
    manager1Rank =
      numbers[
        tableAData.findIndex((team) => team.id === match.league_entry_1) === -1
          ? tableBData.findIndex((team) => team.id === match.league_entry_1) + 1
          : tableAData.findIndex((team) => team.id === match.league_entry_1) + 1
      ];
    manager2Data =
      tableAData.find((team) => team.id === match.league_entry_2) ||
      tableBData.find((team) => team.id === match.league_entry_2);
    manager2Rank =
      numbers[
        tableAData.findIndex((team) => team.id === match.league_entry_2) === -1
          ? tableBData.findIndex((team) => team.id === match.league_entry_2) + 1
          : tableAData.findIndex((team) => team.id === match.league_entry_2) + 1
      ];
  } else {
    manager1Data = tableData.find((team) => team.id === match.league_entry_1);
    manager1Rank =
      numbers[
        tableData.findIndex((team) => team.id === match.league_entry_1) + 1
      ];
    manager2Data = tableData.find((team) => team.id === match.league_entry_2);
    manager2Rank =
      numbers[
        tableData.findIndex((team) => team.id === match.league_entry_2) + 1
      ];
  }

  return { manager1Data, manager1Rank, manager2Data, manager2Rank };
}

export function ScoreBug({
  manager1Name,
  manager2Name,
  score1,
  score2,
  manager1Data,
  manager2Data,
  manager1Rank,
  manager2Rank,
}) {
  return (
    <div className={utilStyles.summaryRow}>
      <div className={`${utilStyles.team} ${utilStyles.teamLeft}`}>
        <span className={utilStyles.managerName}>{manager1Name}</span>
        {manager1Data && (
          <span className={utilStyles.managerData}>
            {manager1Rank}
            {" • "} {manager1Data.Pts}
            {" P • "}
            {manager1Data.PF}
            {" PF"}
          </span>
        )}
      </div>
      <div className={utilStyles.scoreBox}>
        <span className={utilStyles.score}>{score1}</span>
        <span className={utilStyles.versus}>-</span>
        <span className={utilStyles.score}>{score2}</span>
      </div>
      <div className={`${utilStyles.team} ${utilStyles.teamRight}`}>
        <span className={utilStyles.managerName}>{manager2Name}</span>
        {manager2Data && (
          <span className={utilStyles.managerData}>
            {manager2Data.PF}
            {" PF • "}
            {manager2Data.Pts}
            {" P • "}
            {manager2Rank}
          </span>
        )}
      </div>
    </div>
  );
}

export function Scorebox({
  isCurrentGameweek,
  match,
  playerScoreMap,
  managerPlayerMap,
  tableData,
}) {
  let matchup;
  if (playerScoreMap === null) {
    matchup = FutureGameweek();
  } else if (!isCurrentGameweek) {
    matchup = PastGameweek(match);
  } else {
    matchup = CurrentGameweek(match, playerScoreMap, managerPlayerMap);
  }
  const managerTableData = getManagerTableData(match, tableData);

  return (
    <ScoreBug
      manager1Name={managers[match.league_entry_1].name}
      manager2Name={managers[match.league_entry_2].name}
      score1={matchup.score1}
      score2={matchup.score2}
      manager1Data={managerTableData.manager1Data}
      manager2Data={managerTableData.manager2Data}
      manager1Rank={managerTableData.manager1Rank}
      manager2Rank={managerTableData.manager2Rank}
    />
  );
}
