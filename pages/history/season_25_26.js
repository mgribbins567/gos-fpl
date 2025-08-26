import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import {
  GetExtendedLeagueTable,
  GetChampionsLeagueTable,
} from "../../lib/history_util";
import { Matchups, calculateDraftManagerScore } from "../../lib/matchups";
import * as managers from "../../data/managers.json";
import * as kickoffCupMatches from "../../data/tournament_1_25_26.json";

function Player(points, web_name) {
  this.points = points;
  this.web_name = web_name;
}

async function getBootstrapData() {
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

async function getLeagueDetails(league) {
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

export default function Season_25_26({
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
