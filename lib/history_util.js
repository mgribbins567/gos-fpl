import { useState, useEffect } from "react";
import Link from "next/link";
import baseStyles from "../styles/Base.module.css";

/**
 * Helper function for linking to correct /history/ page
 * @param {*} season_value string value of the season
 * @returns relative link to the corresponding /history/ page
 */
function GetSeasonLink(season_value) {
  switch (season_value) {
    case "1":
      return "/history/season_22_23";
    case "2":
      return "/history/season_23_24";
    case "3":
      return "/history/season_24_25";
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

/**
 * Helper function to create a table from a set of data
 * @param {*} data
 * @returns a table
 */
function GetTable(data) {
  const headers = data.values[0];
  const rows = data.values.slice(1);

  const formattedData = rows.map((row) => {
    return headers.reduce((acc, header, index) => {
      acc[header.toLowerCase()] = row[index];
      return acc;
    }, {});
  });
  return formattedData;
}

/**
 * Creates a league table with PPW and PPG from Google Sheets
 * @param {*} range
 * @returns a league table based on the given range
 */
// TODO: Pass in spreadsheet ID so this can be parameterized
export function GetExtendedLeagueTable({ range }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const SPREADSHEET_ID = "1jcA1yZc5smY_s2SA7W1hEBCJCuJgmWroMvHl7IMUgH4";

  const SHEET_RANGE = range;

  const a1_notation_url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY}`;

  useEffect(() => {
    fetch(a1_notation_url)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = GetTable(data);
        setStandings(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [a1_notation_url]);

  if (loading) {
    return <p>Loading standings...</p>;
  }

  return (
    <div className={baseStyles.tableContainer}>
      <table>
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
        <tbody>
          {standings.map((row) => (
            <tr key={row.manager}>
              <td>{row.pos}</td>
              <td>
                <Link href={`/history/manager/${row.manager.toLowerCase()}`}>
                  {row.manager}
                </Link>
              </td>
              <td>{row.w}</td>
              <td>{row.d}</td>
              <td>{row.l}</td>
              <td>{row.pf}</td>
              <td>{row.pa}</td>
              <td>{row.pd}</td>
              <td>{row.p}</td>
              <td>{parseFloat(Number(row.ppw).toFixed(2))}</td>
              <td>{parseFloat(Number(row.ppg).toFixed(2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// TODO: combine this with GetExtendedLeagueTable
export function GetChampionsLeagueTable({ range }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const SPREADSHEET_ID = "1e-zqcbUTEf9mRVj8flpwe4YHfn3B8BQRbjqoc1idscA";

  const SHEET_RANGE = range;

  const a1_notation_url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY}`;

  useEffect(() => {
    fetch(a1_notation_url)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = GetTable(data);
        setStandings(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [a1_notation_url]);

  if (loading) {
    return <p>Loading standings...</p>;
  }

  return (
    <div className={baseStyles.tableContainer}>
      <table>
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
        <tbody>
          {standings.map((row) => (
            <tr key={row.manager}>
              <td>{row.pos}</td>
              <td>
                <Link href={`/history/manager/${row.manager.toLowerCase()}`}>
                  {row.manager}
                </Link>
              </td>
              <td>{row.w}</td>
              <td>{row.d}</td>
              <td>{row.l}</td>
              <td>{row.pf}</td>
              <td>{row.pa}</td>
              <td>{row.pd}</td>
              <td>{row.p}</td>
              <td>{row.ppw}</td>
              <td>{row.ppg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
