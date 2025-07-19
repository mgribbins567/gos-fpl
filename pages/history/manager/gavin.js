import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import { GetManagerTable } from "../../../lib/history_util";
import { GavinAccolades } from "../accolades";

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
          <GetManagerTable manager={manager} />
        </div>
        <GavinAccolades />
      </div>
    </Layout>
  );
}
