import React from "react";
import { useHeadToHeadHistory } from "../hooks/useHeadToHeadHistory";

export default function HeadToHeadModal({ managerA, managerB, onClose }) {
  const { headToHeadHistory, isLoading, isError } = useHeadToHeadHistory(
    managerA,
    managerB
  );

  const calculateSummary = (data) => {
    let winsA = 0;
    let winsB = 0;
    let draws = 0;

    data.forEach((match) => {
      if (match.winner === "A") {
        winsA += 1;
      } else if (match.winner === "B") {
        winsB += 1;
      } else {
        draws += 1;
      }
    });

    return `${winsA} Wins for ${managerA.name}, ${winsB} Wins for ${managerB.name}, ${draws} Draws`;
  };

  return (
    <div>
      <div>
        <button onClick={onClose}>X</button>
        {isLoading && <p>Loading historical matchups</p>}
        {isError && <p>Error loading historical matchups :(</p>}

        {headToHeadHistory && headToHeadHistory.length > 0 && (
          <>
            <div>{calculateSummary(headToHeadHistory)}</div>

            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Gameweek</th>
                  <th>Score</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {headToHeadHistory.map((match, index) => (
                  <tr key={match.id}>
                    <td>{match.gameweek.season}</td>
                    <td>{match.gameweek.gameweek}</td>
                    <td>
                      {match.manager_1_score} - {match.manager_2_score}
                    </td>
                    <td>{match.winner === managerA ? managerA : managerB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
