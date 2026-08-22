import { Stack, Text } from "@mantine/core";
import { Fixture } from "./Fixture";

function formatTime(kickoffTime) {
  const date = new Date(kickoffTime);
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    month: "numeric",
    day: "numeric",
  });
}

export function FixturesViewer({ fixtures }) {
  if (!fixtures) return;

  return (
    <Stack gap={0} align="center">
      {fixtures && (
        <Stack gap={0}>
          {fixtures.map((fixture) => (
            <>
              <Text c="dimmed" fz="xs" ta="right">
                {formatTime(fixture.kickoff_time)}
              </Text>
              <Fixture fixture={fixture} />
            </>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
