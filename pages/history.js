import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";

export default function History({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>History - Game of Stones</title>
      </Head>
      <h1>
        <p>History</p>
      </h1>
      <a href={`/history/accolades`} className={homeStyles.link}>
        Accolades
        <br />
        <small className={utilStyles.lightText}>
          Manager achievements and awards from every season.
        </small>
      </a>
      <br />
      <a href={`/history/all_seasons`} className={homeStyles.link}>
        All Seasons
        <br />
        <small className={utilStyles.lightText}>
          Compilation of all Game of Stones seasons!
        </small>
      </a>
      <br />
      <a href={`/live`} className={homeStyles.link}>
        2025/2026 Season
        <br />
        <small className={utilStyles.lightText}>
          Season 4 of the Game of Stones!
        </small>
      </a>
      <a href={`/history/season_24_25`} className={homeStyles.link}>
        2024/2025 Season
        <br />
        <small className={utilStyles.lightText}>
          Season 3 of the Game of Stones!
        </small>
      </a>
      <a href={`/history/season_23_24`} className={homeStyles.link}>
        2023/2024 Season
        <br />
        <small className={utilStyles.lightText}>
          Season 2 of the Game of Stones!
        </small>
      </a>
      <a href={`/history/season_22_23`} className={homeStyles.link}>
        2022/2023 Season
        <br />
        <small className={utilStyles.lightText}>
          Season 1 of the Game of Stones!
        </small>
      </a>
      {/* <div>
        <JsonDataDisplay />
      </div> */}
    </div>
  );
}
