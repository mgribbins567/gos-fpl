import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import managers from "../../../data/managers.json";
import { GetManagerLeagueTable } from "../../../lib/history_util";

var manager = "Gavin";

export default function Gavin({}) {
  return (
    <Layout gavin>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetManagerLeagueTable data={managers} manager={manager} />
        </div>
        <p>Cups not included in total league standings!</p>
      </div>
    </Layout>
  );
}
