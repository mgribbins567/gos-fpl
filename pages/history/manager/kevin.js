import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import { GetManagerTable } from "../../../lib/history_util";
import { KevinAccolades } from "../accolades";

var manager = "Kevin";

export default function Kevin({}) {
  return (
    <Layout kevin>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetManagerTable manager={manager} />
        </div>
        <KevinAccolades />
      </div>
    </Layout>
  );
}
