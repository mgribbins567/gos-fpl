import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import Link from "next/link";
import { GetSeasonLink } from "./manager_util";
import managers from "../../../data/managers.json";

var manager = "Cara";

function GetExtendedLeagueTable() {
  let filteredContents = managers.filter((info) => info.manager === manager);
  const DisplayData = filteredContents.map((info) => {
    return (
      <tr>
        <td>
          <Link href={GetSeasonLink(info.s)}>{info.s}</Link>
        </td>
        <td>{info.place}</td>
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
            <th>Season</th>
            <th>Pos</th>
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

export default function Cara({}) {
  return (
    <Layout cara>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetExtendedLeagueTable />
        </div>
      </div>
    </Layout>
  );
}
