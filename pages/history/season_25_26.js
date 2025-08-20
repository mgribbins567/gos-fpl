import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Layout from "../../components/layout";
import Link from "next/link";
import { GetExtendedLeagueTable } from "../../lib/history_util";

export default function Season_25_26({}) {
  return (
    <Layout history>
      <div className={utilStyles.main}>
        <Head>
          <title>Season 4 - Game of Stones</title>
        </Head>
        <h1>Season 4 - 2024/2025</h1>
        <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
        <br />
        <h2>League A Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH1:AR13" />
        </div>
        <br />
        <br />
        <br />
        {/* <button class="accordion">Section 1</button>
        <div class="panel">
          <p>Test words</p>
        </div>
        <button class="accordion">Section 2</button>
        <div class="panel">
          <p>More test words</p>
        </div>
        <br /> */}
        <h2>League B Table</h2>
        <div>
          <GetExtendedLeagueTable range="'League Tables'!AH14:AR26" />
        </div>
        <br />
        <h2>League A Prize Pool</h2>
        <p>Total Pot - $668</p>
        <ul>
          <li>1st - $334 + Jersey</li>
          <li>2nd - $200.40</li>
          <li>3rd - $133.60</li>
          <br />
          <li>Manager of the Month - $10</li>
          <li>Mid-Season Tournament - $30 + Mystery Kit</li>
        </ul>
        <h2>League B Prize Pool</h2>
        <p>Total Pot - $190</p>
        <ul>
          <li>1st - $95 + Jersey</li>
          <li>2nd - $57</li>
          <li>3rd - $38</li>
          <br />
          <li>Manager of the Month - $10</li>
          <li>Mid-Season Tournament - $30 + Mystery Kit</li>
        </ul>
      </div>
    </Layout>
  );
}
