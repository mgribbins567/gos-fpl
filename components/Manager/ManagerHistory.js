import { useManagerHistory } from "../../hooks/useManagerHistory";
import styles from "../Manager/ManagerHistory.module.css";

export default function ManagerHistory({ managerId, onClose }) {
  const { history, isLoading } = useManagerHistory(managerId);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
        <h2>{managerId}</h2>

        {isLoading && <p>Loading history...</p>}

        {history && (
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>S</th>
                <th>Pos</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>PF</th>
                <th>PA</th>
                <th>PD</th>
                <th>PTS</th>
                <th>PPW</th>
                <th>PPG</th>
              </tr>
            </thead>
            <tbody>
              {history.map((season) => (
                <tr key={season.year}>
                  <td>{season.season_id.replace("season-", "")}</td>
                  <td>{season.position}</td>
                  <td>{season.wins}</td>
                  <td>{season.draws}</td>
                  <td>{season.losses}</td>
                  <td>{season.points_for}</td>
                  <td>{season.points_against}</td>
                  <td>
                    {season.point_difference > 0 ? "+" : null}
                    {season.point_difference}
                  </td>
                  <td>{season.points}</td>
                  <td>{season.points_per_week}</td>
                  <td>{season.points_per_game}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
