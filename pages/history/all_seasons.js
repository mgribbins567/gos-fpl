import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function AllSeasons({}) {
  return (
    <div className={utilStyles.main}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>All Seasons - Game of Stones</title>
      </Head>
      <h1>Combined Season Stats</h1>
      <Link href={`/history/season-1`}>Season 1 - 2022/2023</Link>
      <Link href={`/history/season-2`}>Season 2 - 2023/2024</Link>
      <Link href={`/history/season-3`}>Season 3 - 2024/2025</Link>
      <Link href={`/live`}>Season 4 - 2025/2026</Link>
      <h2>League Table (by Points)</h2>
      <div>
        <GetExtendedLeagueTable range="Table!A1:L25" />
      </div>
      <p>
        PPW (Points Per Week) is calculated by dividing PF (Points For) by the
        number of gameweeks played. PPG (Points Per Game) is calculated by
        dividing P (Points) by the number of gameweeks played.
      </p>
      <br></br>
      <h2>League Table Expanded</h2>
      <div>{/* <GetExtendedLeagueTable data={league_table_expanded} /> */}</div>
    </div>
  );
}
