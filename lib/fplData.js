function createPlayer(player, elementsById, teamsById) {
  const element = elementsById.get(player.player_id);
  if (!element) {
    throw new Error(
      `Player ${player.player_id} not found in bootstrap-static data`,
    );
  }
  const club = teamsById.get(element.team);
  if (!club) {
    throw new Error(`Team ${element.team} not found in bootstrap-static data`);
  }
  return {
    ...player,
    name: element.web_name,
    teamId: element.team,
    teamCode: club.code,
    teamName: club.name,
    teamShortName: club.short_name,
    elementType: element.element_type,
    seasonStats: element,
  };
}

export function mergeTeamWithLiveData(team, bootstrap, live) {
  const elementsById = new Map(bootstrap.elements.map((el) => [el.id, el]));
  const statsById = new Map(live.elements.map((el) => [el.id, el.stats]));
  const liveStatsById = new Map(live.elements.map((el) => [el.id, el.explain]));
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));

  return team.map((teamPlayer) => {
    const element = createPlayer(teamPlayer, elementsById, teamsById);
    const stats = statsById.get(teamPlayer.player_id);
    const explain = liveStatsById.get(teamPlayer.player_id);
    if (!stats) {
      return { ...element, points: null, minutes: null, liveStats: null };
    }
    return {
      ...element,
      points: stats.total_points,
      minutes: stats.minutes,
      gameweekStats: stats,
      explain: explain,
    };
  });
}

export const ELEMENT_TYPE = {
  GOALKEEPER: 1,
  DEFENDER: 2,
  MIDFIELDER: 3,
  FORWARD: 4,
};

export function getPlayerPositionName(elementType) {
  switch (elementType) {
    case ELEMENT_TYPE.GOALKEEPER:
      return "GKP";
    case ELEMENT_TYPE.DEFENDER:
      return "DEF";
    case ELEMENT_TYPE.MIDFIELDER:
      return "MID";
    case ELEMENT_TYPE.FORWARD:
      return "FWD";
  }
}

export const POSITION_LABELS = {
  [ELEMENT_TYPE.GOALKEEPER]: "GKP",
  [ELEMENT_TYPE.DEFENDER]: "DEF",
  [ELEMENT_TYPE.MIDFIELDER]: "MID",
  [ELEMENT_TYPE.FORWARD]: "FWD",
};

export function getShirtUrl(teamCode, elementType) {
  const suffix =
    elementType === ELEMENT_TYPE.GOALKEEPER ? `${teamCode}_1` : `${teamCode}`;
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${suffix}-66.png`;
}

export function groupPlayersByPosition(players) {
  const starters = players.filter((p) => p.is_starter);
  const bench = players
    .filter((p) => !p.is_starter)
    .sort((a, b) => a.bench_order - b.bench_order);

  return {
    forwards: starters.filter((p) => p.elementType === ELEMENT_TYPE.FORWARD),
    midfielders: starters.filter(
      (p) => p.elementType === ELEMENT_TYPE.MIDFIELDER,
    ),
    defenders: starters.filter((p) => p.elementType === ELEMENT_TYPE.DEFENDER),
    goalkeepers: starters.filter(
      (p) => p.elementType === ELEMENT_TYPE.GOALKEEPER,
    ),
    bench,
  };
}

export function orderPlayersForList(players) {
  const { goalkeepers, defenders, midfielders, forwards, bench } =
    groupPlayersByPosition(players);

  const benchGoalkeeper = bench.find((p) => p.bench_order === 1);
  const benchOutfield = bench.filter((p) => p.bench_order !== 1);

  return [
    ...forwards,
    ...midfielders,
    ...defenders,
    ...goalkeepers,
    ...(benchGoalkeeper ? [benchGoalkeeper] : []),
    ...benchOutfield,
  ];
}

export function getTotalStartingPoints(players) {
  return players
    .filter((player) => player.is_starter)
    .reduce((total, player) => total + (player.points ?? 0), 0);
}

export function getTopPlayer(players) {
  return players
    .filter((player) => player.is_starter)
    .reduce((topPlayer, player) => {
      if (!topPlayer || player.points > topPlayer.points) {
        return player;
      }
      return { name: topPlayer.name, points: topPlayer.points };
    }, undefined);
}

export function attachFixtureStatus(players, bootstrap, fixtures, gameweek) {
  const nextGameweek = bootstrap.events.find((e) => e.is_next);
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));
  const fixturesByTeamId = new Map();
  const upcomingFixturesByTeamId = new Map();
  for (const fixture of fixtures) {
    if (fixture.event === gameweek) {
      for (const [teamId, isHome] of [
        [fixture.team_h, true],
        [fixture.team_a, false],
      ]) {
        if (!fixturesByTeamId.has(teamId)) {
          fixturesByTeamId.set(teamId, []);
        }
        fixturesByTeamId.get(teamId).push({ fixture, isHome });
      }
    }
    if (
      fixture.event >= nextGameweek.id &&
      fixture.event < nextGameweek.id + 5
    ) {
      for (const [teamId, isHome] of [
        [fixture.team_h, true],
        [fixture.team_a, false],
      ]) {
        if (!upcomingFixturesByTeamId.has(teamId)) {
          upcomingFixturesByTeamId.set(teamId, []);
        }
        upcomingFixturesByTeamId.get(teamId).push({ fixture, isHome });
      }
    }
  }

  return players.map((player) => {
    const entries = fixturesByTeamId.get(player.teamId || player.team) ?? [];
    const upcomingEntries =
      upcomingFixturesByTeamId.get(player.teamId || player.team) ?? [];
    const playerFixtures = entries.map(({ fixture, isHome }) => {
      const opponentTeamId = isHome ? fixture.team_a : fixture.team_h;
      const opponentScore = isHome
        ? fixture.team_a_score
        : fixture.team_h_score;
      const opponentTeam = teamsById.get(opponentTeamId);
      const teamScore = isHome ? fixture.team_h_score : fixture.team_a_score;
      if (!opponentTeam) {
        throw new Error(
          `Opponent team ${opponentTeamId} not found in bootstrap-static data`,
        );
      }
      return {
        opponentShortName: opponentTeam.short_name,
        opponentScore,
        teamScore,
        isHome,
        started: fixture.started,
        finished: fixture.finished,
        minutes: fixture.minutes,
      };
    });

    const upcomingFixtures = upcomingEntries.map(({ fixture, isHome }) => {
      const opponentTeamId = isHome ? fixture.team_a : fixture.team_h;
      const opponentTeam = teamsById.get(opponentTeamId);
      return {
        isHome,
        opponentShortName: opponentTeam.short_name,
      };
    });

    return {
      ...player,
      fixtures: playerFixtures,
      upcomingFixtures: upcomingFixtures,
    };
  });
}

export function getFixtureDisplayText(player) {
  const fixtures = player.fixtures ?? [];
  const upcoming = fixtures.filter((f) => !f.started);

  if (fixtures.length === 0 || upcoming.length === 0) {
    return player.points !== null ? player.points : "-";
  }

  const opponentText = upcoming
    .map((f) => `${f.opponentShortName} ${f.isHome ? "(H)" : "(A)"}`)
    .join(", ");

  if (upcoming.length === fixtures.length) {
    return opponentText;
  }

  return `${player.points ?? 0}, ${opponentText}`;
}

const NUMERIC_HISTORY_COLUMNS = [
  "PTS",
  "MP",
  "G",
  "A",
  "CS",
  "GC",
  "OG",
  "YC",
  "RC",
  "B",
  "BPS",
  "DC",
  "PS",
  "PM",
];

export function buildPlayerGameweekHistory({
  history,
  bootstrap,
  ownershipRows,
  managers,
  managerLeagues,
}) {
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));

  const leagueIds = [...new Set(managerLeagues.values())].sort();
  const ownerColumns = leagueIds.map((leagueId) => ({
    leagueId,
    label: `O${leagueId.toUpperCase()}`,
  }));

  const ownersByGameweek = new Map();
  for (const { managerId, gameweekNumber } of ownershipRows) {
    const leagueId = managerLeagues.get(managerId);
    if (!leagueId) continue;
    if (!ownersByGameweek.has(gameweekNumber)) {
      ownersByGameweek.set(gameweekNumber, new Map());
    }
    ownersByGameweek.get(gameweekNumber).set(leagueId, managerId);
  }

  const rows = history
    .slice()
    .sort((a, b) => a.round - b.round)
    .map((data) => {
      const opponent = teamsById.get(data.opponent_team);
      if (!opponent) {
        throw new Error(
          `Opponent team ${data.opponent_team} not found in bootstrap-static data`,
        );
      }
      const leagueOwners = ownersByGameweek.get(data.round) ?? new Map();
      const row = {
        GW: data.round,
        VS: ` ${data.was_home ? "" : "@"}${opponent.short_name}`,
        PTS: data.total_points,
        MP: data.minutes,
        G: data.goals_scored,
        A: data.assists,
        CS: data.clean_sheets,
        GC: data.goals_conceded,
        OG: data.own_goals,
        YC: data.yellow_cards,
        RC: data.red_cards,
        B: data.bonus,
        BPS: data.bps,
        DC: data.defensive_contribution,
        PS: data.penalties_saved,
        PM: data.penalties_missed,
      };
      for (const { leagueId, label } of ownerColumns) {
        const managerId = leagueOwners.get(leagueId);
        row[label] = managerId
          ? (managers.get(managerId)?.short_name ?? "")
          : "";
      }
      return row;
    });

  const totals = rows.reduce((acc, row) => {
    for (const col of NUMERIC_HISTORY_COLUMNS) {
      acc[col] = (acc[col] ?? 0) + (row[col] ?? 0);
    }
    return acc;
  }, {});
  totals.GW = "Total";
  totals.VS = "";
  const lastRow = rows[rows.length - 1];
  for (const { label } of ownerColumns) {
    totals[label] = lastRow ? lastRow[label] : "";
  }

  return { rows, ownerColumns, totals };
}

export function mergeFixturesById(...fixtureArrays) {
  const byId = new Map();
  for (const fixtures of fixtureArrays) {
    if (!fixtures) continue;
    for (const fixture of fixtures) {
      byId.set(fixture.id, fixture);
    }
  }
  return Array.from(byId.values());
}
