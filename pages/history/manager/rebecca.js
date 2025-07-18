import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import { GetManagerTable } from "../../../lib/history_util";
import { RebeccaAccolades } from "../accolades";

var manager = "Rebecca";

export default function Rebecca({}) {
  return (
    <Layout rebecca>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetManagerTable manager={manager} />
        </div>
        <RebeccaAccolades />
      </div>
    </Layout>
  );
}
