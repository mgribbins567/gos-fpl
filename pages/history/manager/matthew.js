import React from "react";
import Head from "next/head";
import utilStyles from "../../../styles/utils.module.css";
import { GetManagerTable } from "../../../lib/history_util";
import { MatthewAccolades } from "../accolades";

var manager = "Matthew";

export default function Matthew({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <title>Matthew - Game of Stones</title>
      </Head>
      <h1>{manager}'s History</h1>
      <div>
        <GetManagerTable manager={manager} />
      </div>
      <MatthewAccolades />
    </div>
  );
}
