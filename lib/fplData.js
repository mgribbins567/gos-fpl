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
    elementType: element.element_type,
  };
}

export function mergeTeamWithLiveData(team, bootstrap, live) {
  const elementsById = new Map(bootstrap.elements.map((el) => [el.id, el]));
  const statsById = new Map(live.elements.map((el) => [el.id, el.stats]));
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));

  return team.map((teamPlayer) => {
    const element = createPlayer(teamPlayer, elementsById, teamsById);
    const stats = statsById.get(teamPlayer.player_id);
    if (!stats) {
      throw new Error(
        `Player ${teamPlayer.player_id} not found in live event data`,
      );
    }
    return {
      ...element,
      points: stats.total_points,
      minutes: stats.minutes,
      liveStats: stats,
    };
  });
}

export function mergeTeamWithStaticData(team, bootstrap) {
  const elementsById = new Map(bootstrap.elements.map((el) => [el.id, el]));
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));

  return team.map((teamPlayer) => {
    const element = createPlayer(teamPlayer, elementsById, teamsById);
    return { ...element, points: null, minutes: null, liveStats: null };
  });
}

export const ELEMENT_TYPE = {
  GOALKEEPER: 1,
  DEFENDER: 2,
  MIDFIELDER: 3,
  FORWARD: 4,
};

export function getShirtUrl(teamCode, elementType) {
  const suffix =
    elementType === ELEMENT_TYPE.GOALKEEPER ? `${teamCode}_1` : `${teamCode}`;
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${suffix}-66.png`;
}

export function groupPlayersByPosition(players) {
  console.log("players: ", players);
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

export function getTotalStartingPoints(players) {
  return players
    .filter((player) => player.is_starter)
    .reduce((total, player) => total + player.points, 0);
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

export function attachFixtureStatus(players, bootstrap, fixtures) {
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));
  const fixturesByTeamId = new Map();
  for (const fixture of fixtures) {
    for (const [teamId, isHome] of [
      [fixture.team_h, true],
      [fixture.team_a, false],
    ]) {
      if (!fixturesByTeamId.has(teamId)) fixturesByTeamId.set(teamId, []);
      fixturesByTeamId.get(teamId).push({ fixture, isHome });
    }
  }

  return players.map((player) => {
    const entries = fixturesByTeamId.get(player.teamId) ?? [];
    const playerFixtures = entries.map(({ fixture, isHome }) => {
      const opponentTeamId = isHome ? fixture.team_a : fixture.team_h;
      const opponentTeam = teamsById.get(opponentTeamId);
      if (!opponentTeam) {
        throw new Error(
          `Opponent team ${opponentTeamId} not found in bootstrap-static data`,
        );
      }
      return {
        opponentShortName: opponentTeam.short_name,
        isHome,
        started: fixture.started,
        finished: fixture.finished,
      };
    });

    return { ...player, fixtures: playerFixtures };
  });
}

export function getFixtureDisplayText(player) {
  const fixtures = player.fixtures ?? [];
  const upcoming = fixtures.filter((f) => !f.started);

  if (fixtures.length === 0 || upcoming.length === 0) {
    return player.points !== null ? player.points : "-";
  }

  const opponentText = upcoming
    .map((f) => `${f.isHome ? "vs " : "@"}${f.opponentShortName}`)
    .join(", ");

  if (upcoming.length === fixtures.length) {
    return opponentText;
  }

  return `${player.points ?? 0}, ${opponentText}`;
}
