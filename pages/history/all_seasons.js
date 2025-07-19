import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function AllSeasons({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>All Seasons - Game of Stones</title>
        </Head>
        <h1>Combined Season Stats</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
        <h2>League Table (by Points)</h2>
        <div>
          <GetExtendedLeagueTable range="Table!A1:L25" />
        </div>
        <p>
          PPW (Points Per Week) is calculated by dividing PF (Points For) by the
          number of gameweeks played. PPG (Points Per Game) is calculated by
          dividing P (Points) by the number of gameweeks played.
        </p>
        <br></br>
        <h2>League Table Expanded</h2>
        <div>
          {/* <GetExtendedLeagueTable data={league_table_expanded} /> */}
        </div>
      </div>
    </Layout>
  );
}
