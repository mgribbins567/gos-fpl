"use client";

import { useEffect, useState } from "react";
import { Table, Text, Badge, Group, Stack, Loader, Box } from "@mantine/core";
import { buildTable } from "../../lib/buildLeagueTable";
import managersData from "../../data/managers.json";

const managerNameMap = Object.fromEntries(
  Object.entries(managersData).map(([key, m]) => [Number(key), m.name]),
);

const stickyStyle = (left) => ({
  position: "sticky",
  left,
  zIndex: 1,
  backgroundColor: "#2e2e2e",
});

function RankChange({ change }) {
  if (change > 0)
    return (
      <Badge color="green" size="xs" variant="filled" w={25}>
        +{change}
      </Badge>
    );
  if (change < 0)
    return (
      <Badge color="red" size="xs" variant="filled" w={25}>
        {change}
      </Badge>
    );
  return (
    <Badge color="gray" size="xs" variant="filled" w={25}>
      -
    </Badge>
  );
}

function buildLiveMask(liveMatchups) {
  const mask = {};

  liveMatchups.map((team) => {
    const team1 = Number(team.team1.fetch_id);
    const team2 = Number(team.team2.fetch_id);
    const team1Score = team.team1.totalPoints;
    const team2Score = team.team2.totalPoints;

    if (team1Score > team2Score) {
      mask[team1] = {
        win: 1,
        draw: 0,
        loss: 0,
        points: 3,
        pf: team1Score,
        pa: team2Score,
      };
      mask[team2] = {
        win: 0,
        draw: 0,
        loss: 1,
        points: 0,
        pf: team2Score,
        pa: team1Score,
      };
    } else if (team2Score > team1Score) {
      mask[team1] = {
        win: 0,
        draw: 0,
        loss: 1,
        points: 0,
        pf: team1Score,
        pa: team2Score,
      };
      mask[team2] = {
        win: 1,
        draw: 0,
        loss: 0,
        points: 3,
        pf: team2Score,
        pa: team1Score,
      };
    } else {
      mask[team1] = {
        win: 0,
        draw: 1,
        loss: 0,
        points: 1,
        pf: team1Score,
        pa: team2Score,
      };
      mask[team2] = {
        win: 0,
        draw: 1,
        loss: 0,
        points: 1,
        pf: team2Score,
        pa: team1Score,
      };
    }
  });

  return mask;
}

export function LeagueTable({ leagueId, liveMatchups }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/fpl/league/${leagueId}`);
        if (!res.ok)
          throw new Error("Failed to load league data for league ", leagueId);
        // const liveMask = buildLiveMask(liveMatchups);
        var liveMask;

        const { details, isLive } = await res.json();
        const { league_entries, matches, standings } = details;

        if (isLive) {
          setIsLive(true);
          liveMask = buildLiveMask(liveMatchups);
        }

        const table = buildTable(
          standings,
          matches,
          league_entries,
          liveMask,
          managerNameMap,
        );
        setRows(table);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [leagueId]);

  if (loading) {
    return (
      <Group justify="center" p="xl">
        <Loader />
        <Text c="dimmed">Loading league table…</Text>
      </Group>
    );
  }

  if (error) {
    return <Box color="red">{error}</Box>;
  }

  const tableHeaders = (
    <Table.Tr>
      <Table.Th style={stickyStyle(0)}>Pos</Table.Th>
      <Table.Th style={stickyStyle(40)}>Team</Table.Th>
      <Table.Th ta="center">W</Table.Th>
      <Table.Th ta="center">D</Table.Th>
      <Table.Th ta="center">L</Table.Th>
      <Table.Th ta="center">PF</Table.Th>
      <Table.Th ta="center">PA</Table.Th>
      <Table.Th ta="center">PD</Table.Th>
      <Table.Th ta="center" c="blue">
        PTS
      </Table.Th>
      <Table.Th ta="center">PPW</Table.Th>
      <Table.Th ta="center">PPG</Table.Th>
    </Table.Tr>
  );

  const tableRows = rows.map((row, i) => (
    <Table.Tr key={row.league_entry}>
      <Table.Td style={stickyStyle(0)}>
        <Group gap={4} wrap="nowrap">
          <Text w={25} fw={600}>
            {i + 1}
          </Text>
          <RankChange change={row.rankChange} />
        </Group>
      </Table.Td>
      <Table.Td style={stickyStyle(25)}>
        <Stack gap={0}>
          <Text fw={600} size="sm">
            {row.managerName}
          </Text>
        </Stack>
      </Table.Td>
      <Table.Td ta="center">{row.matches_won}</Table.Td>
      <Table.Td ta="center">{row.matches_drawn}</Table.Td>
      <Table.Td ta="center">{row.matches_lost}</Table.Td>
      <Table.Td ta="center">{row.points_for}</Table.Td>
      <Table.Td ta="center">{row.points_against}</Table.Td>
      <Table.Td ta="center">
        {row.points_for - row.points_against > 0 ? "+" : ""}
        {row.points_for - row.points_against}
      </Table.Td>
      <Table.Td ta="center">
        <Text c="blue" fw={700}>
          {row.projectedTotal}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        {(
          row.points_for /
          (row.matches_won + row.matches_drawn + row.matches_lost)
        ).toFixed(2)}
      </Table.Td>
      <Table.Td ta="center">
        {(
          row.projectedTotal /
          (row.matches_won + row.matches_drawn + row.matches_lost)
        ).toFixed(2)}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack
      gap="sm"
      maw={800}
      mx="auto"
      p={{ base: "xs", sm: "md", overflowX: "hidden", width: "100%" }}
    >
      <Group justify="space-between" align="center">
        <Text size={{ base: "md", sm: "xl" }} fw={700}>
          League Table
        </Text>
        <Group gap="xs">
          {isLive && (
            <Badge color="green" variant="dot">
              Live
            </Badge>
          )}
          {!isLive && (
            <Badge color="grey" variant="dot">
              Final
            </Badge>
          )}
        </Group>
      </Group>

      <Box
        bdrs="md"
        bd="1px solid #444"
        w="100%"
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Table
          verticalSpacing="xs"
          bg="#2e2e2e"
          style={{
            maxWidth: "100%",
          }}
        >
          <Table.Thead>{tableHeaders}</Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
}
