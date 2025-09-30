import { useState, useEffect } from "react";
import managers from "../data/managers.json";
import baseStyles from "../styles/Base.module.css";

export function LiveLeagueTable({ currentGameweek, allScores, liveScores }) {
  const [sortedTable, setSortedTable] = useState([]);

  useEffect(() => {
    async function fetchAndBuildTable() {
      const { league_entries, matches } = allScores;

      const leagueTable = {};
      league_entries.forEach((entry) => {
        leagueTable[entry.id] = {
          id: entry.id,
          name: managers[entry.id].name,
          W: 0,
          D: 0,
          L: 0,
          PF: 0,
          PA: 0,
          PD: 0,
          Pts: 0,
          PPW: 0,
          PPG: 0,
        };
      });

      matches.forEach((match) => {
        const team1 = leagueTable[match.league_entry_1];
        const team2 = leagueTable[match.league_entry_2];

        let score1, score2;
        if (match.finished) {
          score1 = match.league_entry_1_points;
          score2 = match.league_entry_2_points;
        } else if (match.event === currentGameweek && liveScores) {
          score1 = liveScores[team1.id] || 0;
          score2 = liveScores[team2.id] || 0;
        } else {
          return;
        }

        team1.PF += score1;
        team1.PA += score2;
        team1.PD += score1 - score2;
        team2.PF += score2;
        team2.PA += score1;
        team2.PD += score2 - score1;

        if (score1 > score2) {
          team1.W += 1;
          team1.Pts += 3;
          team2.L += 1;
        } else if (score2 > score1) {
          team2.W += 1;
          team2.Pts += 3;
          team1.L += 1;
        } else {
          team1.D += 1;
          team1.Pts += 1;
          team2.D += 1;
          team2.Pts += 1;
        }
      });

      const sorted = Object.values(leagueTable).sort((a, b) => {
        if (a.Pts != b.Pts) {
          return b.Pts - a.Pts;
        }
        return b.PF - a.PF;
      });

      setSortedTable(sorted);
    }
    fetchAndBuildTable();
  }, [currentGameweek, allScores, liveScores]);

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
          {sortedTable.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.W}</td>
              <td>{team.D}</td>
              <td>{team.L}</td>
              <td>{team.PF}</td>
              <td>{team.PA}</td>
              <td>{team.PD}</td>
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
