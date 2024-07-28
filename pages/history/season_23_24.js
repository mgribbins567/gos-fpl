import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import data from "../../data/league_table_23_24.json";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function Season_23_24({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 2 - Game of Stones</title>
        </Head>
        <h1>Season 2 - 2023/2024</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <br></br>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br></br>
        <h2>League Table</h2>
        <div>
          <GetExtendedLeagueTable data={data} />
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
