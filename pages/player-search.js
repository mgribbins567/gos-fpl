import React, { useState, useMemo } from "react";
import managers from "../data/managers.json";
import utilStyles from "../styles/PlayerList.module.css";
import { getBootstrapData, checkElementId } from "./season-4";

const getManagerName = (ownerId) => {
  if (!ownerId) {
    return "";
  }
  for (let i in managers) {
    if (managers[i].entry_id == ownerId) {
      return managers[i].name;
    }
  }
  return "";
};

export default function PlayerSearchPage({ players }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [sortConfig, setSortConfig] = useState({
    key: "total_points",
    direction: "descending",
  });

  const sortedAndFilteredPlayers = useMemo(() => {
    let filteredPlayers = players.filter((player) => {
      const nameMatch =
        player.web_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.second_name.toLowerCase().includes(searchTerm.toLowerCase());

      const positionMatch =
        positionFilter === "all" || player.position === positionFilter;

      const isOwnedA = !!player.ownerA;
      const isOwnedB = !!player.ownerB;
      const availabilityMatch =
        availabilityFilter === "all" ||
        (availabilityFilter === "owned-a" && isOwnedA) ||
        (availabilityFilter === "free-a" && !isOwnedA) ||
        (availabilityFilter === "owned-b" && isOwnedB) ||
        (availabilityFilter === "free-b" && !isOwnedB);

      return nameMatch && positionMatch && availabilityMatch;
    });

    if (sortConfig.key != null) {
      filteredPlayers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPlayers;
  }, [players, searchTerm, positionFilter, availabilityFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "descending" ? " ▾" : " ▴";
    }
    return null;
  };

  return (
    <div className="content-wrapper">
      <h1>Player List</h1>
      <div className={utilStyles.filters}>
        <input
          type="text"
          placeholder="Enter player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={utilStyles.filterInput}
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className={utilStyles.filterInput}
        >
          <option value="all">All Positions</option>
          <option value="GKP">Goalkeepers</option>
          <option value="DEF">Defenders</option>
          <option value="MID">Midfielders</option>
          <option value="FWD">Forwards</option>
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className={utilStyles.filterInput}
        >
          <option value="all">All Players</option>
          <option value="owned-a">Owned - A</option>
          <option value="owned-b">Owned - B</option>
          <option value="free-a">Available - A</option>
          <option value="free-b">Available - B</option>
        </select>
      </div>
      <div className={utilStyles.tableContainer}>
        <table className={utilStyles.playerTable}>
          <thead>
            <tr className={utilStyles.tableHeader}>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("web_name")}
              >
                Player {getSortIndicator("web_name")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("team_name")}
              >
                Team {getSortIndicator("team_name")}
              </th>
              <th className={utilStyles.headerCell}>League A Owner</th>
              <th className={utilStyles.headerCell}>League B Owner</th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("position")}
              >
                Pos {getSortIndicator("position")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("total_points")}
              >
                Total Pts {getSortIndicator("total_points")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("minutes")}
              >
                Mins {getSortIndicator("minutes")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("goals_scored")}
              >
                Goals {getSortIndicator("goals_scored")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("expected_goals")}
              >
                xG {getSortIndicator("expected_goals")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("assists")}
              >
                Assists {getSortIndicator("assists")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("expected_assists")}
              >
                xA {getSortIndicator("expected_assists")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("expected_goal_involvements")}
              >
                xGI {getSortIndicator("expected_goal_involvements")}
              </th>
              <th
                className={utilStyles.sortableHeader}
                onClick={() => requestSort("clean_sheets")}
              >
                Clean Sheets {getSortIndicator("clean_sheets")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredPlayers.map((player) => (
              <tr key={player.id} className={utilStyles.tableRow}>
                <td className={utilStyles.dataCell}>{player.web_name}</td>
                <td className={utilStyles.dataCell}>{player.team_name}</td>
                <td className={utilStyles.dataCell}>
                  {getManagerName(player.ownerA)}
                </td>
                <td className={utilStyles.dataCell}>
                  {getManagerName(player.ownerB)}
                </td>
                <td className={utilStyles.dataCell}>{player.position}</td>
                <td className={utilStyles.dataCell}>{player.total_points}</td>
                <td className={utilStyles.dataCell}>{player.minutes}</td>
                <td className={utilStyles.dataCell}>{player.goals_scored}</td>
                <td className={utilStyles.dataCell}>
                  ({player.expected_goals})
                </td>
                <td className={utilStyles.dataCell}>{player.assists}</td>
                <td className={utilStyles.dataCell}>
                  ({player.expected_assists})
                </td>
                <td className={utilStyles.dataCell}>
                  {player.expected_goal_involvements}
                </td>
                <td className={utilStyles.dataCell}>{player.clean_sheets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const LEAGUE_A_ID = 157;
  const LEAGUE_B_ID = 461;

  try {
    const bootstrapData = await getBootstrapData();

    const elementStatusResA = await fetch(
      `https://draft.premierleague.com/api/league/${LEAGUE_A_ID}/element-status`
    );
    const elementStatusDataA = await elementStatusResA.json();

    const elementStatusResB = await fetch(
      `https://draft.premierleague.com/api/league/${LEAGUE_B_ID}/element-status`
    );
    const elementStatusDataB = await elementStatusResB.json();

    const teamsMap = bootstrapData.teams.reduce((acc, team) => {
      acc[team.id] = team.name;
      return acc;
    }, {});

    const positionsMap = bootstrapData.element_types.reduce((acc, pos) => {
      acc[pos.id] = pos.singular_name_short;
      return acc;
    }, {});

    const ownershipMapA = elementStatusDataA.element_status.reduce(
      (acc, status) => {
        acc[checkElementId(status.element)] = status.owner;
        return acc;
      },
      {}
    );

    const ownershipMapB = elementStatusDataB.element_status.reduce(
      (acc, status) => {
        acc[checkElementId(status.element)] = status.owner;
        return acc;
      },
      {}
    );

    const players = bootstrapData.elements.map((player) => ({
      id: player.id,
      first_name: player.first_name,
      second_name: player.second_name,
      web_name: player.web_name,
      total_points: player.total_points,
      team_name: teamsMap[player.team],
      position: positionsMap[player.element_type],
      ownerA: ownershipMapA[player.id] || null,
      ownerB: ownershipMapB[player.id] || null,
      minutes: player.minutes,
      goals_scored: player.goals_scored,
      expected_goals: player.expected_goals,
      assists: player.assists,
      expected_assists: player.expected_assists,
      clean_sheets: player.clean_sheets,
      expected_goal_involvements: player.expected_goal_involvements,
    }));

    return {
      props: {
        players,
      },
    };
  } catch (error) {
    console.error("Failed to fetch FPL data:", error);
    return {
      props: {
        players: [],
      },
    };
  }
}
