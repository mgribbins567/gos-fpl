import {
  Card,
  Text,
  Stack,
  Button,
  Skeleton,
  Group,
  Badge,
  Grid,
  Table,
  Paper,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useLeaguePreview } from "../../hooks/useLeaguePreview";
import { describeGameweekStatus } from "../../lib/gameweek";

function MatchPreviews({ matchups }) {
  const highestScoring = matchups?.highestScoring ?? [];
  const closest = matchups?.closest ?? [];

  return (
    <Paper c="white" bg="none" withBorder>
      {highestScoring.length > 0 && (
        <Stack gap={4}>
          {highestScoring.map((matchup) => (
            <Text key={matchup.id} size="sm">
              {matchup.manager1.name} {matchup.manager1.score}-
              {matchup.manager2.score} {matchup.manager2.name}
            </Text>
          ))}
        </Stack>
      )}

      {closest.length > 0 && (
        <Stack gap={4}>
          {closest.map((matchup) => (
            <Text key={matchup.id} size="sm">
              {matchup.manager1.name} {matchup.manager1.score}-
              {matchup.manager2.score} {matchup.manager2.name}
            </Text>
          ))}
        </Stack>
      )}

      {highestScoring.length === 0 && closest.length === 0 && (
        <Text size="sm" c="dimmed">
          No results yet.
        </Text>
      )}
    </Paper>
  );
}

function RankChangeIndicator({ change }) {
  if (change === null || change === 0) {
    return (
      <Text size="xs" ta="center">
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

function StandingsTable({ standings }) {
  return (
    <Table w="100%" fz="xs" c="white" ta="center" horizontalSpacing={0}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Rank</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th ta="center">PF</Table.Th>
          <Table.Th ta="center">Pts</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {standings.map((row) => (
          <Table.Tr key={row.name}>
            <Table.Td>
              <Group>
                {row.rank} <RankChangeIndicator change={row.rankChange} />
              </Group>
            </Table.Td>
            <Table.Td ta="left">{row.name}</Table.Td>
            <Table.Td>{row.pointsFor}</Table.Td>
            <Table.Td fw={700}>{row.leaguePoints}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export function LeaguePreviewCard({ leagueId, leagueName, supabase }) {
  const router = useRouter();
  const { data, error } = useLeaguePreview(leagueId, supabase);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap={0}>
        <Text c="white" fw={700}>
          {leagueName}
        </Text>

        {!data && !error && <Skeleton height={140} />}
        {error && <Text c="red">{error}</Text>}

        {data && (
          <>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Text c="white" size="sm">
                    Featured Matchups
                  </Text>
                  <MatchPreviews matchups={data.featuredMatchups} />
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <StandingsTable standings={data.standings} />
              </Grid.Col>
            </Grid>
          </>
        )}

        <Button size="xs" onClick={() => router.push("/league")}>
          View League
        </Button>
      </Stack>
    </Card>
  );
}
