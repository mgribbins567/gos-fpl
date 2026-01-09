import React from "react";
import { useHeadToHeadHistory } from "../../hooks/useHeadToHeadHistory";
import styles from "../Manager/HeadToHeadModal.module.css";
import baseStyles from "../../styles/Base.module.css";
import Portal from "../Portal";
import managers from "../../data/managers.json";

function Score(managerAScore, managerBScore) {
  if (managerAScore > managerBScore) {
    return (
      <div>
        {managerAScore} - {managerBScore}
      </div>
    );
  }
  return (
    <div>
      {managerBScore} - {managerAScore}
    </div>
  );
}

function Winner(match, managerA, managerB) {
  if (match.manager_1_score === match.manager_2_score) {
    return "None";
  }
  return match.winner === managerA ? managerA : managerB;
}

function getManagerIdFromName(name) {
  return Object.keys(managers).find((key) => managers[key].name === name);
}

export default function HeadToHeadModal({
  managerA,
  managerB,
  matchups,
  onClose,
}) {
  const { headToHeadHistory, isLoading } = useHeadToHeadHistory(
    managerA,
    managerB
  );

  const managerAID = parseInt(getManagerIdFromName(managerA));
  const managerBID = parseInt(getManagerIdFromName(managerB));

  if (headToHeadHistory) {
    var currentSeasonHistory = matchups.filter(
      (match) =>
        (match.league_entry_1 === managerAID &&
          match.league_entry_2 === managerBID) ||
        (match.league_entry_1 === managerBID &&
          match.league_entry_2 === managerAID)
    );
    currentSeasonHistory.map((matchup) => {
      const id = managerA + "-" + managerB + "-4-" + matchup.event;
      const gameweek_id = "season-4-" + matchup.event;
      const gameweek = { gameweek: matchup.event, season_id: "season-4" };
      const manager_1_score = matchup.league_entry_1_points;
      const manager_2_score = matchup.league_entry_2_points;
      let winner = managerA;
      if (manager_2_score > manager_1_score) {
        winner = managerB;
      }
      const match = {
        id: id,
        Gameweek: gameweek,
        gameweek_id: gameweek_id,
        manager_1: managerA,
        manager_2: managerB,
        manager_1_score: manager_1_score,
        manager_2_score: manager_2_score,
        winner: winner,
      };

      const check = (m) => m.id === id;

      if (!headToHeadHistory.some(check)) {
        headToHeadHistory.push(match);
      }
    });
  }

  let winsA = 0;
  let winsB = 0;
  let draws = 0;
  let pointsA = 0;
  let pointsB = 0;

  if (headToHeadHistory) {
    headToHeadHistory.map((match) => {
      if (managerA === match.manager_1) {
        pointsA += match.manager_1_score;
        pointsB += match.manager_2_score;
      } else {
        pointsA += match.manager_2_score;
        pointsB += match.manager_1_score;
      }
      if (match.manager_1_score === match.manager_2_score) {
        draws += 1;
      } else if (match.winner === managerA) {
        winsA += 1;
      } else {
        winsB += 1;
      }
    });
  }

  return (
    <Portal>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.headToHeadModalHeader}>
              <h3>
                {managerA} vs {managerB}
              </h3>
              <button onClick={onClose} className={styles.closeButton}>
                X
              </button>
            </div>
            <div>
              {winsA} - {draws} - {winsB}
            </div>
            <div>
              {pointsA} - {pointsB}
            </div>

            {headToHeadHistory && (
              <table className={baseStyles.tableContainer}>
                <thead>
                  <tr>
                    <th>Season</th>
                    <th>Gameweek</th>
                    <th>Score</th>
                    <th>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {headToHeadHistory.map((match) => (
                    <tr key={match.gameweek_id}>
                      <td>{match.Gameweek.season_id.replace("season-", "")}</td>
                      <td>{match.Gameweek.gameweek}</td>
                      <td>
                        {Score(match.manager_1_score, match.manager_2_score)}
                      </td>
                      <td>{Winner(match, managerA, managerB)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
