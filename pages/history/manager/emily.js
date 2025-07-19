import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import Layout from "../../../components/layout";
import { GetManagerTable } from "../../../lib/history_util";
import { EmilyAccolades } from "../accolades";

var manager = "Emily";

export default function Emily({}) {
  return (
    <Layout emily>
      <div className={utilStyles.main}>
        <Head>
          <title>{manager} - Game of Stones</title>
        </Head>
        <h1>{manager}'s History</h1>
        <div>
          <GetManagerTable manager={manager} />
        </div>
        <EmilyAccolades />
      </div>
    </Layout>
  );
}
