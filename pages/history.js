import React from "react";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";

export default function History({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <title>History - Game of Stones</title>
      </Head>
      <h1>History of the Game of Stones</h1>
      <ul className={homeStyles.postList}>
        <li className={homeStyles.postListItem}>
          <Link href={`/history/accolades`}>Accolades</Link>
          <br />
          <small className={utilStyles.lightText}>
            Manager achievements and awards from every season.
          </small>
        </li>
        <li className={homeStyles.postListItem}>
          <Link href={`/history/all_seasons`}>All Seasons</Link>
          <br />
          <small className={utilStyles.lightText}>
            Compilation of all Game of Stones seasons!
          </small>
        </li>
        <li className={homeStyles.postListItem}>
          <Link href={`/season-4`}>2025/2026 Season</Link>
          <br />
          <small className={utilStyles.lightText}>
            Season 4 of the Game of Stones!
          </small>
        </li>
        <li className={homeStyles.postListItem}>
          <Link href={`/history/season_24_25`}>2024/2025 Season</Link>
          <br />
          <small className={utilStyles.lightText}>
            Season 3 of the Game of Stones!
          </small>
        </li>
        <li className={homeStyles.postListItem}>
          <Link href={`/history/season_23_24`}>2023/2024 Season</Link>
          <br />
          <small className={utilStyles.lightText}>
            Season 2 of the Game of Stones!
          </small>
        </li>
        <li className={homeStyles.postListItem}>
          <Link href={`/history/season_22_23`}>2022/2023 Season</Link>
          <br />
          <small className={utilStyles.lightText}>
            Season 1 of the Game of Stones!
          </small>
        </li>
      </ul>
      {/* <div>
        <JsonDataDisplay />
      </div> */}
    </div>
  );
}
