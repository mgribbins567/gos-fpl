import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import { GetManagerTable } from "../../../lib/history_util";
import { DarryanAccolades } from "../accolades";

var manager = "Darryan";

export default function Darryan({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <title>{manager} - Game of Stones</title>
      </Head>
      <h1>{manager}'s History</h1>
      <div>
        <GetManagerTable manager={manager} />
      </div>
      <DarryanAccolades />
    </div>
  );
}
