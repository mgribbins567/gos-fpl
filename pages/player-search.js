import React, { useState, useMemo } from "react";
import managers from "../data/managers.json";
import utilStyles from "../styles/utils.module.css";
import { getBootstrapData, getLeagueDetails } from "./season-4";

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

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
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
  }, [players, searchTerm, positionFilter, availabilityFilter]);

  return (
    <div className={utilStyles.container}>
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
      <table className={utilStyles.playerTable}>
        <thead>
          <tr className={utilStyles.tableHeader}>
            <th className={utilStyles.headerCell}>Player</th>
            <th className={utilStyles.headerCell}>Team</th>
            <th className={utilStyles.headerCell}>Position</th>
            <th className={utilStyles.headerCell}>Total Points</th>
            <th className={utilStyles.headerCell}>League A Owner</th>
            <th className={utilStyles.headerCell}>League B Owner</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr key={player.id} className={utilStyles.tableRow}>
              <td className={utilStyles.dataCell}>{player.web_name}</td>
              <td className={utilStyles.dataCell}>{player.team_name}</td>
              <td className={utilStyles.dataCell}>{player.position}</td>
              <td className={utilStyles.dataCell}>{player.total_points}</td>
              <td className={utilStyles.dataCell}>
                {getManagerName(player.ownerA)}
              </td>
              <td className={utilStyles.dataCell}>
                {getManagerName(player.ownerB)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        acc[status.element] = status.owner;
        return acc;
      },
      {}
    );

    const ownershipMapB = elementStatusDataB.element_status.reduce(
      (acc, status) => {
        acc[status.element] = status.owner;
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
