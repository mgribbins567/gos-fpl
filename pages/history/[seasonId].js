import React, { useState } from "react";
import { useRouter } from "next/router";
import { LeagueTable } from "../../components/History/LeagueTable";
import styles from "../history/History.module.css";
import { MatchupBrowser } from "../../components/History/MatchupBrowser";
import { getArchivedSeasonData } from "../../lib/dataService";
import homeStyles from "../../styles/Home.module.css";

export async function getStaticPaths() {
  const paths = [
    { params: { seasonId: "season-1" } },
    { params: { seasonId: "season-2" } },
    { params: { seasonId: "season-3" } },
  ];
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const seasonId = params.seasonId;

  try {
    const data = await getArchivedSeasonData(seasonId);
    return {
      props: {
        seasonData: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (error) {
    console.log("Error fetching season data:", error, error.message);
    return { notFound: true };
  }
}

export default function HistoryPage({ seasonData }) {
  return (
    <div className={homeStyles.home}>
      <header className={styles.historyHeader}>
        <div className={styles.historyHeaderTitle}>
          <a
            href={
              `/history/season-` +
              (parseInt(seasonData.id[seasonData.id.length - 1]) - 1)
            }
          >
            <button
              disabled={seasonData.id === "season-1"}
              className={styles.historyHeaderButton}
            >
              &larr; Prev
            </button>
          </a>
          <h1>
            {(
              seasonData.id.charAt(0).toUpperCase() + seasonData.id.slice(1)
            ).replace("-", " ")}
          </h1>
          <a
            href={
              `/history/season-` +
              (parseInt(seasonData.id[seasonData.id.length - 1]) + 1)
            }
          >
            <button
              disabled={seasonData.id === "season-3"}
              className={styles.historyHeaderButton}
            >
              Next &rarr;
            </button>
          </a>
        </div>
        <h3>
          {seasonData.year}/{seasonData.year + 1}
        </h3>
      </header>

      <LeagueTable seasonData={seasonData} />
      <MatchupBrowser gameweeks={seasonData.Gameweek} />
    </div>
  );
}
