import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function Season_22_23({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 1 - Game of Stones</title>
        </Head>
        <h1>Season 1 - 2022/2023</h1>
        <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
        <Link href={`/history/season_25_26`}>Season 4 - 2025/2026</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br></br>
        <h2>League Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!A1:K17" />
        </div>
        <p>
          PPW (Points Per Week) is calculated by dividing PF (Points For) by the
          number of gameweeks played. PPG (Points Per Game) is calculated by
          dividing P (Points) by the number of gameweeks played.
        </p>
      </div>
    </Layout>
  );
}
