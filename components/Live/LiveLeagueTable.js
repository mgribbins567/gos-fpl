import baseStyles from "../../styles/Base.module.css";
import styles from "../Live/LiveLeagueTable.module.css";
import ManagerNameLink from "../Manager/ManagerNameLink";

export function LiveLeagueTable({ tableData }) {
  return (
    <div className={baseStyles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>PD</th>
            <th>Pts</th>
            <th>PPW</th>
            <th>PPG</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((team, index) => (
            <tr key={team.id}>
              <td className={styles.positionCell}>
                <span className={styles.rank}>{index + 1}</span>
                {team.rankDifference !== 0 ? (
                  <span
                    className={`${styles.rankMovement} ${
                      team.rankDifference > 0 ? styles.up : styles.down
                    }`}
                  >
                    {team.rankDifference > 0 ? "+" : null}
                    {team.rankDifference}
                  </span>
                ) : (
                  <span
                    className={`${styles.rankMovement} ${styles.noMovement}`}
                  >
                    -
                  </span>
                )}
              </td>
              <td>
                <ManagerNameLink manager={team.name} />
              </td>
              <td>{team.W}</td>
              <td>{team.D}</td>
              <td>{team.L}</td>
              <td>{team.PF}</td>
              <td>{team.PA}</td>
              <td>
                {team.PD > 0 ? "+" : null}
                {team.PD}
              </td>
              <td>{team.Pts}</td>
              <td>
                {parseFloat(
                  Number(team.PF / (team.W + team.D + team.L)).toFixed(2)
                )}
              </td>
              <td>
                {parseFloat(
                  Number(team.Pts / (team.W + team.D + team.L)).toFixed(2)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
