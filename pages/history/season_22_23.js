import React from "react";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import data from "../../data/league_table_22_23.json";

function GetExtendedLeagueTable() {
  const DisplayData = data.map((info) => {
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

export default function Season_22_23({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 1 - Game of Stones</title>
        </Head>
        <h1>Season 1 - 2022/2023</h1>
        <h2>League Table</h2>
        <div>
          <GetExtendedLeagueTable />
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
