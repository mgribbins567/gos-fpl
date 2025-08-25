import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";
import { Matchups, calculateDraftManagerScore } from "../../lib/matchups";
import * as managers from "../../data/managers.json";

function Player(points, web_name) {
  this.points = points;
  this.web_name = web_name;
}

export async function getServerSideProps() {
  const LEAGUE_A_ID = 157;
  const LEAGUE_B_ID = 461;

  const boostrapRes = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  const bootstrapData = await boostrapRes.json();

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true
  );

  const gameweekId = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapData.events.find((event) => event.is_next === true)?.id || 1;

  const liveRes = await fetch(
    `https://fantasy.premierleague.com/api/event/${gameweekId}/live/`
  );
  const liveData = await liveRes.json();
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

  const matchupsARes = await fetch(
    `https://draft.premierleague.com/api/league/${LEAGUE_A_ID}/details`
  );
  const matchupsAData = await matchupsARes.json();
  const matchupsBRes = await fetch(
    `https://draft.premierleague.com/api/league/${LEAGUE_B_ID}/details`
  );
  const matchupsBData = await matchupsBRes.json();

  const currentWeekAMatches = matchupsAData.matches.filter(
    (match) => match.event === gameweekId
  );

  const currentWeekBMatches = matchupsBData.matches.filter(
    (match) => match.event === gameweekId
  );

  var final = currentWeekAMatches.concat(currentWeekBMatches);

  const processedMatchups = await Promise.all(
    final.map(async (match) => {
      const manager1Id = match.league_entry_1;
      const manager2Id = match.league_entry_2;

      console.log("--------------------");
      console.log(
        managers[manager1Id].name + " vs " + managers[manager2Id].name
      );
      const score1 = await calculateDraftManagerScore(
        managers[manager1Id].entry_id,
        gameweekId,
        playerScoreMap
      );
      const score2 = await calculateDraftManagerScore(
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
          liveScore: score1,
        },
        manager2: {
          id: manager2Id,
          managerName: managers[manager2Id].name,
          liveScore: score2,
        },
      };
    })
  );

  return {
    props: {
      processedMatchups: processedMatchups,
      gameweekId: gameweekId,
    },
  };
}

export default function Season_25_26({ processedMatchups, gameweekId }) {
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
        <h2>League A Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH1:AR13" />
        </div>
        <br />
        <br />
        <br />
        <Matchups
          processedMatchups={processedMatchups}
          gameweekId={gameweekId}
        />
        <h2>League B Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH14:AR26" />
        </div>
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
