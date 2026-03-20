import { useState } from "react";
import styles from "./MatchupCard.module.css";

function ExpandedMatchupCard({ team1Details, team2Details }) {
  return (
    <div className={styles.expandedArea}>
      <div className={`${styles.column} ${styles.left}`}>
        {team1Details.map((item, index) => (
          <div>
            <div key={item.id} className={styles.detailRow}>
              <div>
                <span className={styles.primaryText}>{item.name}</span>
                {item.subText && (
                  <span className={styles.subText}>({item.subText})</span>
                )}
              </div>
              <span className={styles.valueText}>{item.value}</span>
            </div>
            <div>
              {index === 10 && <div className={styles.benchSeparator} />}
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.column} ${styles.right}`}>
        {team2Details.map((item, index) => (
          <div>
            <div key={item.id} className={styles.detailRow}>
              <div>
                <span className={styles.primaryText}>{item.name}</span>
                {item.subText && (
                  <span className={styles.subText}>({item.subText})</span>
                )}
              </div>
              <span className={styles.valueText}>{item.value}</span>
            </div>
            <div>
              {index === 10 && <div className={styles.benchSeparator} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchupCard({
  team1,
  team2,
  score1,
  score2,
  team1Details = [],
  team2Details = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.teamName}>{team1}</div>
        <div className={styles.scoreboard}>
          {score1} - {score2}
        </div>
        <div className={`${styles.teamName} ${styles.right}`}>{team2}</div>
      </div>

      {isExpanded && (
        <ExpandedMatchupCard
          team1Details={team1Details}
          team2Details={team2Details}
        />
      )}
    </div>
  );
}
