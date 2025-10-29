import styles from "../Player/ExpandedPlayerCard.module.css";

export function ExpandedPlayerCardTable({ tableData }) {
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>GW</th>
            <th>PTS</th>
            <th>MP</th>
            <th>G</th>
            <th>A</th>
            <th>CS</th>
            <th>GC</th>
            <th>OG</th>
            <th>YC</th>
            <th>RC</th>
            <th>B</th>
            <th>BPS</th>
            <th>DC</th>
            <th>PS</th>
            <th>PM</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((player) => (
            <tr key={player.id}>
              <td>{player.GW}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
