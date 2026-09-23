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

function getZoneStyle(rank, format, isTopLeague, isBottomLeague) {
  if (format === "cup") {
    if (rank < 8) {
      const blue = "rgba(51, 154, 240, 0.15)";
      return {
        rowStyle: { backgroundColor: blue },
        zoneStickyStyle: {
          background: `linear-gradient(${blue}, ${blue}), #2e2e2e`,
        },
      };
    }
    if (rank === 8) {
      const blue = "rgba(51, 154, 240, 0.15)";
      const border = {
        borderBottom: "1px solid var(--mantine-color-yellow-6)",
      };
      return {
        rowStyle: { backgroundColor: blue, ...border },
        zoneStickyStyle: {
          background: `linear-gradient(${blue}, ${blue}), #2e2e2e`,
          ...border,
        },
      };
    }
    if (rank < 24) {
      const green = "rgba(64, 192, 87, 0.15)";
      return {
        rowStyle: { backgroundColor: green },
        zoneStickyStyle: {
          background: `linear-gradient(${green}, ${green}), #2e2e2e`,
        },
      };
    }
    if (rank === 24) {
      const green = "rgba(64, 192, 87, 0.15)";
      const border = { borderBottom: "1px solid var(--mantine-color-red-6)" };
      return {
        rowStyle: { backgroundColor: green, ...border },
        zoneStickyStyle: {
          background: `linear-gradient(${green}, ${green}), #2e2e2e`,
          ...border,
        },
      };
    }
  }

  if (format === "league") {
    let bgColor = null;
    let borderBottom = null;
    let borderLeft = null;

    // 1. Champion
    if (rank === 1) {
      bgColor = "rgba(255, 215, 0, 0.15)"; // Gold
      if (isTopLeague) {
        borderLeft = "1px solid var(--mantine-color-blue-6)"; // Standard Blue
      }
    }
    // 2. Automatic Promotion & Champions League
    else if (rank === 2) {
      if (!isTopLeague) {
        bgColor = "rgba(64, 192, 87, 0.15)"; // Standard Green
        borderBottom = "1px solid var(--mantine-color-green-6)";
      } else {
        // bgColor = "rgba(51, 154, 240, 0.15)"; // Standard Blue
        borderLeft = "1px solid var(--mantine-color-blue-6)"; // Standard Blue
      }
    }
    // 3. Promotion Playoff & Champions League
    else if (rank === 3) {
      if (!isTopLeague) {
        bgColor = "rgba(148, 216, 45, 0.15)"; // Lime / Lighter Green
      } else {
        // bgColor = "rgba(51, 154, 240, 0.15)"; // Standard Blue
        borderLeft = "1px solid var(--mantine-color-blue-6)"; // Standard Blue
      }
    }
    // 4, 5. Europa League
    else if ((rank === 4 || rank === 5) && isTopLeague) {
      borderLeft = "1px solid rgb(243, 113, 20)"; // Light Orange
    }
    // 6. Conference League
    else if (rank === 6 && isTopLeague) {
      borderLeft = "1px solid rgb(148, 216, 45)"; // Lime / Lighter Green
    }
    // 10. Relegation Playoff
    else if (rank === 10) {
      if (!isBottomLeague) {
        bgColor = "rgba(255, 135, 135, 0.15)"; // Lighter/Faded Red
      }
      borderBottom = "1px solid var(--mantine-color-red-6)";
    }
    // 11, 12. Relegation
    else if (rank === 11 || rank === 12) {
      bgColor = "rgba(224, 49, 49, 0.15)"; // Dark/Standard Red
    }

    if (bgColor || borderBottom || borderLeft) {
      const rowStyle = {};
      const zoneStickyStyle = {};

      if (bgColor) {
        rowStyle.backgroundColor = bgColor;
        zoneStickyStyle.background = `linear-gradient(${bgColor}, ${bgColor}), #2e2e2e`;
      }

      if (borderBottom) {
        rowStyle.borderBottom = borderBottom;
        zoneStickyStyle.borderBottom = borderBottom;
      }

      const posColumnStyle = { ...zoneStickyStyle };
      if (borderLeft) {
        posColumnStyle.borderLeft = borderLeft;
      }

      return { rowStyle, zoneStickyStyle, posColumnStyle };
    }
  }

  return { rowStyle: {}, zoneStickyStyle: {}, posColumnStyle: {} };
}

export function StandingsTable({
  standings,
  format = "league",
  isTopLeague = false,
  isBottomLeague = false,
}) {
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
          {standings.map((row) => {
            const { rowStyle, zoneStickyStyle, posColumnStyle } = getZoneStyle(
              row.rank,
              format,
              isTopLeague,
              isBottomLeague,
            );
            return (
              <Table.Tr key={row.name} style={rowStyle}>
                <Table.Td
                  style={{
                    ...stickyStyle(0),
                    ...posColumnStyle,
                  }}
                >
                  <Group gap={4} wrap="nowrap">
                    <Text size="xs" w="2ch">
                      {row.rank}
                    </Text>
                    <RankChange change={row.rankChange} />
                  </Group>
                </Table.Td>
                <Table.Td
                  maw="6ch"
                  style={{ ...stickyStyle(25), ...zoneStickyStyle }}
                >
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
                    (
                      row.pointsFor /
                      (row.wins + row.draws + row.losses)
                    ).toFixed(2),
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
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
