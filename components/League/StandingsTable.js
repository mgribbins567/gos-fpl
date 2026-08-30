import { Table, Text, Box, Group, Badge } from "@mantine/core";

const stickyStyle = (left) => ({
  position: "sticky",
  left,
  zIndex: 1,
  backgroundColor: "#2e2e2e",
});

function RankChange({ change }) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const color = isPositive ? "green" : isNegative ? "red" : "gray";
  const displayValue = isPositive ? `+${change}` : isNegative ? change : "-";

  return (
    <Badge
      color={color}
      size="xs"
      variant="filled"
      w={25}
      styles={{
        root: { height: "auto", overflow: "visible" },
        label: { whiteSpace: "normal", overflow: "visible" },
      }}
    >
      {displayValue}
    </Badge>
  );
}

function RankChangeIndicator({ change }) {
  if (change === null || change === 0) {
    return (
      <Text size="xs" fw={700} ta="center">
        -
      </Text>
    );
  }
  const isUp = change > 0;
  return (
    <Text size="xs" fw={700} c={isUp ? "teal" : "red"} ta="center">
      {isUp ? "▲" : "▼"}
      {Math.abs(change)}
    </Text>
  );
}

export function StandingsTable({ standings }) {
  if (!standings) return;

  return (
    <Box
      bdrs="md"
      bd="1px solid #444"
      w="100%"
      maw={500}
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Table
        verticalSpacing={4}
        horizontalSpacing={2}
        fz="xs"
        bg="#2e2e2e"
        style={{
          maxWidth: "100%",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={stickyStyle(0)}>Pos</Table.Th>
            <Table.Th maw="6ch" style={stickyStyle(40)}>
              Team
            </Table.Th>
            <Table.Th ta="center">W</Table.Th>
            <Table.Th ta="center">D</Table.Th>
            <Table.Th ta="center">L</Table.Th>
            <Table.Th ta="center">PF</Table.Th>
            <Table.Th ta="center">PA</Table.Th>
            <Table.Th ta="center">PD</Table.Th>
            <Table.Th ta="center" fw={700}>
              Pts
            </Table.Th>
            <Table.Th ta="center">PPW</Table.Th>
            <Table.Th ta="center">PPG</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {standings.map((row) => (
            <Table.Tr key={row.name}>
              <Table.Td style={stickyStyle(0)}>
                <Group gap={4} wrap="nowrap">
                  <Text size="xs" w="2ch">
                    {row.rank}
                  </Text>
                  <RankChange change={row.rankChange} />
                </Group>
              </Table.Td>
              <Table.Td maw="6ch" style={stickyStyle(25)}>
                {row.name}
              </Table.Td>
              <Table.Td ta="center">{row.wins}</Table.Td>
              <Table.Td ta="center">{row.draws}</Table.Td>
              <Table.Td ta="center">{row.losses}</Table.Td>
              <Table.Td ta="center">{row.pointsFor}</Table.Td>
              <Table.Td ta="center">{row.pointsAgainst}</Table.Td>
              <Table.Td ta="center">
                {row.pointsFor - row.pointsAgainst > 0 ? "+" : ""}
                {row.pointsFor - row.pointsAgainst}
              </Table.Td>
              <Table.Td ta="center" fw={700}>
                {row.leaguePoints}
              </Table.Td>
              <Table.Td ta="center">
                {parseFloat(
                  (row.pointsFor / (row.wins + row.draws + row.losses)).toFixed(
                    2,
                  ),
                )}
              </Table.Td>
              <Table.Td ta="center">
                {parseFloat(
                  (
                    row.leaguePoints /
                    (row.wins + row.draws + row.losses)
                  ).toFixed(2),
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
