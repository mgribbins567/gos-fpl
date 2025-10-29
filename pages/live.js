"use client";

import Head from "next/head";
import styles from "./LivePage.module.css";
import homeStyles from "../styles/Home.module.css";
import Link from "next/link";
import { Matchups } from "../lib/matchups";
import kickoffCupMatches from "../data/tournament_1_25_26.json";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { getManagerPlayerMap, getPlayerScoreMap } from "../lib/player_util";
import { LiveLeagueTable } from "../components/Live/LiveLeagueTable";
import { GetChampionsLeagueTable } from "../lib/history_util";
import { useLiveLeagueData } from "../hooks/useLiveLeagueData";
import { useRouter } from "next/router";
import { LiveFixtures } from "../components/Live/LiveFixtures";

function getTableData(
  gameweek,
  allAMatchups,
  allBMatchups,
  playerScoreMap,
  managerPlayerMap
) {
  const tableAData = useLiveLeagueData(
    gameweek,
    allAMatchups,
    playerScoreMap,
    managerPlayerMap
  );

  const tableBData = useLiveLeagueData(
    gameweek,
    allBMatchups,
    playerScoreMap,
    managerPlayerMap
  );

  return { tableAData, tableBData };
}

async function getLivePageStartData() {
  const urls = [
    "https://fantasy.premierleague.com/api/bootstrap-static/",
    "https://draft.premierleague.com/api/league/157/details",
    "https://draft.premierleague.com/api/league/461/details",
    "https://fantasy.premierleague.com/api/fixtures/",
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
  const [bootstrapData, matchupsAData, matchupsBData, fixtures] =
    await getLivePageStartData();
  console.timeEnd("Start data");

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true
  );

  const isFinished = currentGameweekObject.finished;

  const gameweek = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapData.events.find((event) => event.is_next === true)?.id || 1;

  console.time("new player score map");
  const playerScoreMap = await getPlayerScoreMap(gameweek, bootstrapData);
  console.timeEnd("new player score map");
  console.time("manager player map");
  const managerPlayerMap = await getManagerPlayerMap(gameweek);
  console.timeEnd("manager player map");

  const teams = {};
  const teamCodes = {};
  bootstrapData.teams.forEach((team) => {
    teams[team.id] = team.name;
    teamCodes[team.code] = team.name;
  });

  console.timeEnd("Full Live load time");

  return {
    props: {
      gameweek: gameweek,
      isFinished: isFinished,
      allAMatchups: matchupsAData,
      allBMatchups: matchupsBData,
      allCupMatchups: kickoffCupMatches,
      playerScoreMap: playerScoreMap,
      managerPlayerMap: managerPlayerMap,
      fixturesData: { fixtures, teams, teamCodes },
    },
  };
}

export default function Live({
  gameweek,
  isFinished,
  allAMatchups,
  allBMatchups,
  allCupMatchups,
  playerScoreMap,
  managerPlayerMap,
  fixturesData,
}) {
  const router = useRouter();
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

  const tableData = getTableData(
    gameweek,
    allAMatchups,
    allBMatchups,
    playerScoreMap,
    managerPlayerMap
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    await router.replace(router.asPath);
    setIsLoading(false);
  };

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
            isFinished={isFinished}
            allMatchups={allAMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            tableData={
              isFinished
                ? tableData.tableAData.liveTable
                : tableData.tableAData.startOfWeekTable
            }
            isCup={false}
            fixturesData={fixturesData}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable tableData={tableData.tableAData.liveTable} />
        </>
      )}
      {activeLeague === "leagueB" && (
        <>
          <Matchups
            gameweek={gameweek}
            isFinished={isFinished}
            allMatchups={allBMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            tableData={
              isFinished
                ? tableData.tableBData.liveTable
                : tableData.tableBData.startOfWeekTable
            }
            isCup={false}
            fixturesData={fixturesData}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable tableData={tableData.tableBData.liveTable} />
        </>
      )}
      {activeLeague === "cup" && (
        <>
          <Matchups
            gameweek={gameweek}
            isFinished={isFinished}
            allMatchups={allCupMatchups}
            playerScoreMap={playerScoreMap}
            managerPlayerMap={managerPlayerMap}
            tableData={tableData}
            isCup={true}
            fixturesData={fixturesData}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <GetChampionsLeagueTable range="'Champions League'!B3:L27" />
        </>
      )}
      <hr style={{ width: "100%" }} />
      <br />
      <LiveFixtures
        gameweek={gameweek}
        fixturesData={fixturesData}
        playerScoreMap={playerScoreMap}
      />
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
