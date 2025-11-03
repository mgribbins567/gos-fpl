import utilStyles from "../../styles/utils.module.css";
import { HiBars3 } from "react-icons/hi2";
import { ExpandedPlayerCardTable } from "./ExpandedPlayerCardTable";
import Portal from "../Portal";

export function ExpandedPlayerCard({
  playerData,
  isOpen,
  onCardClick,
  fixturesData,
}) {
  function handlePopoutClick(event) {
    event.stopPropagation();
  }

  const statsTable = [];
  const numGameweeks = Object.keys(playerData.gameweeks).length;
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
  Object.keys(playerData.gameweeks).forEach((gameweek) => {
    const data = playerData.gameweeks[gameweek].stats;
    const teamId = fixturesData.teamCodesToId[playerData.details.teamCode];

    const currentFixture = fixturesData.fixtures.filter(
      (fixture) =>
        fixture.id === playerData.gameweeks[gameweek].explain[0].fixture
    );

    const isHome = currentFixture[0].team_h === teamId;
    const opp = isHome ? currentFixture[0].team_a : currentFixture[0].team_h;

    statsTable[gameweek] = {
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
  });

  return (
    <div>
      <HiBars3
        className={utilStyles.expandPointsButton}
        onClick={onCardClick}
      />
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
