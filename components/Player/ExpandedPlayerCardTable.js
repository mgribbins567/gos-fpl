import styles from "../Player/ExpandedPlayerCard.module.css";

export function ExpandedPlayerCardTable({ tableData }) {
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Gameweek">
                GW
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Opponent">
                VS
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Points">
                P
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Minutes Played"
              >
                MP
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Goals">
                G
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Assists">
                A
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Clean Sheets"
              >
                CS
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Goals Conceded"
              >
                GC
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Own Goals">
                OG
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Yellow Cards"
              >
                YC
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Red Cards">
                RC
              </span>
            </th>
            <th>
              <span className={styles.tooltipTrigger} data-tooltip="Bonus">
                B
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Bonus Points System"
              >
                BPS
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Defensive Contributions"
              >
                DC
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Penalties Saved"
              >
                PS
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="Penalties Missed"
              >
                PM
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="League A Owner"
              >
                OA
              </span>
            </th>
            <th>
              <span
                className={styles.tooltipTrigger}
                data-tooltip="League B Owner"
              >
                OB
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((player) => (
            <tr key={player.GW + player.id}>
              <td>{player.GW}</td>
              <td>{player.VS}</td>
              <td>{player.PTS}</td>
              <td>{player.MP}</td>
              <td>{player.G}</td>
              <td>{player.A}</td>
              <td>{player.CS}</td>
              <td>{player.GC}</td>
              <td>{player.OG}</td>
              <td>{player.YC}</td>
              <td>{player.RC}</td>
              <td>{player.B}</td>
              <td>{player.BPS}</td>
              <td>{player.DC}</td>
              <td>{player.PS}</td>
              <td>{player.PM}</td>
              <td>{player.OA}</td>
              <td>{player.OB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
