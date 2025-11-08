import utilStyles from "../../styles/utils.module.css";
import { ExpandedPlayerCardTable } from "./ExpandedPlayerCardTable";
import { useLiveData } from "../../contexts/LiveDataContext";
import Portal from "../Portal";
import managers from "../../data/managers.json";
import { checkElementId } from "../../lib/player_util";

function getNextFiveFixtures(numGameweeks, fixturesData, playerData) {
  const nextFixtures = [];
  for (
    let gameweek = numGameweeks + 1;
    gameweek < numGameweeks + 6;
    gameweek++
  ) {
    const teamId = fixturesData.teamCodesToId[playerData.details.teamCode];
    const currentFixture = fixturesData.fixtures.filter(
      (fixture) =>
        fixture.event === gameweek &&
        (fixture.team_h === teamId || fixture.team_a === teamId)
    );

    const isHome = currentFixture[0].team_h === teamId;
    nextFixtures.push(
      (isHome ? "vs " : "@ ") +
        fixturesData.teams[
          isHome ? currentFixture[0].team_a : currentFixture[0].team_h
        ].short_name
    );
  }
  return nextFixtures;
}

function getOwners(managerPlayerMap, gameweek, id) {
  var a, b;
  for (var manager in managerPlayerMap) {
    managerPlayerMap[manager].gameweeks[gameweek].map((player) => {
      if (id === checkElementId(player.element)) {
        if (managers[manager].league === "a") {
          a = managers[manager].name;
        } else {
          b = managers[manager].name;
        }
      }
    });
  }
  return { a: a, b: b };
}

export function ExpandedPlayerCard({ playerData, isOpen, onCardClick }) {
  const fixturesData = useLiveData().fixturesData;
  const managerPlayerMap = useLiveData().managerPlayerMap;
  function handlePopoutClick(event) {
    event.stopPropagation();
  }

  const statsTable = [];
  const numGameweeks = Object.keys(playerData.gameweeks).length;
  const mostRecentGameweek = parseInt(
    Object.keys(playerData.gameweeks)[
      Object.keys(playerData.gameweeks).length - 1
    ]
  );
  statsTable[numGameweeks + 1] = {
    GW: "=",
    PTS: 0,
    MP: 0,
    G: 0,
    A: 0,
    CS: 0,
    GC: 0,
    OG: 0,
    YC: 0,
    RC: 0,
    B: 0,
    BPS: 0,
    DC: 0,
    PS: 0,
    PM: 0,
  };
  const nextFixtures = getNextFiveFixtures(
    mostRecentGameweek,
    fixturesData,
    playerData
  );
  let currentOwners = {};
  let lengthA = 0,
    lengthB = 0,
    scoreA = 0,
    scoreB = 0;
  let firstGameweekA = true,
    firstGameweekB = true;
  let tableLength = 0;

  Object.keys(playerData.gameweeks).forEach((gameweek) => {
    const data = playerData.gameweeks[gameweek].stats;
    const teamId = fixturesData.teamCodesToId[playerData.details.teamCode];

    const owners = getOwners(managerPlayerMap, gameweek, playerData.details.id);
    if (firstGameweekA || currentOwners.a === owners.a) {
      firstGameweekA = false;
      lengthA++;
      scoreA += data.total_points;
    } else {
      firstGameweekA = true;
      lengthA = 0;
      scoreA = 0;
    }
    if (firstGameweekB || currentOwners.b === owners.b) {
      firstGameweekB = false;
      lengthB++;
      scoreB += data.total_points;
    } else {
      firstGameweekB = true;
      lengthB = 0;
      lengthB = 0;
    }
    currentOwners = {
      a: owners.a,
      lengthA: lengthA,
      scoreA: scoreA,
      b: owners.b,
      lengthB: lengthB,
      scoreB: scoreB,
    };

    const currentFixture = fixturesData.fixtures.filter(
      (fixture) =>
        fixture.id === playerData.gameweeks[gameweek].explain[0].fixture
    );

    const isHome = currentFixture[0].team_h === teamId;
    const opp = isHome ? currentFixture[0].team_a : currentFixture[0].team_h;

    statsTable[tableLength] = {
      GW: gameweek,
      VS: (isHome ? "vs " : "@ ") + fixturesData.teams[opp].short_name,
      PTS: data.total_points,
      MP: data.minutes,
      G: data.goals_scored,
      A: data.assists,
      CS: data.clean_sheets,
      GC: data.goals_conceded,
      OG: data.own_goals,
      YC: data.yellow_cards,
      RC: data.red_cards,
      B: data.bonus,
      BPS: data.bps,
      DC: data.defensive_contribution,
      PS: data.penalties_saved,
      PM: data.penalties_missed,
      OA: owners.a,
      OB: owners.b,
    };
    const sumTable = statsTable[numGameweeks + 1];
    sumTable.PTS += data.total_points;
    sumTable.MP += data.minutes;
    sumTable.G += data.goals_scored;
    sumTable.A += data.assists;
    sumTable.CS += data.clean_sheets;
    sumTable.GC += data.goals_conceded;
    sumTable.OG += data.own_goals;
    sumTable.YC += data.yellow_cards;
    sumTable.RC += data.red_cards;
    sumTable.B += data.bonus;
    sumTable.BPS += data.bps;
    sumTable.DC += data.defensive_contribution;
    sumTable.PS += data.penalties_saved;
    sumTable.PM += data.penalties_missed;

    tableLength++;
  });

  return (
    <div>
      {isOpen && (
        <Portal>
          <div className={utilStyles.backdrop} onClick={onCardClick} />
          <div
            className={utilStyles.expandedPointsBreakdown}
            onClick={handlePopoutClick}
          >
            <div className={utilStyles.expandedPointsBreakdownHeader}>
              <h4>
                {playerData.details.firstName} {playerData.details.lastName}
              </h4>
              <h4>
                {fixturesData.teamCodes[playerData.details.teamCode].name}{" "}
                {playerData.details.position}
              </h4>
            </div>
            <div className={utilStyles.expandedPointsNextFive}>
              Next 5: {nextFixtures.map((fixture) => fixture).join(", ")}
            </div>
            <div className={utilStyles.expandedPointsNextFive}>
              A: {currentOwners.a} ({currentOwners.lengthA}
              {"gw, "}
              {currentOwners.scoreA}p) B: {currentOwners.b || "None"} (
              {currentOwners.lengthB}
              {"gw, "}
              {currentOwners.scoreB}p)
            </div>
            <button className={utilStyles.closePopout} onClick={onCardClick}>
              x
            </button>
            <ExpandedPlayerCardTable tableData={statsTable} />
          </div>
        </Portal>
      )}
    </div>
  );
}
