import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import { GetManagerTable } from "../../../lib/history_util";
import { DylanAccolades } from "../accolades";

var manager = "Dylan";

export default function Dylan({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <title>{manager} - Game of Stones</title>
      </Head>
      <h1>{manager}'s History</h1>
      <div>
        <GetManagerTable manager={manager} />
      </div>
      <DylanAccolades />
    </div>
  );
}
