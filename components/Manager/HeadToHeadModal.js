import React from "react";
import { useHeadToHeadHistory } from "../../hooks/useHeadToHeadHistory";
import styles from "../Manager/HeadToHeadModal.module.css";
import baseStyles from "../../styles/Base.module.css";
import Portal from "../Portal";

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

export default function HeadToHeadModal({ managerA, managerB, onClose }) {
  console.log("finding h2h between: ", managerA, " and ", managerB);
  const { headToHeadHistory, isLoading } = useHeadToHeadHistory(
    managerA,
    managerB
  );

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
      if (match.winner === managerA) {
        winsA += 1;
      } else if (match.winner === managerB) {
        winsB += 1;
      } else {
        draws += 1;
      }
    });
  }

  return (
    <Portal>
      <div classname={styles.backdrop}>
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
                      <td>{match.winner === managerA ? managerA : managerB}</td>
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
