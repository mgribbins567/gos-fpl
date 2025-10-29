import { getLiveData } from "../api/fantasyService";
import managers from "../data/managers.json";

export function Player(points, web_name, minutes, stats) {
  this.points = points;
  this.web_name = web_name;
  this.minutes = minutes;
  this.stats = stats;
}

export function checkElementId(element) {
  switch (element) {
    case 666: // Gyokeres
      return 661; // Ekitike
    case 661: // Ekitike
      return 666; // Gyokeres
    case 673: // Palhinha
      return 674; // Ramsdale
    case 674: // Ramsdale
      return 673; // Palhinha
    case 715: // John
      return 714; // Woltemade
    case 679: // Hermansen
      return 681; // Sesko
    case 729: // Cuiabano
      return 733; // Lammens
    case 718: // Magassa
      return 717; // Xavi
    case 728: // Röhl
      return 736; // Donnarumma
    case 733: // Lammens
      return 730; // Brobbey
    case 735: // Traoré
      return 726; // Kolo Muani
    case 682: // Wolfe
      return 685; // Diakite
    case 736: // Donnarumma
      return 720; // Tolu
    case 667: // Aznou
      return 668; // Xhaka
    case 664: // Lecomte
      return 660; // Stach
    case 695: // Tchatchoua
      return 696; // Kalimuendo
    case 684: // Thiaw
      return 683; // Alderete
    case 721: // Milosavljević
      return 722; // Florentino
    default:
      return element;
  }
}

function getPosition(pos) {
  switch (pos) {
    case 1:
      return "GKP";
    case 2:
      return "DEF";
    case 3:
      return "MID";
    case 4:
      return "FWD";
    default:
      return "uh";
  }
}

export async function getPlayerScoreMap(gameweek, bootstrapData) {
  const playersData = {};
  bootstrapData.elements.forEach((player) => {
    playersData[player.id] = {
      details: {
        id: player.id,
        firstName: player.first_name,
        lastName: player.second_name,
        webName: player.web_name,
        teamCode: player.team_code,
        position: getPosition(player.element_type),
        status: player.status,
      },
      gameweeks: {},
    };
  });

  for (let gw = 1; gw <= gameweek; gw++) {
    const gameweekData = await getLiveData(gw);

    gameweekData.elements.forEach((player) => {
      const playerId = player.id;
      if (playersData[playerId]) {
        playersData[playerId].gameweeks[gw] = player;
      }
    });
  }

  return playersData;
}

export async function getManagerPlayerMap(gameweek) {
  const managerData = {};

  for (var manager in managers) {
    managerData[manager] = {
      details: {
        name: managers[manager].name,
        entry_id: managers[manager].entry_id,
      },
      gameweeks: {},
    };
    const urls = [];

    for (let gw = 1; gw <= gameweek; gw++) {
      const url =
        "https://draft.premierleague.com/api/entry/" +
        managerData[manager].details.entry_id +
        "/event/" +
        gw;

      urls.push(url);
    }

    const fetchPromises = urls.map((url) => fetch(url));

    await Promise.all(fetchPromises)
      .then((responses) => {
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((data) => {
        for (let index = 0; index < gameweek; index++) {
          managerData[manager].gameweeks[index + 1] = data[index].picks;
          managerData[manager].gameweeks[index + 1].element = checkElementId(
            managerData[manager].gameweeks[index + 1].element
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching manager team data:", error);
      });
  }
  return managerData;
}

export async function getTeamScoreMap(
  gameweek,
  bootstrapData,
  fixturesData,
  playerScoreMap
) {
  const allGameweeksData = {};

  const teamsMap = new Map(
    bootstrapData.teams.map((team) => [team.id, team.name])
  );

  for (const fixture of fixturesData) {
    const gameweek = fixture.event;
    const homeTeamCode = fixture.team_h;
    const awayTeamCode = fixture.team_a;

    if (!allGameweeksData[gameweek]) {
      allGameweeksData[gameweek] = {};
    }

    allGameweeksData[gameweek][homeTeamCode] = {
      teamName: teamsMap.get(homeTeamCode),
      matchDetails: {
        opponentId: awayTeamCode,
        opponentName: teamsMap.get(awayTeamCode),
        wasHome: true,
        teamScore: fixture.team_h_score,
        opponentScore: fixture.team_a_score,
      },
      players: [],
    };

    allGameweeksData[gameweek][awayTeamCode] = {
      teamName: teamsMap.get(awayTeamCode),
      matchDetails: {
        opponentId: homeTeamCode,
        opponentName: teamsMap.get(homeTeamCode),
        wasHome: false,
        teamScore: fixture.team_a_score,
        opponentScore: fixture.team_h_score,
      },
      players: [],
    };

    const playerStatsForFixture = new Map();

    for (const stat of fixture.stats) {
      const statName = stat.identifier;

      for (const playerEvent of stat.h) {
        const playerId = playerEvent.element;
        if (!playerStatsForFixture.has(playerId)) {
          playerStatsForFixture.set(playerId, {
            playerId,
            name: playerScoreMap[playerId].name,
            teamCode: homeTeamCode,
          });
        }
        playerStatsForFixture.get(playerId)[statName] = playerEvent.value;
      }

      for (const playerEvent of stat.a) {
        const playerId = playerEvent.element;
        if (!playerStatsForFixture.has(playerId)) {
          playerStatsForFixture.set(playerId, {
            playerId,
            name: playerScoreMap[playerId].name,
            teamCode: awayTeamCode,
          });
        }
        playerStatsForFixture.get(playerId)[statName] = playerEvent.value;
      }

      for (const playerData of playerStatsForFixture.values()) {
        if (playerData.teamCode === homeTeamCode) {
          allGameweeksData[gameweek][homeTeamCode].players.push(playerData);
        } else if (playerData.teamCode === awayTeamCode) {
          allGameweeksData[gameweek][awayTeamCode].players.push(playerData);
        }
      }
    }
  }
  return allGameweeksData;
}
