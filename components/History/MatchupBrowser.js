import { useState } from "react";
import styles from "../History/MatchupBrowser.module.css";
import { ScoreBug } from "../Scorebox";

export const MatchupBrowser = ({ gameweeks }) => {
  const initialGw = gameweeks.length > 0 ? gameweeks[0].gameweek : 1;
  const [selectedGw, setSelectedGw] = useState(initialGw);

  const totalGameweeks = gameweeks.length;
  const currentGameweekData = gameweeks.find(
    (gw) => gw.gameweek === selectedGw
  );

  if (totalGameweeks === 0) {
    return <div>No gameweek data available for this season :(</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameweekHeader}>
        <button
          disabled={selectedGw === 1}
          onClick={() => setSelectedGw(selectedGw - 1)}
          className={styles.gameweekButton}
        >
          &larr; Prev
        </button>
        <h3>Gameweek {selectedGw}</h3>
        <button
          disabled={selectedGw === 38}
          onClick={() => setSelectedGw(selectedGw + 1)}
          className={styles.gameweekButton}
        >
          Next &rarr;
        </button>
      </div>

      <div className={styles.scoreboard}>
        {currentGameweekData &&
          currentGameweekData.Matchup.map((matchup) => (
            <div key={matchup.id} className={styles.matchupCard}>
              <div className={styles.matchupHeader}>
                <ScoreBug
                  manager1Name={matchup.manager_1}
                  manager2Name={matchup.manager_2}
                  score1={matchup.manager_1_score}
                  score2={matchup.manager_2_score}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
