"use client";

import Head from "next/head";
import styles from "./LivePage.module.css";
import homeStyles from "../styles/Home.module.css";
import Link from "next/link";
import { Matchups } from "../lib/matchups";
import kickoffCupMatches from "../data/tournament_1_25_26.json";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { getManagerPlayerMap, getPlayerScoreMap } from "../lib/player_util";
import { LiveLeagueTable } from "../components/LiveLeagueTable";
import { GetChampionsLeagueTable } from "../lib/history_util";

async function getLivePageStartData() {
  const urls = [
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    "https://draft.premierleague.com/api/league/157/details",
    "https://draft.premierleague.com/api/league/461/details",
  ];

  const fetchPromises = urls.map((url) => fetch(url));

  return await Promise.all(fetchPromises)
    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()));
    })
    .catch((error) => {
      console.error("Error fetching bootstrap data or league details:", error);
    });
}

export async function getServerSideProps() {
  console.time("Full Live load time");

  console.time("Start data");
  const [bootstrapData, matchupsAData, matchupsBData] =
    await getLivePageStartData();
  console.timeEnd("Start data");

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true
  );

  const gameweek = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapData.events.find((event) => event.is_next === true)?.id || 1;

  console.time("new player score map");
  const newPlayerScoreMap = await getPlayerScoreMap(gameweek, bootstrapData);
  console.timeEnd("new player score map");
  console.time("manager player map");
  const managerPlayerMap = await getManagerPlayerMap(gameweek);
  console.timeEnd("manager player map");

  console.timeEnd("Full Live load time");

  return {
    props: {
      gameweek: gameweek,
      allAMatchups: matchupsAData,
      allBMatchups: matchupsBData,
      allCupMatchups: kickoffCupMatches,
      playerScoreMap: newPlayerScoreMap,
      managerPlayerMap: managerPlayerMap,
    },
  };
}

export default function Live({
  gameweek,
  allAMatchups,
  allBMatchups,
  allCupMatchups,
  playerScoreMap,
  managerPlayerMap,
}) {
  const [activeLeague, setActiveLeague] = useState("leagueA");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLeague = localStorage.getItem("activeLeague");
    if (savedLeague) {
      setActiveLeague(savedLeague);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeLeague", activeLeague);
  }, [activeLeague]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setIsLoading(false);
  }, [activeLeague]);

  return (
    <div className={homeStyles.home}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Season 4 - Game of Stones</title>
      </Head>
      <h2>Game of Stones Season 4</h2>
      <hr style={{ width: "100%" }} />
      <div className={styles.tabContainer}>
        <button
          className={clsx(styles.tabButton, {
            [styles.active]: activeLeague === "leagueA",
          })}
          onClick={() => setActiveLeague("leagueA")}
        >
          League A
        </button>
        <button
          className={clsx(styles.tabButton, {
            [styles.active]: activeLeague === "leagueB",
          })}
          onClick={() => setActiveLeague("leagueB")}
        >
          League B
        </button>
        <button
          className={clsx(styles.tabButton, {
            [styles.active]: activeLeague === "cup",
          })}
          onClick={() => setActiveLeague("cup")}
        >
          Cup
        </button>
      </div>
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className={styles.refreshButton}
      >
        {isLoading ? "..." : " ⟳"}
      </button>
      {activeLeague === "leagueA" && (
        <>
          <Matchups
            gameweek={gameweek}
            allMatchups={allAMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            isCup={false}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable
            gameweek={gameweek}
            allMatchups={allAMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
          />
        </>
      )}
      {activeLeague === "leagueB" && (
        <>
          <Matchups
            gameweek={gameweek}
            allMatchups={allBMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            isCup={false}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable
            gameweek={gameweek}
            allMatchups={allBMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
          />
        </>
      )}
      {activeLeague === "cup" && (
        <>
          <Matchups
            gameweek={gameweek}
            allMatchups={allCupMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            isCup={true}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <GetChampionsLeagueTable range="'Champions League'!B3:L27" />
        </>
      )}
      <br />
      <hr style={{ width: "100%" }} />
      <br />
      <h2>League A Prize Pool</h2>
      <p>Total Pot - $728</p>
      <ul>
        <li>1st - $364 + Jersey</li>
        <li>2nd - $218.40</li>
        <li>3rd - $145.60</li>
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
      <hr style={{ width: "100%" }} />
      <Link href={`/history/season_22_23`}>Season 1 - 2022/2023</Link>
      <Link href={`/history/season_23_24`}>Season 2 - 2023/2024</Link>
      <Link href={`/history/season_24_25`}>Season 3 - 2024/2025</Link>
      <Link href={`/history/all_seasons`}>All Seasons</Link>
    </div>
  );
}
