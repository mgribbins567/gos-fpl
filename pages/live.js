"use client";

import Head from "next/head";
import styles from "./LivePage.module.css";
import homeStyles from "../styles/Home.module.css";
import Link from "next/link";
import { Matchups } from "../lib/matchups";
import kickoffCupMatches from "../data/tournament_1_25_26.json";
import boxingDayBashAMatches from "../data/tournament_2_a_25_26.json";
import boxingDayBashBMatches from "../data/tournament_2_b_25_26.json";
import championsCupMatches from "../data/tournament_3_25_26.json";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { getManagerPlayerMap, getPlayerScoreMap } from "../lib/player_util";
import { LiveLeagueTable } from "../components/Live/LiveLeagueTable";
import { GetChampionsLeagueTable } from "../lib/history_util";
import { useLiveLeagueData } from "../hooks/useLiveLeagueData";
import { useRouter } from "next/router";
import { LiveFixtures } from "../components/Live/LiveFixtures";
import LiveDataContext from "../contexts/LiveDataContext";
import {
  THE_LEAGUE_CONFIG,
  BOXING_DAY_BASH_CONFIG,
  CHAMPIONS_CUP_CONFIG,
} from "../data/cupConfigs";

/**
 * Get all league tables
 * @param {*} gameweek current gameweek
 * @param {*} allAMatchups all League A matchups
 * @param {*} allBMatchups all League B matchups
 * @param {*} playerScoreMap map of all players -> their scores
 * @param {*} managerPlayerMap map of all players -> their owner
 * @returns {*} an array of all table data
 */
// TODO: Clean up this function
function getAllTables(
  gameweek,
  allAMatchups,
  allBMatchups,
  playerScoreMap,
  managerPlayerMap,
) {
  Object.filter = function (obj, predicate) {
    let result = [],
      key;

    for (key in obj) {
      if (obj.hasOwnProperty(key) && predicate(obj[key])) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  const tableAData = useLiveLeagueData(
    gameweek,
    allAMatchups,
    playerScoreMap,
    managerPlayerMap,
  );

  const tableBData = useLiveLeagueData(
    gameweek,
    allBMatchups,
    playerScoreMap,
    managerPlayerMap,
  );

  const LeagueABBCupTableAData = useLiveLeagueData(
    gameweek,
    {
      league_entries: allAMatchups.league_entries,
      matches: Object.filter(boxingDayBashAMatches.matches, (val) => {
        return val.group === "a";
      }),
    },
    playerScoreMap,
    managerPlayerMap,
  );
  const LeagueABBCupTableBData = useLiveLeagueData(
    gameweek,
    {
      league_entries: allAMatchups.league_entries,
      matches: Object.filter(boxingDayBashAMatches.matches, (val) => {
        return val.group === "b";
      }),
    },
    playerScoreMap,
    managerPlayerMap,
  );
  const LeagueBBBCupTableAData = useLiveLeagueData(
    gameweek,
    {
      league_entries: allBMatchups.league_entries,
      matches: Object.filter(boxingDayBashBMatches.matches, (val) => {
        return val.group === "a";
      }),
    },
    playerScoreMap,
    managerPlayerMap,
  );
  const LeagueBBBCupTableBData = useLiveLeagueData(
    gameweek,
    {
      league_entries: allBMatchups.league_entries,
      matches: Object.filter(boxingDayBashBMatches.matches, (val) => {
        return val.group === "b";
      }),
    },
    playerScoreMap,
    managerPlayerMap,
  );

  // const ChampionsCupGroupAData = useLiveLeagueData(
  //   gameweek,
  //   {
  //     league_entries: allBMatchups.league_entries,
  //     matches: Object.filter(championsCupMatches.matches, (val) => {
  //       return val.group === "a";
  //     }),
  //   },
  //   playerScoreMap,
  //   managerPlayerMap,
  // );
  // const ChampionsCupGroupBData = useLiveLeagueData(
  //   gameweek,
  //   {
  //     league_entries: allBMatchups.league_entries,
  //     matches: Object.filter(championsCupMatches.matches, (val) => {
  //       return val.group === "b";
  //     }),
  //   },
  //   playerScoreMap,
  //   managerPlayerMap,
  // );
  // const ChampionsCupGroupCData = useLiveLeagueData(
  //   gameweek,
  //   {
  //     league_entries: allBMatchups.league_entries,
  //     matches: Object.filter(championsCupMatches.matches, (val) => {
  //       return val.group === "c";
  //     }),
  //   },
  //   playerScoreMap,
  //   managerPlayerMap,
  // );
  // const ChampionsCupGroupDData = useLiveLeagueData(
  //   gameweek,
  //   {
  //     league_entries: allBMatchups.league_entries,
  //     matches: Object.filter(championsCupMatches.matches, (val) => {
  //       return val.group === "d";
  //     }),
  //   },
  //   playerScoreMap,
  //   managerPlayerMap,
  // );

  return [
    tableAData,
    tableBData,
    LeagueABBCupTableAData,
    LeagueABBCupTableBData,
    LeagueBBBCupTableAData,
    LeagueBBBCupTableBData,
  ];
}

/**
 * Makes the Live Page API calls to the following endpoints:
 * fantasy.premierleague.com/api/bootstrap-static/
 * draft.premierleague.com/api/league/157/details
 * draft.premierleague.com/api/league/461/details
 * fantasy.premierleague.com/api/fixtures/
 *
 * @returns an array of the API data
 */
async function getLivePageStartData() {
  const bootstrapUrl =
    "https://fantasy.premierleague.com/api/bootstrap-static/";
  const leagueAUrl = "https://draft.premierleague.com/api/league/157/details";
  const leagueBUrl = "https://draft.premierleague.com/api/league/461/details";
  const fixturesUrl = "https://fantasy.premierleague.com/api/fixtures/";

  return await Promise.all([
    fetch(bootstrapUrl).catch((error) => {
      throw { url: bootstrapUrl, error: error };
    }),
    fetch(leagueAUrl).catch((error) => {
      throw { url: leagueAUrl, error: error };
    }),
    fetch(leagueBUrl).catch((error) => {
      throw { url: leagueBUrl, error: error };
    }),
    fetch(fixturesUrl).catch((error) => {
      throw { url: fixturesUrl, error: error };
    }),
  ])
    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()));
    })
    .catch((err) => {
      console.error(
        "Error fetching live page start data from url: ",
        url,
        " error: ",
        err,
      );
    });
}

/**
 * Loads all static server side data for the Live Page
 *
 * @returns props to Live page
 */
export async function getServerSideProps() {
  console.time("Full Live load time");

  console.time("Start data");
  const [bootstrapData, matchupsAData, matchupsBData, fixtures] =
    await getLivePageStartData();
  console.timeEnd("Start data");

  const currentGameweekObject = bootstrapData.events.find(
    (event) => event.is_current === true,
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
  const teamCodesToId = {};
  bootstrapData.teams.forEach((team) => {
    const teamData = { name: team.name, short_name: team.short_name };
    teams[team.id] = teamData;
    teamCodes[team.code] = teamData;
    teamCodesToId[team.code] = team.id;
  });

  console.timeEnd("Full Live load time");

  const liveData = {
    playerScoreMap: playerScoreMap,
    managerPlayerMap: managerPlayerMap,
    fixturesData: { fixtures, teams, teamCodes, teamCodesToId },
  };

  return {
    props: {
      gameweek: gameweek,
      isFinished: isFinished,
      allAMatchups: matchupsAData,
      allBMatchups: matchupsBData,
      liveData: liveData,
    },
  };
}

/**
 * Live page
 * @param gameweek Current gameweek
 * @param isFinished If the current gameweek is finished or not
 * @param allAMatchups All League A matchups
 * @param allBMatchups All League B matchups
 */
export default function Live({
  gameweek,
  isFinished,
  allAMatchups,
  allBMatchups,
  liveData,
}) {
  const router = useRouter();
  const [activeLeague, setActiveLeague] = useState("leagueA");
  const [isLoading, setIsLoading] = useState(false);
  const [isLeagueABBCupOpen, setIsLeagueABBCupOpen] = useState(false);
  const [isLeagueBBBCupOpen, setIsLeagueBBBCupOpen] = useState(false);
  const [isChampionsCupOpen, setIsChampionsCupOpen] = useState(true);

  useEffect(() => {
    const savedLeague = localStorage.getItem("activeLeague");
    if (savedLeague) {
      setActiveLeague(savedLeague);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeLeague", activeLeague);
  }, [activeLeague]);

  const [
    tableAData,
    tableBData,
    LeagueABBCupTableAData,
    LeagueABBCupTableBData,
    LeagueBBBCupTableAData,
    LeagueBBBCupTableBData,
  ] = getAllTables(
    gameweek,
    allAMatchups,
    allBMatchups,
    liveData.playerScoreMap,
    liveData.managerPlayerMap,
  );

  const tableData = { tableAData, tableBData };

  const handleRefresh = async () => {
    setIsLoading(true);
    await router.replace(router.asPath);
    setIsLoading(false);
  };

  return (
    // TODO: Undo the LiveDataContext change. I think it might be better to just pass this via props
    // TODO: Clean up this function. We can refactor and call separate functions using LeagueData as a prop
    <LiveDataContext.Provider value={liveData}>
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
              otherMatchups={allBMatchups}
              tableData={
                isFinished ? tableAData.liveTable : tableAData.startOfWeekTable
              }
              cupData={null}
            />
            <h3>League Table</h3>
            <LiveLeagueTable tableData={tableAData.liveTable} />
            <br />
            <hr style={{ width: "100%" }} />
            <br />
            <div className={styles.tabContainer}>
              <button
                onClick={() => setIsLeagueABBCupOpen(!isLeagueABBCupOpen)}
                className={clsx(styles.tabButton, {
                  [styles.active]: isLeagueABBCupOpen,
                })}
              >
                Boxing Day Bash
                <span>{isLeagueABBCupOpen ? " ▲" : " ▼"}</span>
              </button>
            </div>
            {isLeagueABBCupOpen && (
              <div className={styles.cupInfoContainer}>
                <Matchups
                  gameweek={gameweek}
                  isFinished={isFinished}
                  allMatchups={boxingDayBashAMatches}
                  tableData={
                    isFinished
                      ? tableAData.liveTable
                      : tableAData.startOfWeekTable
                  }
                  cupData={BOXING_DAY_BASH_CONFIG}
                />
                <h3>Group A</h3>
                <LiveLeagueTable tableData={LeagueABBCupTableAData.liveTable} />
                <br />
                <h3>Group B</h3>
                <LiveLeagueTable tableData={LeagueABBCupTableBData.liveTable} />
                <br />
              </div>
            )}
          </>
        )}
        {activeLeague === "leagueB" && (
          <>
            <Matchups
              gameweek={gameweek}
              isFinished={isFinished}
              allMatchups={allBMatchups}
              otherMatchups={allAMatchups}
              tableData={
                isFinished ? tableBData.liveTable : tableBData.startOfWeekTable
              }
              cupData={null}
            />
            <h3>League Table</h3>
            <LiveLeagueTable tableData={tableBData.liveTable} />
            <br />
            <hr style={{ width: "100%" }} />
            <br />
            <div className={styles.tabContainer}>
              <button
                onClick={() => setIsLeagueBBBCupOpen(!isLeagueBBBCupOpen)}
                className={clsx(styles.tabButton, {
                  [styles.active]: isLeagueBBBCupOpen,
                })}
              >
                Boxing Day Bash
                <span>{isLeagueBBBCupOpen ? " ▲" : " ▼"}</span>
              </button>
            </div>
            {isLeagueBBBCupOpen && (
              <div className={styles.cupInfoContainer}>
                <Matchups
                  gameweek={gameweek}
                  isFinished={isFinished}
                  allMatchups={boxingDayBashBMatches}
                  tableData={
                    isFinished
                      ? tableBData.liveTable
                      : tableBData.startOfWeekTable
                  }
                  cupData={BOXING_DAY_BASH_CONFIG}
                />
                <h3>Group A</h3>
                <LiveLeagueTable tableData={LeagueBBBCupTableAData.liveTable} />
                <br />
                <h3>Group B</h3>
                <LiveLeagueTable tableData={LeagueBBBCupTableBData.liveTable} />
                <br />
              </div>
            )}
          </>
        )}
        {activeLeague === "cup" && (
          <>
            <Matchups
              gameweek={gameweek}
              isFinished={isFinished}
              allMatchups={kickoffCupMatches}
              tableData={tableData}
              cupData={THE_LEAGUE_CONFIG}
            />
            <hr style={{ width: "100%" }} />
            <br />
            <GetChampionsLeagueTable range="'Champions League'!B3:L27" />
          </>
        )}
        <hr style={{ width: "100%" }} />
        <br />
        <div className={styles.tabContainer}>
          <button
            onClick={() => setIsChampionsCupOpen(!isChampionsCupOpen)}
            className={clsx(styles.tabButton, {
              [styles.active]: isChampionsCupOpen,
            })}
          >
            Champions Cup
            <span>{isChampionsCupOpen ? " ▲" : " ▼"}</span>
          </button>
        </div>
        {isChampionsCupOpen && (
          <div className={styles.cupInfoContainer}>
            <Matchups
              gameweek={gameweek}
              isFinished={isFinished}
              allMatchups={championsCupMatches}
              tableData={tableData}
              cupData={CHAMPIONS_CUP_CONFIG}
            />
            <p>Group Stage tables coming soon (sorry!)</p>
            {/* <h3>Group A</h3>
            <LiveLeagueTable tableData={ChampionsCupGroupAData.liveTable} />
            <br />
            <h3>Group B</h3>
            <LiveLeagueTable tableData={ChampionsCupGroupBData.liveTable} />
            <br />
            <h3>Group C</h3>
            <LiveLeagueTable tableData={ChampionsCupGroupCData.liveTable} />
            <br />
            <h3>Group D</h3>
            <LiveLeagueTable tableData={ChampionsCupGroupDData.liveTable} />
            <br /> */}
          </div>
        )}
        <hr style={{ width: "100%" }} />
        <br />
        <LiveFixtures
          gameweek={gameweek}
          playerScoreMap={liveData.playerScoreMap}
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
        <Link href={`/history/season-1`}>Season 1 - 2022/2023</Link>
        <Link href={`/history/season-2`}>Season 2 - 2023/2024</Link>
        <Link href={`/history/season-3`}>Season 3 - 2024/2025</Link>
        <Link href={`/history/all_seasons`}>All Seasons</Link>
      </div>
    </LiveDataContext.Provider>
  );
}
