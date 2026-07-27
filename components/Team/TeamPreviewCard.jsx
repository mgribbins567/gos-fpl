import {
  Card,
  Text,
  Stack,
  Group,
  Button,
  Skeleton,
  Badge,
  Center,
  Paper,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useManager } from "../../contexts/ManagerContext";
import { useMatchupPreview } from "../../hooks/useMatchupPreview";
import { formatDeadline, describeGameweekStatus } from "../../lib/gameweek";

function CurrentMatch({
  manager1,
  manager2,
  score1,
  score2,
  topPlayer1,
  topPlayer2,
}) {
  return (
    <>
      <Stack align="center">
        <Paper
          radius="md"
          p="xs"
          c="white"
          bg="none"
          withBorder
          w="100%"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 8ch auto 8ch 1fr",
            alignItems: "center",
            columnGap: 8,
          }}
        >
          <Text size="sm" fw={700} truncate="end" ta="left">
            {manager1}
          </Text>

          <Badge
            size="lg"
            color="deep-blue.5"
            radius="sm"
            w="6ch"
            fw={800}
            style={{ justifySelf: "center" }}
          >
            {score1}
          </Badge>

          <Text size="sm" fw={700} c="dimmed">
            -
          </Text>

          <Badge
            size="lg"
            color="deep-blue.5"
            radius="sm"
            w="6ch"
            fw={800}
            style={{ justifySelf: "center" }}
          >
            {score2}
          </Badge>

          <Text size="sm" fw={700} truncate="end" ta="right">
            {manager2}
          </Text>
        </Paper>
        {topPlayer1 && (
          <Group miw="100%" justify="space-between">
            <Text size="sm">
              {topPlayer1.name} ({topPlayer1.points})
            </Text>
            <Text size="sm">Top Player</Text>
            <Text size="sm" ta="right">
              {topPlayer2.name} ({topPlayer2.points})
            </Text>
          </Group>
        )}
      </Stack>
    </>
  );
}

export function TeamPreviewCard() {
  const { manager, supabase } = useManager();
  const router = useRouter();
  const { data, error } = useMatchupPreview(manager, supabase);

  if (!manager) return null;

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack>
        {!data && !error && <Skeleton height={80} />}
        {error && <Text c="red">{error}</Text>}

        {data && (
          <Stack gap="sm">
            <Group justify="space-between">
              <Badge variant="outline" color="deep-blue.2" size="md" fw={800}>
                GW{data.gameweekNumber}
              </Badge>
              <Badge
                variant="dot"
                tt="none"
                style={{
                  "--badge-dot-color":
                    data.phase === "in_progress" ? "lime" : "orange",
                }}
              >
                {describeGameweekStatus(data)}
              </Badge>
            </Group>
            {data.mode === "live" && data.matchup && (
              <>
                <CurrentMatch
                  manager1={data.matchup.self.name}
                  manager2={data.matchup.opponent.name}
                  score1={data.matchup.self.score}
                  score2={data.matchup.opponent.score}
                  topPlayer1={data.matchup.self.topPlayer}
                  topPlayer2={data.matchup.opponent.topPlayer}
                />
              </>
            )}
            {data.mode === "live" && !data.matchup && (
              <Text size="sm">No matchup this gameweek.</Text>
            )}

            {data.mode === "between" && (
              <>
                {data.matchup.previous && (
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">
                      Last week
                    </Text>
                    <CurrentMatch
                      manager1={data.matchup.previous.self.name}
                      manager2={data.matchup.previous.opponent.name}
                      score1={data.matchup.previous.self.score}
                      score2={data.matchup.previous.opponent.score}
                    />
                  </Stack>
                )}
                {data.matchup.next && (
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">
                      Next week
                    </Text>
                    <Text size="sm" c="white">
                      vs {data.matchup.next.opponent.name}
                    </Text>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        )}

        <Button
          size="xs"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/fantasy")}
        >
          View Squad
        </Button>
      </Stack>
    </Card>
  );
}
