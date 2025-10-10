import { useMemo } from "react";
import managers from "../data/managers.json";
import { getTotalScore } from "../components/Scorebox";

function getScores(
  leagueTable,
  match,
  playerScoreMap,
  managerScoreMap,
  isCurrent
) {
  let score1, score2;
  const team1 = leagueTable[match.league_entry_1];
  const team2 = leagueTable[match.league_entry_2];

  if (isCurrent) {
    score1 =
      getTotalScore(
        match.event,
        match.league_entry_1,
        playerScoreMap,
        managerScoreMap
      ) || 0;
    score2 =
      getTotalScore(
        match.event,
        match.league_entry_2,
        playerScoreMap,
        managerScoreMap
      ) || 0;
  } else {
    score1 = match.league_entry_1_points;
    score2 = match.league_entry_2_points;
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

  return { team1, team2 };
}

export function useLiveLeagueData(
  gameweek,
  allMatchups,
  playerScoreMap,
  managerPlayerMap
) {
  const memoData = useMemo(() => {
    if (!allMatchups) {
      return { liveTable: [], startOfWeekTable: [] };
    }
    const { league_entries, matches } = allMatchups;

    const baseTable = {};
    league_entries.forEach((entry) => {
      baseTable[entry.id] = {
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
      if (match.finished && match.event < gameweek) {
        getScores(
          baseTable,
          match,
          playerScoreMap,
          managerPlayerMap,
          /*isCurrent=*/ false
        );
      }
    });

    const sortedBaseTable = Object.values(baseTable).sort((a, b) => {
      if (a.Pts != b.Pts) {
        return b.Pts - a.Pts;
      }
      return b.PF - a.PF;
    });

    const liveTableData = JSON.parse(JSON.stringify(baseTable));
    const startRanks = {};
    sortedBaseTable.forEach((team, index) => {
      startRanks[team.id] = index + 1;
    });

    const matchesForCurrentGameweek = matches.filter(
      (match) => match.event === gameweek
    );

    matchesForCurrentGameweek.forEach((match) => {
      getScores(
        liveTableData,
        match,
        playerScoreMap,
        managerPlayerMap,
        /*isCurrent=*/ true
      );
    });

    const liveSortedTable = Object.values(liveTableData)
      .sort((a, b) => {
        if (a.Pts != b.Pts) {
          return b.Pts - a.Pts;
        }
        return b.PF - a.PF;
      })
      .map((team, index) => {
        const liveRank = index + 1;
        const startRank = startRanks[team.id];
        return { ...team, rankDifference: startRank - liveRank };
      });

    return { liveTable: liveSortedTable, startOfWeekTable: sortedBaseTable };
  }, [gameweek, allMatchups, playerScoreMap, managerPlayerMap]);

  return memoData;
}
