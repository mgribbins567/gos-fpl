export function getCurrentGameweek(bootstrap) {
  const current = bootstrap.events.find((event) => event.is_current);
  if (!current) {
    throw new Error("No current gameweek found in bootstrap-static data");
  }
  return current.id;
}

export function isGameweekLive(bootstrap, gameweek) {
  const event = bootstrap.events.find((e) => e.id === gameweek);
  if (!event) {
    throw new Error(`Gameweek ${gameweek} not found in bootstrap-static data`);
  }
  return !event.finished;
}

export function mergeTeamWithLiveData(team, bootstrap, live) {
  const elementsById = new Map(bootstrap.elements.map((el) => [el.id, el]));
  const statsById = new Map(live.elements.map((el) => [el.id, el.stats]));
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));

  return team.map((teamPlayer) => {
    const element = elementsById.get(teamPlayer.player_id);
    if (!element) {
      throw new Error(
        `Player ${teamPlayer.player_id} not found in bootstrap-static data`,
      );
    }
    const stats = statsById.get(teamPlayer.player_id);
    if (!stats) {
      throw new Error(
        `Player ${teamPlayer.player_id} not found in live event data`,
      );
    }
    const club = teamsById.get(element.team);
    if (!club) {
      throw new Error(
        `Team ${element.team} not found in bootstrap-static data`,
      );
    }
    return {
      ...teamPlayer,
      name: element.web_name,
      teamId: element.team,
      teamCode: club.code,
      elementType: element.element_type,
      points: stats.total_points,
      minutes: stats.minutes,
    };
  });
}

const ELEMENT_TYPE = {
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
