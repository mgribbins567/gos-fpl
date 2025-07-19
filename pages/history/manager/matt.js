import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import { GetManagerTable } from "../../../lib/history_util";
import { MattAccolades } from "../accolades";

var manager = "Matt";

export default function Matt({}) {
  return (
    <Layout matt>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetManagerTable manager={manager} />
        </div>
        <MattAccolades />
      </div>
    </Layout>
  );
}
