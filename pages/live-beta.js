"use client";

import Head from "next/head";
import styles from "./LivePage.module.css";
import homeStyles from "../styles/Home.module.css";
import utilStyles from "../styles/utils.module.css";
import { useEffect, useState, startTransition } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { getBootstrapData, getLiveData } from "../api/fantasyService";
import { getLeagueDetails, getManagerPicks } from "../api/draftService";
import managersJson from "../data/managers.json";
import { MatchupCard } from "../components/Matchups/MatchupCard";
import { checkElementId } from "../lib/player_util";
import { LeagueTable } from "../components/League/LeagueTable";

function buildHeadToHeadMatchups(matches, leagueData, gameweek) {
  const fixtures = matches.filter((match) => match.event === gameweek);

  return fixtures.map((fixture) => {
    const team1 = leagueData.find(
      (manager) => manager.fetch_id === fixture.league_entry_1.toString(),
    );
    const team2 = leagueData.find(
      (manager) =>
        manager.fetch_id.toString() === fixture.league_entry_2.toString(),
    );

    return {
      matchId: fixture.id,
      team1,
      team2,
    };
  });
}

function liveTeams(picks, staticPlayers, liveData) {
  if (!picks) {
    return;
  }
  return picks.map((pick) => {
    const playerId = checkElementId(pick.element);

    const staticPlayerInfo = staticPlayers[playerId];
    const livePlayerInfo = liveData[playerId] || {
      total_points: 0,
      minutes: 0,
    };

    return {
      id: playerId,
      name: staticPlayerInfo.web_name,
      teamId: staticPlayerInfo.team,
      teamCode: staticPlayerInfo.team_code,
      position: staticPlayerInfo.element_type,
      status: staticPlayerInfo.status,
      isStarter: pick.position <= 11,
      benchOrder: pick.position > 11 ? pick.position - 11 : null,
      points: livePlayerInfo.total_points,
      liveDetails: livePlayerInfo,
    };
  });
}

function processLeagueMatchups(managerPicks, staticPlayers, liveData) {
  return managerPicks.map((manager) => {
    const processedTeam = liveTeams(manager.picks, staticPlayers, liveData);

    const liveScore = processedTeam
      ? processedTeam
          .filter((player) => player.isStarter)
          .reduce((sum, player) => sum + player.points, 0)
      : 0;

    return {
      ...manager,
      teamDetails: processedTeam,
      totalPoints: liveScore,
    };
  });
}

async function getData(players, managerPicks, liveData) {
  const normalizeData = (array, key = "id") => {
    return array.reduce((acc, item) => {
      acc[item[key]] = item;
      return acc;
    }, {});
  };

  const normalizeLiveData = (liveElementsArray) => {
    return liveElementsArray.reduce((acc, playerLive) => {
      const playerInfo = {
        ...playerLive.stats,
        explain: { ...playerLive.explain },
      };
      acc[playerLive.id] = playerInfo;
      return acc;
    }, {});
  };

  const playerData = normalizeLiveData(liveData.elements);

  const processedData = processLeagueMatchups(
    managerPicks,
    normalizeData(players),
    playerData,
  );
  return processedData;
}

async function getInitialData(players, gameweek, managers) {
  const liveData = await getLiveData(gameweek);
  const managerPicks = await getManagerPicks(managers, gameweek);
  return getData(players, managerPicks, liveData);
}

async function getUpdatedData(players, gameweek) {
  const liveDataRes = await fetch(`/api/fpl/live/${gameweek}`);
  const liveData = await liveDataRes.json();

  const managerPicksRes = await fetch(`/api/fpl/entries/${gameweek}`);
  if (!managerPicksRes.ok) {
    throw new Error(`Failed to fetch manager picks for gameweek ${gameweek}`);
  }
  const managerPicks = await managerPicksRes.json();
  return getData(players, managerPicks, liveData);
}

/**
 * Loads all static server side data for the Live Page
 *
 * @returns props to Live page
 */
export async function getServerSideProps() {
  console.time("Full Live load time");

  const bootstrapStatic = await getBootstrapData();

  const currentGameweekObject = bootstrapStatic.events.find(
    (event) => event.is_current === true,
  );

  const isFinished = currentGameweekObject.finished;

  const gameweek = currentGameweekObject
    ? currentGameweekObject.id
    : bootstrapStatic.events.find((event) => event.is_next === true)?.id || 1;

  console.time("New score map");
  const managers = Object.entries(managersJson).map(([key, managerData]) => {
    return {
      ...managerData,
      fetch_id: key,
    };
  });
  const initialLeagueData = await getInitialData(
    bootstrapStatic.elements,
    gameweek,
    managers,
  );
  console.timeEnd("New score map");

  console.time("Get league details");
  const leagueADetails = await getLeagueDetails(157);
  const leagueBDetails = await getLeagueDetails(461);
  console.timeEnd("Get league details");

  console.timeEnd("Full Live load time");

  return {
    props: {
      initialGw: gameweek,
      initialLeagueData,
      leagueADetails,
      leagueBDetails,
      bootstrapStatic,
      managers,
    },
  };
}

function HeadToHeadMatchups({ matchups, allMatches }) {
  return matchups.map((match) => {
    var team1Details = [];
    var team2Details = [];
    if (match.team1.teamDetails && match.team2.teamDetails) {
      team1Details = match.team1.teamDetails.map((p) => ({
        id: p.id,
        name: p.name,
        team: p.teamCode,
        position: p.position,
        status: p.status,
        subText: p.liveDetails.minutes + "'",
        additionalDetails: p.liveDetails,
        value: p.points,
      }));
      team2Details = match.team2.teamDetails.map((p) => ({
        id: p.id,
        name: p.name,
        team: p.teamCode,
        position: p.position,
        status: p.status,
        subText: p.liveDetails.minutes + "'",
        additionalDetails: p.liveDetails,
        value: p.points,
      }));
    }
    return (
      <MatchupCard
        team1={match.team1.name}
        team2={match.team2.name}
        score1={match.team1.totalPoints}
        score2={match.team2.totalPoints}
        team1Details={team1Details}
        team2Details={team2Details}
        matchups={allMatches}
      />
    );
  });
}

/**
 * Live page
 * @param gameweek Current gameweek
 * @param isFinished If the current gameweek is finished or not
 * @param allAMatchups All League A matchups
 * @param allBMatchups All League B matchups
 */
export default function Live({
  initialGw,
  initialLeagueData,
  leagueADetails,
  leagueBDetails,
  bootstrapStatic,
  managers,
}) {
  const router = useRouter();
  const [activeLeague, setActiveLeague] = useState("leagueA");
  const [activeGameweek, setActiveGameweek] = useState(initialGw);
  const [isFetching, setIsFetching] = useState(false);

  const [gameweekCache, setGameweekCache] = useState({
    [initialGw]: initialLeagueData,
  });

  useEffect(() => {
    if (gameweekCache[activeGameweek]) {
      return;
    }

    const fetchGameweekData = async () => {
      setIsFetching(true);
      try {
        const data = await getUpdatedData(
          bootstrapStatic.elements,
          activeGameweek,
        );

        setGameweekCache((prevCache) => ({
          ...prevCache,
          [activeGameweek]: data,
        }));
      } catch (error) {
        console.error("Error fetching gameweek data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchGameweekData();
  }, [activeGameweek, bootstrapStatic]);

  useEffect(() => {
    let isMounted = true;

    const prefetchGameweeks = async () => {
      const queue = [];
      let pastGw = initialGw - 1;
      let futureGw = initialGw + 1;

      while (pastGw >= 1 || futureGw <= 38) {
        if (pastGw >= 1) {
          queue.push(pastGw);
          pastGw--;
        }
        if (futureGw <= 38) {
          queue.push(futureGw);
          futureGw++;
        }
      }

      for (const gw of queue) {
        if (!isMounted) {
          break;
        }

        if (gameweekCache[gw]) {
          continue;
        }

        const data = await getUpdatedData(bootstrapStatic.elements, gw);

        if (data && isMounted) {
          setGameweekCache((prevCache) => ({ ...prevCache, [gw]: data }));

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    };

    const startTimeout = setTimeout(() => {
      prefetchGameweeks();
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
    };
  }, [initialGw]);

  const displayData = gameweekCache[activeGameweek];

  const matches =
    activeLeague === "leagueA"
      ? leagueADetails.matches
      : leagueBDetails.matches;
  const headToHeadMatchups = displayData
    ? buildHeadToHeadMatchups(matches, displayData, activeGameweek)
    : [];

  useEffect(() => {
    const savedLeague = localStorage.getItem("activeLeague");
    if (savedLeague) {
      setActiveLeague(savedLeague);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeLeague", activeLeague);
  }, [activeLeague]);

  const handleRefresh = async () => {
    setIsFetching(true);
    try {
      const data = await getUpdatedData(
        bootstrapStatic.elements,
        activeGameweek,
      );

      setGameweekCache((prevCache) => ({
        ...prevCache,
        [activeGameweek]: data,
      }));
    } catch (error) {
      console.error("Error fetching gameweek data:", error);
    } finally {
      setIsFetching(false);
    }
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
      </div>
      <button
        onClick={handleRefresh}
        disabled={isFetching}
        className={styles.refreshButton}
      >
        {isFetching ? "..." : " ⟳"}
      </button>
      <div className={styles.gameweekHeader}>
        <button
          onClick={() =>
            startTransition(() => setActiveGameweek((gw) => gw - 1))
          }
          disabled={activeGameweek === 1}
          className={utilStyles.gameweekButton}
        >
          &larr; Prev
        </button>
        <h3>Gameweek {activeGameweek}</h3>
        <button
          onClick={() =>
            startTransition(() => setActiveGameweek((gw) => gw + 1))
          }
          disabled={activeGameweek === 38}
          className={utilStyles.gameweekButton}
        >
          Next &rarr;
        </button>
      </div>
      {activeLeague === "leagueA" && (
        <div className={styles.liveBeta}>
          <HeadToHeadMatchups
            matchups={headToHeadMatchups}
            allMatches={leagueADetails.matches}
          />
          <LeagueTable leagueId={157} liveMatchups={headToHeadMatchups} />
        </div>
      )}
      {activeLeague === "leagueB" && (
        <div className={styles.liveBeta}>
          <HeadToHeadMatchups
            matchups={headToHeadMatchups}
            allMatches={leagueBDetails.matches}
          />
          <LeagueTable leagueId={461} liveMatchups={headToHeadMatchups} />
        </div>
      )}
    </div>
  );
}
