import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import league_table from "../../data/league_table_24_25.json";
import group_stage_table from "../../data/tournament_1_24_25.json";
import {
  GetExtendedLeagueTable,
  GetGroupStageTable,
} from "../../lib/history_util";

function GetKickoffTournamentGroups() {
  var groupA = ["Matthew", "Darryan", "Jesse", "Soph"];
  var groupB = ["Gavin", "Kevin", "Andrew", "Coop"];
  var groupC = ["Dylan", "Scott", "Zach", "Rebecca"];
  var groupD = ["Luke", "MatthewR", "Emily", "Matt"];
  return (
    <div>
      <h3 className={utilStyles.main}>Group A</h3>
      <div>
        <GetGroupStageTable data={group_stage_table} managers={groupA} />
      </div>
      <h3 className={utilStyles.main}>Group B</h3>
      <div>
        <GetGroupStageTable data={group_stage_table} managers={groupB} />
      </div>
      <h3 className={utilStyles.main}>Group C</h3>
      <div>
        <GetGroupStageTable data={group_stage_table} managers={groupC} />
      </div>
      <h3 className={utilStyles.main}>Group D</h3>
      <div>
        <GetGroupStageTable data={group_stage_table} managers={groupD} />
      </div>
    </div>
  );
}

export default function Season_23_24({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 3 - Game of Stones</title>
        </Head>
        <h1>Season 3 - 2024/2025</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br />
        <h2>Draft Date August 11th at 11:00am PDT / 2:00pm EDT</h2>
        <h2>Prize Pool</h2>
        <p>Total Pot - $534.13</p>
        <ul>
          <li>1st - $267.07 + Jersey</li>
          <li>2nd - $133.53</li>
          <li>3rd - $80.12</li>
          <li>4th - $53.41</li>
          <br />
          <li>Manager of the Month - $10</li>
          <li>Mid-Season Tournament - $30 + Mystery Kit</li>
        </ul>
        <h2>League Table</h2>
        <div>
          <GetExtendedLeagueTable data={league_table} />
        </div>
        <br />
        <h2>Kickoff Tournament</h2>
        <div>
          <GetKickoffTournamentGroups />
        </div>
      </div>
    </Layout>
  );
}
