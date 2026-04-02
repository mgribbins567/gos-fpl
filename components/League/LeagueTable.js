import { useState } from "react";
import baseStyles from "../../styles/Base.module.css";
import styles from "../Live/LiveLeagueTable.module.css";
import ManagerNameLink from "../Manager/ManagerNameLink";

function calculatePointsAgainst(standings, seasonFixtures) {
  const paMap = {};
  standings.forEach((team) => {
    paMap[team.league_entry] = 0;
  });

  const finishedMatches = seasonFixtures.filter(
    (match) => match.finished === true,
  );

  finishedMatches.forEach((match) => {
    const team1 = match.league_entry_1?.toString();
    const team2 = match.league_entry_2?.toString();
    const score1 = match.league_entry_1_points || 0;
    const score2 = match.league_entry_2_points || 0;

    if (paMap[team1]) {
      paMap[team1] += score2;
    }

    if (paMap[team2]) {
      paMap[team2] += score1;
    }
  });
  return paMap;
}

export function LeagueTable({ standings, managers, seasonFixtures }) {
  const pointsAgainstMap = calculatePointsAgainst(standings, seasonFixtures);

  const tableData = standings.map((row) => {
    const managerInfo = managers.find(
      (manager) => manager.fetch_id.toString() === row.league_entry.toString(),
    );

    return {
      ...row,
      managerName: managerInfo.name,
      points_against: pointsAgainstMap[row.league_entry.toString()],
    };
  });

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
          {sortedTableData.map((team, index) => {
            const rankDifference =
              team.rank - (team.projected_rank || team.rank);
            return (
              <tr key={team.id}>
                <td className={styles.positionCell}>
                  <span className={styles.rank}>{index + 1}</span>
                  {rankDifference !== 0 ? (
                    <span
                      className={`${styles.rankMovement} ${
                        rankDifference > 0 ? styles.up : styles.down
                      }`}
                    >
                      {rankDifference > 0 ? "+" : null}
                      {rankDifference}
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
                  <ManagerNameLink manager={team.managerName} />
                </td>
                <td>{team.matches_won}</td>
                <td>{team.matches_drawn}</td>
                <td>{team.matches_lost}</td>
                <td>{team.points_for}</td>
                <td>{team.points_against}</td>
                <td>
                  {team.points_for - team.points_against > 0 ? "+" : null}
                  {team.points_for - team.points_against}
                </td>
                <td>{team.total}</td>
                <td>
                  {parseFloat(
                    Number(
                      team.points_for /
                        (team.matches_won +
                          team.matches_drawn +
                          team.matches_lost),
                    ).toFixed(2),
                  )}
                </td>
                <td>
                  {parseFloat(
                    Number(
                      team.total /
                        (team.matches_won +
                          team.matches_drawn +
                          team.matches_lost),
                    ).toFixed(2),
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
