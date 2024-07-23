import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import league_table from "../../data/league_table_all_seasons.json";
import league_table_expanded from "../../data/league_table_all_seasons_expanded.json";

function GetExtendedLeagueTable() {
  const DisplayData = league_table.map((info) => {
    return (
      <tr>
        <td>{info.place}</td>
        <td>
          <Link href={`/history/manager/${info.manager.toLowerCase()}`}>
            {info.manager}
          </Link>
        </td>
        <td>{info.mp}</td>
        <td>{info.w}</td>
        <td>{info.d}</td>
        <td>{info.l}</td>
        <td>{info.pf}</td>
        <td>{info.pa}</td>
        <td>{info.pd}</td>
        <td>{info.p}</td>
        <td>{info.ppw}</td>
        <td>{info.ppg}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Manager</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>PD</th>
            <th>P</th>
            <th>PPW</th>
            <th>PPG</th>
          </tr>
        </thead>
        <tbody>{DisplayData}</tbody>
      </table>
    </div>
  );
}

function GetExtendedLeagueTableExpanded() {
  const DisplayData = league_table_expanded.map((info) => {
    return (
      <tr>
        <td>{info.place}</td>
        <td>{info.manager}</td>
        <td>{info.w}</td>
        <td>{info.d}</td>
        <td>{info.l}</td>
        <td>{info.pf}</td>
        <td>{info.pa}</td>
        <td>{info.pd}</td>
        <td>{info.p}</td>
        <td>{info.ppw}</td>
        <td>{info.ppg}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Manager</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>PD</th>
            <th>P</th>
            <th>PPW</th>
            <th>PPG</th>
          </tr>
        </thead>
        <tbody>{DisplayData}</tbody>
      </table>
    </div>
  );
}

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
          <GetExtendedLeagueTable />
        </div>
        <p>
          PPW (Points Per Week) is calculated by dividing PF (Points For) by the
          number of gameweeks played. PPG (Points Per Game) is calculated by
          dividing P (Points) by the number of gameweeks played.
        </p>
        <br></br>
        <h2>League Table Expanded</h2>
        <div>
          <GetExtendedLeagueTableExpanded />
        </div>
      </div>
    </Layout>
  );
}
