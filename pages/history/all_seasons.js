import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import league_table from "../../data/league_table_all_seasons.json";
import league_table_expanded from "../../data/league_table_all_seasons_expanded.json";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function AllSeasons({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>All Seasons - Game of Stones</title>
        </Head>
        <h1>Combined Season Stats</h1>
        <h2>League Table (by Points)</h2>
        <div>
          <GetExtendedLeagueTable data={league_table} />
        </div>
        <p>
          PPW (Points Per Week) is calculated by dividing PF (Points For) by the
          number of gameweeks played. PPG (Points Per Game) is calculated by
          dividing P (Points) by the number of gameweeks played.
        </p>
        <br></br>
        <h2>League Table Expanded</h2>
        <div>
          <GetExtendedLeagueTable data={league_table_expanded} />
        </div>
      </div>
    </Layout>
  );
}
