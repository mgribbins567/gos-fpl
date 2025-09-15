import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Layout from "../components/layout";
import Link from "next/link";
import {
  GetExtendedLeagueTable,
  GetChampionsLeagueTable,
} from "../lib/history_util";
import { Matchups } from "../lib/matchups";
import managers from "../data/managers.json";
import kickoffCupMatches from "../data/tournament_1_25_26.json";

function Player(points, web_name) {
  this.points = points;
  this.web_name = web_name;
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
      return 730;
    case 735: // Traoré
      return 726; // Kolo Muani
    case 682: // Wolfe
      return 685; // Diakite
    default:
      return element;
  }
}

// https://draft.premierleague.com/api/entry/${managerId}/event/${gameweekId}
// "picks":
// [ {"element", "position"} ]
// picks.element: Player ID
// picks.position: Player position in lineup

async function calculateDraftManagerScore(
  managerId,
  gameweekId,
  playerScoreMap
) {
  const teamRes = await fetch(
    `https://draft.premierleague.com/api/entry/${managerId}/event/${gameweekId}`
  );
  const teamData = await teamRes.json();

  if (!teamData || !teamData.picks) {
    return { totalScore: 0, team: [] };
  }

  let totalScore = 0;
  const team = teamData.picks.map((pick) => {
    const elementId = checkElementId(pick.element);
    const score = playerScoreMap.get(elementId).points || 0;
    if (pick.position < 12) {
      totalScore += score;
    }
    return {
      id: elementId,
      name: playerScoreMap.get(elementId).web_name,
      score: score,
    };
  });
  return { totalScore, team };
}

// https://fantasy.premierleague.com/api/bootstrap-static/
//
// "element_types":
// [{"id", "singular_name", "singular_name_short"}]
// element_types.id: Position ID
// element_types.singular_name: Position name (e.g. Forward)
// element_types.singular_name_short: Position name abbreviated (e.g. FWD)
//
// "elements":
// [{"code", "element_type", "id", "first_name", "second_name", "web_name", "team", "team_code"}]
// elements.code:
// elements.id:
// elements.element_type: Position ID, eq to element_types.id
// elements.team: Eq to teams.id
// elements.team_code: Eq to teams.code
// * elements also has season data, including goals, assist, etc. *
//
// "teams":
// [{"code", "id", "name"}]
// teams.code: Eq to elements.code
// teams.id: Eq to elements.id, alphabetical ID
// ------------------------------------------------------------------------ //
// https://fantasy.premierleague.com/api/event/${gameweek}/live/
//
// "elements":
// [{"id", "stats", "explain"}]
// elements.id: Eq to elements.id (I believe)
// elements.stats: Object containing data such as minutes, goals, assists, etc.
// elements.explain: elements.explain.stats is an array of objects that contain what the player earned points for. E.g. 2 points for minutes

export async function getBootstrapData() {
  const boostrapRes = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  return await boostrapRes.json();
}

async function getLiveData(gameweek) {
  const liveRes = await fetch(
    `https://fantasy.premierleague.com/api/event/${gameweek}/live/`
  );
  return await liveRes.json();
}

async function getProcessedMatchups(matchups, playerScoreMap, gameweekId) {
  const processedMatchups = await Promise.all(
    matchups.map(async (match) => {
      const manager1Id = match.league_entry_1;
      const manager2Id = match.league_entry_2;

      const team1Data = await calculateDraftManagerScore(
        managers[manager1Id].entry_id,
        gameweekId,
        playerScoreMap
      );
      const team2Data = await calculateDraftManagerScore(
        managers[manager2Id].entry_id,
        gameweekId,
        playerScoreMap
      );

      const matchId = gameweekId + "-" + manager1Id + "-" + manager2Id;

      return {
        id: matchId,
        manager1: {
          id: manager1Id,
          managerName: managers[manager1Id].name,
          liveScore: team1Data.totalScore,
          team: team1Data.team,
        },
        manager2: {
          id: manager2Id,
          managerName: managers[manager2Id].name,
          liveScore: team2Data.totalScore,
          team: team2Data.team,
        },
      };
    })
  );
  return processedMatchups;
}

// https://draft.premierleague.com/api/league/${league}/details
//
// "league_entries":
// [{"entry_id","id"}]
// league_entries.entry_id: Used for API call ${managerId}
// league_entries.id: Used as a key and to craft match IDs
//
// "matches":
// [{"event", "finished", "league_entry_1", "league_entry_2"}]
// matches.event: Gameweek of the matchup (gameweekId)
// matches.finished: Boolean if the gameweek has ended
// matches.league_entry_1 and matches.league_entry_2: Manager entry_id
// *matches also contains finalized point values*

export async function getLeagueDetails(league) {
  const leagueDetailsRes = await fetch(
    `https://draft.premierleague.com/api/league/${league}/details`
  );
  return await leagueDetailsRes.json();
}

function getPlayerScoreMap(liveData, bootstrapData) {
  const playerScoreMap = new Map();
  liveData.elements.forEach((player) => {
    playerScoreMap.set(
      player.id,
      new Player(
        player.stats.total_points,
        bootstrapData.elements.find(
          (element) => element.id === player.id
        ).web_name
      )
    );
  });
  return playerScoreMap;
}

export async function getServerSideProps() {
  const LEAGUE_A_ID = 157;
  const LEAGUE_B_ID = 461;

  const bootstrapData = await getBootstrapData();

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true
  );

  const gameweekId = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapData.events.find((event) => event.is_next === true)?.id || 1;

  const liveData = await getLiveData(gameweekId);
  const playerScoreMap = getPlayerScoreMap(liveData, bootstrapData);

  const matchupsAData = await getLeagueDetails(LEAGUE_A_ID);
  const matchupsBData = await getLeagueDetails(LEAGUE_B_ID);

  const currentWeekAMatches = matchupsAData.matches.filter(
    (match) => match.event === gameweekId
  );

  const currentWeekBMatches = matchupsBData.matches.filter(
    (match) => match.event === gameweekId
  );

  const currentCupMatchups = kickoffCupMatches.matches.filter(
    (match) => match.event === gameweekId
  );

  const processedAMatchups = await getProcessedMatchups(
    currentWeekAMatches,
    playerScoreMap,
    gameweekId
  );
  const processedBMatchups = await getProcessedMatchups(
    currentWeekBMatches,
    playerScoreMap,
    gameweekId
  );

  const processedCupMatchups = await getProcessedMatchups(
    currentCupMatchups,
    playerScoreMap,
    gameweekId
  );

  return {
    props: {
      processedAMatchups: processedAMatchups,
      processedBMatchups: processedBMatchups,
      processedCupMatchups: processedCupMatchups,
      gameweekId: gameweekId,
    },
  };
}

export default function Season_4({
  processedAMatchups,
  processedBMatchups,
  processedCupMatchups,
  gameweekId,
}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 4 - Game of Stones</title>
        </Head>
        <h1>Season 4 - 2024/2025</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br />
        <hr style={{ width: "90%" }} />
        <h2>League A Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH1:AR13" />
        </div>
        <br />
        <Matchups
          processedMatchups={processedAMatchups}
          gameweekId={gameweekId}
        />
        <h2>League B Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH14:AR26" />
        </div>
        <br />
        <Matchups
          processedMatchups={processedBMatchups}
          gameweekId={gameweekId}
        />
        <hr style={{ width: "90%" }} />
        <br />
        <h2>The League</h2>
        {/* <div>
          <GetChampionsLeagueTable range="'Champions League'!B3:L27" />
        </div> */}
        <Matchups
          processedMatchups={processedCupMatchups}
          gameweekId={gameweekId}
        />
        <hr style={{ width: "90%" }} />
        <br />
        <h2>League A Prize Pool</h2>
        <p>Total Pot - $668</p>
        <ul>
          <li>1st - $334 + Jersey</li>
          <li>2nd - $200.40</li>
          <li>3rd - $133.60</li>
          <br />
          <li>Manager of the Month - $10</li>
          <li>Mid-Season Tournament - $30 + Mystery Kit</li>
        </ul>
        <h2>League B Prize Pool</h2>
        <p>Total Pot - $190</p>
        <ul>
          <li>1st - $95 + Jersey</li>
          <li>2nd - $57</li>
          <li>3rd - $38</li>
          <br />
          <li>Manager of the Month - $10</li>
          <li>Mid-Season Tournament - $30 + Mystery Kit</li>
        </ul>
      </div>
    </Layout>
  );
}
