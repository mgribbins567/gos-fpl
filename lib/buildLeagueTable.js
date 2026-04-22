export function buildTable(
  standings,
  matches,
  entries,
  liveMask,
  managerNameMap,
) {
  const pointsAgainstMap = {};

  for (const match of matches) {
    const e1 = match.league_entry_1;
    const e2 = match.league_entry_2;
    if (!match.finished) {
      if (match.started) {
        pointsAgainstMap[e1] += liveMask?.[e2].pa ?? 0;
        pointsAgainstMap[e2] += liveMask?.[e1].pa ?? 0;
      }
      continue;
    }

    pointsAgainstMap[e1] =
      (pointsAgainstMap[e1] ?? 0) + match.league_entry_2_points;
    pointsAgainstMap[e2] =
      (pointsAgainstMap[e2] ?? 0) + match.league_entry_1_points;
  }

  const entryMap = Object.fromEntries(entries.map((e) => [e.entry_id, e]));

  const preLiveRanking = [...standings]
    .sort((a, b) => b.total - a.total || b.points_for - a.points_for)
    .map((s) => [s.league_entry, s.rank]);
  const preLiveRankMap = Object.fromEntries(preLiveRanking);

  const postLiveRanking = [...standings]
    .sort((a, b) => {
      const aTotal = a.total + (liveMask?.[a.league_entry].points ?? 0);
      const bTotal = b.total + (liveMask?.[b.league_entry].points ?? 0);
      const aPF = a.points_for + (liveMask?.[a.league_entry].pf ?? 0);
      const bPF = b.points_for + (liveMask?.[b.league_entry].pf ?? 0);
      return bTotal - aTotal || bPF - aPF;
    })
    .map((s, i) => [s.league_entry, i + 1]);
  const postLiveRankMap = Object.fromEntries(postLiveRanking);

  const rows = standings.map((s) => {
    const entry = entryMap[s.league_entry];
    const managerName =
      managerNameMap[s.league_entry] ??
      (entry
        ? `${entry.player_first_name} ${entry.player_last_name}`
        : "Unknown");

    const rankChange =
      preLiveRankMap[s.league_entry] - postLiveRankMap[s.league_entry];

    s.matches_won += liveMask?.[s.league_entry].win ?? 0;
    s.matches_drawn += liveMask?.[s.league_entry].draw ?? 0;
    s.matches_lost += liveMask?.[s.league_entry].loss ?? 0;
    s.points_for += liveMask?.[s.league_entry].pf ?? 0;
    s.total += liveMask?.[s.league_entry].points ?? 0;

    return {
      ...s,
      points_against: pointsAgainstMap[s.league_entry] ?? 0,
      managerName: managerName,
      rankChange: rankChange,
      livePoints: liveMask?.[s.league_entry].points,
      projectedTotal: s.total,
    };
  });
  console.log("rows: ", rows);

  return rows.sort((a, b) => {
    const aPF = a.points_for;
    const bPF = b.points_for;
    return b.projectedTotal - a.projectedTotal || bPF - aPF;
  });
}
