import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

function GetSeasonLink(season_value) {
  switch (season_value) {
    case "S1":
      return "/history/season_22_23";
    case "S2":
      return "/history/season_23_24";
    case "S2 Cup 1":
      return "/history/season_23_24";
    case "S2 Cup 2":
      return "/history/season_23_24";
    case "Total":
      return "/history/all_seasons";
    default:
      return "/history/";
  }
}

export function GetManagerLeagueTable({ data, manager }) {
  let filteredContents = data.filter((info) => info.manager === manager);
  const DisplayData = filteredContents.map((info) => {
    return (
      <tr>
        <td>
          <Link href={GetSeasonLink(info.s)}>{info.s}</Link>
        </td>
        <td>{info.place}</td>
        <td>{info.w}</td>
        <td>{info.d}</td>
        <td>{info.l}</td>
        <td>{info.pf}</td>
        <td>{info.pa}</td>
        <td>{info.pd}</td>
        <td>{info.p}</td>
        <td>{info.ppw}</td>
        <td>{info.ppg}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Season</th>
            <th>Pos</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>PD</th>
            <th>P</th>
            <th>PPW</th>
            <th>PPG</th>
          </tr>
        </thead>
        <tbody>{DisplayData}</tbody>
      </table>
    </div>
  );
}

export function GetExtendedLeagueTable({ data }) {
  const DisplayData = data.map((info) => {
    return (
      <tr>
        <td>{info.place}</td>
        <td>
          <Link href={`/history/manager/${info.manager.toLowerCase()}`}>
            {info.manager}
          </Link>
        </td>
        <td>{info.w}</td>
        <td>{info.d}</td>
        <td>{info.l}</td>
        <td>{info.pf}</td>
        <td>{info.pa}</td>
        <td>{info.pd}</td>
        <td>{info.p}</td>
        <td>{info.ppw}</td>
        <td>{info.ppg}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className={utilStyles.extendedHistoryTable}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Manager</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PA</th>
            <th>PD</th>
            <th>P</th>
            <th>PPW</th>
            <th>PPG</th>
          </tr>
        </thead>
        <tbody>{DisplayData}</tbody>
      </table>
    </div>
  );
}
