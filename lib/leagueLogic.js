export function toLeagueMatchupSummary(matchup, scoreByName) {
  const score1 = scoreByName
    ? scoreByName.get(matchup.manager_1)
    : matchup.manager_1_score;
  const score2 = scoreByName
    ? scoreByName.get(matchup.manager_2)
    : matchup.manager_2_score;
  return {
    id: matchup.id,
    manager1: { name: matchup.manager_1, score: score1 },
    manager2: { name: matchup.manager_2, score: score2 },
    winner: matchup.winner,
  };
}

export function getFeaturedMatchups(summaries) {
  if (summaries.length === 0) {
    return { highestScoring: [], closest: [] };
  }

  const withTotals = summaries.map((s) => ({
    summary: s,
    total: s.manager1.score + s.manager2.score,
    diff: Math.abs(s.manager1.score - s.manager2.score),
  }));

  const highestScoring = [];
  const closest = [];
  const usedIds = new Set();

  const sortedByTotal = [...withTotals].sort((a, b) => b.total - a.total);
  for (const entry of sortedByTotal) {
    if (highestScoring.length >= 2) break;
    if (!usedIds.has(entry.summary.id)) {
      highestScoring.push(entry.summary);
      usedIds.add(entry.summary.id);
    }
  }

  const sortedByDiff = [...withTotals].sort((a, b) => a.diff - b.diff);
  for (const entry of sortedByDiff) {
    if (closest.length >= 2) break;
    if (!usedIds.has(entry.summary.id)) {
      closest.push(entry.summary);
      usedIds.add(entry.summary.id);
    }
  }

  return { highestScoring, closest };
}

export function computeStandings(matchups) {
  const isFinished = (m) =>
    m.manager_1_score !== null && m.manager_2_score !== null;

  const recordByName = new Map();
  function getRecord(name) {
    if (!recordByName.has(name)) {
      recordByName.set(name, {
        name,
        wins: 0,
        losses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      });
    }
    return recordByName.get(name);
  }

  for (const matchup of matchups.filter(isFinished)) {
    const r1 = getRecord(matchup.manager_1);
    const r2 = getRecord(matchup.manager_2);
    r1.pointsFor += matchup.manager_1_score;
    r1.pointsAgainst += matchup.manager_2_score;
    r2.pointsFor += matchup.manager_2_score;
    r2.pointsAgainst += matchup.manager_1_score;

    if (matchup.winner === null) {
      r1.ties += 1;
      r2.ties += 1;
    } else if (matchup.winner === matchup.manager_1) {
      r1.wins += 1;
      r2.losses += 1;
    } else {
      r2.wins += 1;
      r1.losses += 1;
    }
  }

  return [...recordByName.values()].sort(
    (a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor,
  );
}

function projectMatchupWithLiveScores(matchup, liveScoresByName) {
  const score1 = liveScoresByName.has(matchup.manager_1)
    ? liveScoresByName.get(matchup.manager_1)
    : null;
  const score2 = liveScoresByName.has(matchup.manager_2)
    ? liveScoresByName.get(matchup.manager_2)
    : null;
  const winner =
    score1 === null || score2 === null || score1 === score2
      ? null
      : score1 > score2
        ? matchup.manager_1
        : matchup.manager_2;
  return {
    ...matchup,
    manager_1_score: score1,
    manager_2_score: score2,
    winner,
  };
}

export function computeStandingsWithRankChange(
  matchups,
  currentGameweekNumber,
  liveScoresByName = new Map(),
) {
  const priorMatchups = matchups.filter(
    (m) => m.gameweekNumber < currentGameweekNumber,
  );
  const currentMatchups = matchups
    .filter((m) => m.gameweekNumber === currentGameweekNumber)
    .map((m) => projectMatchupWithLiveScores(m, liveScoresByName));

  const previousRankByName = new Map(
    computeStandings(priorMatchups).map((row, i) => [row.name, i + 1]),
  );
  console.log("prior matchups: ", priorMatchups);
  console.log("current matchups: ", currentMatchups);

  return computeStandings([...priorMatchups, ...currentMatchups]).map(
    (row, i) => {
      console.log("row: ", row, " i: ", i);
      const rank = i + 1;
      const previousRank = previousRankByName.get(row.name);
      return {
        ...row,
        rank,
        rankChange: previousRank === undefined ? null : previousRank - rank,
        leaguePoints: row.wins * 3 + row.ties,
      };
    },
  );
}

// For individual manager standings history
export function getStandingsHistory(matchupsWithGameweekNumber) {
  const finished = matchupsWithGameweekNumber.filter(
    (m) => m.manager_1_score !== null && m.manager_2_score !== null,
  );
  const gameweekNumbers = [
    ...new Set(finished.map((m) => m.gameweekNumber)),
  ].sort((a, b) => a - b);

  const runningByName = new Map();
  function getRunning(name) {
    if (!runningByName.has(name)) {
      runningByName.set(name, {
        name,
        wins: 0,
        losses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      });
    }
    return runningByName.get(name);
  }

  const historyByName = new Map();

  for (const gw of gameweekNumbers) {
    for (const matchup of finished.filter((m) => m.gameweekNumber === gw)) {
      const r1 = getRunning(matchup.manager_1);
      const r2 = getRunning(matchup.manager_2);
      r1.pointsFor += matchup.manager_1_score;
      r1.pointsAgainst += matchup.manager_2_score;
      r2.pointsFor += matchup.manager_2_score;
      r2.pointsAgainst += matchup.manager_1_score;

      if (matchup.winner === null) {
        r1.ties += 1;
        r2.ties += 1;
      } else if (matchup.winner === matchup.manager_1) {
        r1.wins += 1;
        r2.losses += 1;
      } else {
        r2.wins += 1;
        r1.losses += 1;
      }
    }

    const ranked = [...runningByName.values()].sort(
      (a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor,
    );

    ranked.forEach((record, i) => {
      if (!historyByName.has(record.name)) historyByName.set(record.name, []);
      historyByName.get(record.name).push({
        gameweek: gw,
        rank: i + 1,
        wins: record.wins,
        losses: record.losses,
        pointsFor: record.pointsFor,
      });
    });
  }

  return historyByName;
}
