"use client";

import Head from "next/head";
import styles from "./LivePage.module.css";
import homeStyles from "../styles/Home.module.css";
import Link from "next/link";
import { Matchups } from "../lib/matchups";
import managers from "../data/managers.json";
import kickoffCupMatches from "../data/tournament_1_25_26.json";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  calculateDraftManagerScore,
  getLeagueDetails,
} from "../api/draftService";
import { getLiveData, getBootstrapData } from "../api/fantasyService";
import { getPlayerScoreMap } from "../lib/player_util";
import { LiveLeagueTable } from "../components/LiveLeagueTable";

async function getProcessedMatchups(matchups, playerScoreMap, gameweekId) {
  const processedMatchups = await Promise.all(
    matchups.map(async (match) => {
      const manager1Id = match.league_entry_1;
      const manager2Id = match.league_entry_2;

      const team1Data = await calculateDraftManagerScore(
        managers[manager1Id].entry_id,
        gameweekId,
        playerScoreMap
      );
      const team2Data = await calculateDraftManagerScore(
        managers[manager2Id].entry_id,
        gameweekId,
        playerScoreMap
      );

      const matchId = gameweekId + "-" + manager1Id + "-" + manager2Id;

      return {
        id: matchId,
        gameweek: gameweekId,
        manager1: {
          id: manager1Id,
          managerName: managers[manager1Id].name,
          liveScore: team1Data.totalScore,
          team: team1Data.team,
        },
        manager2: {
          id: manager2Id,
          managerName: managers[manager2Id].name,
          liveScore: team2Data.totalScore,
          team: team2Data.team,
        },
      };
    })
  );
  return processedMatchups;
}

export async function getServerSideProps() {
  const LEAGUE_A_ID = 157;
  const LEAGUE_B_ID = 461;

  const bootstrapData = await getBootstrapData();

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true
  );

  const gameweekId = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapData.events.find((event) => event.is_next === true)?.id || 1;

  const liveData = await getLiveData(gameweekId);
  const playerScoreMap = getPlayerScoreMap(liveData, bootstrapData);

  const matchupsAData = await getLeagueDetails(LEAGUE_A_ID);
  const matchupsBData = await getLeagueDetails(LEAGUE_B_ID);

  const currentWeekAMatches = matchupsAData.matches.filter(
    (match) => match.event === gameweekId
  );

  const currentWeekBMatches = matchupsBData.matches.filter(
    (match) => match.event === gameweekId
  );

  const currentCupMatchups = kickoffCupMatches.matches.filter(
    (match) => match.event === gameweekId
  );

  const liveAMatchups = await getProcessedMatchups(
    currentWeekAMatches,
    playerScoreMap,
    gameweekId
  );
  const liveBMatchups = await getProcessedMatchups(
    currentWeekBMatches,
    playerScoreMap,
    gameweekId
  );

  const liveCupMatchups = await getProcessedMatchups(
    currentCupMatchups,
    playerScoreMap,
    gameweekId
  );

  return {
    props: {
      allAMatchups: matchupsAData,
      liveAMatchups: liveAMatchups,
      allBMatchups: matchupsBData,
      liveBMatchups: liveBMatchups,
      allCupMatchups: kickoffCupMatches,
      liveCupMatchups: liveCupMatchups,
      gameweekId: gameweekId,
    },
  };
}

export default function Live({
  allAMatchups,
  liveAMatchups,
  allBMatchups,
  liveBMatchups,
  allCupMatchups,
  liveCupMatchups,
  gameweekId,
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
    await new Promise((res) => setTimeout(res, 1000));
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
            allMatchups={allAMatchups}
            processedMatchups={liveAMatchups}
            gameweekId={gameweekId}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable
            currentGameweek={gameweekId}
            allScores={allAMatchups}
            liveScores={liveAMatchups}
          />
        </>
      )}
      {activeLeague === "leagueB" && (
        <>
          <Matchups
            allMatchups={allBMatchups}
            processedMatchups={liveBMatchups}
            gameweekId={gameweekId}
          />
          <hr style={{ width: "100%" }} />
          <br />
          <LiveLeagueTable
            currentGameweek={gameweekId}
            allScores={allBMatchups}
            liveScores={liveBMatchups}
          />
        </>
      )}
      {activeLeague === "cup" && (
        <>
          <Matchups
            allMatchups={allCupMatchups}
            processedMatchups={liveCupMatchups}
            gameweekId={gameweekId}
          />
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
