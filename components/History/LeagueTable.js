import baseStyles from "../../styles/Base.module.css";

export function LeagueTable({ seasonData }) {
  if (!seasonData || !seasonData.Gameweek || seasonData.Gameweek.length === 0) {
    return [];
  }

  const managerStats = new Map();

  const allManagers = [];
  seasonData.Gameweek[0].Matchup.forEach((match) => {
    allManagers.push(match.manager_1);
    allManagers.push(match.manager_2);
  });

  allManagers.forEach((manager) => {
    managerStats.set(manager, {
      name: manager,
      W: 0,
      D: 0,
      L: 0,
      PTS: 0,
      PF: 0,
      PA: 0,
      PD: 0,
    });
  });

  seasonData.Gameweek.forEach((gameweek) => {
    gameweek.Matchup.forEach((match) => {
      const stats1 = managerStats.get(match.manager_1);
      const stats2 = managerStats.get(match.manager_2);

      if (!stats1 || !stats2) {
        return;
      }

      const score1 = match.manager_1_score;
      const score2 = match.manager_2_score;

      stats1.PF += score1;
      stats1.PA += score2;
      stats2.PF += score2;
      stats2.PA += score1;

      if (score1 > score2) {
        stats1.W += 1;
        stats1.PTS += 3;
        stats2.L += 1;
      } else if (score2 > score1) {
        stats2.W += 1;
        stats2.PTS += 3;
        stats1.L += 1;
      } else {
        stats1.D += 1;
        stats1.PTS += 1;
        stats2.D += 1;
        stats2.PTS += 1;
      }
    });
  });

  let finalTable = Array.from(managerStats.values());

  finalTable.forEach((manager) => {
    manager.PD = manager.PF - manager.PA;
  });

  finalTable.sort((a, b) => {
    if (b.PTS !== a.PTS) {
      return b.PTS - a.PTS;
    }
    if (b.PF !== a.PF) {
      return b.PF - a.PF;
    }
    return b.PD - a.PD;
  });

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
          {finalTable.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.W}</td>
              <td>{team.D}</td>
              <td>{team.L}</td>
              <td>{team.PF}</td>
              <td>{team.PA}</td>
              <td>
                {team.PD > 0 ? "+" : null}
                {team.PD}
              </td>
              <td>{team.PTS}</td>
              <td>
                {parseFloat(
                  Number(team.PF / (team.W + team.D + team.L)).toFixed(2)
                )}
              </td>
              <td>
                {parseFloat(
                  Number(team.PTS / (team.W + team.D + team.L)).toFixed(2)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
