import { useState } from "react";
import baseStyles from "../../styles/Base.module.css";
import styles from "../Live/LiveLeagueTable.module.css";
import ManagerNameLink from "../Manager/ManagerNameLink";

export function LiveLeagueTable({ tableData }) {
  const [sortConfig, setSortConfig] = useState({
    key: "Pos",
    direction: "descending",
  });

  const sortedTableData = [...tableData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={baseStyles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => requestSort("Pos")}>
              Pos{" "}
              {sortConfig.key === "Pos"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("Team")}>
              Team{" "}
              {sortConfig.key === "Team"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("W")}>
              W{" "}
              {sortConfig.key === "W"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("D")}>
              D{" "}
              {sortConfig.key === "D"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("L")}>
              L{" "}
              {sortConfig.key === "L"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("PF")}>
              PF{" "}
              {sortConfig.key === "PF"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("PA")}>
              PA{" "}
              {sortConfig.key === "PA"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("PD")}>
              PD{" "}
              {sortConfig.key === "PD"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("Pts")}>
              Pts{" "}
              {sortConfig.key === "Pts"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("PPW")}>
              PPW{" "}
              {sortConfig.key === "PPW"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
            <th onClick={() => requestSort("PPG")}>
              PPG{" "}
              {sortConfig.key === "PPG"
                ? sortConfig.direction === "ascending"
                  ? "▴"
                  : "▾"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTableData.map((team, index) => (
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
                  Number(team.PF / (team.W + team.D + team.L)).toFixed(2),
                )}
              </td>
              <td>
                {parseFloat(
                  Number(team.Pts / (team.W + team.D + team.L)).toFixed(2),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
