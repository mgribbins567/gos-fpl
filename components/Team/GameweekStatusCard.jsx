import { Paper, Group, Stack, Text, Badge } from "@mantine/core";

function formatDeadline(date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const PHASE_LABELS = {
  waivers_open: "Waivers open",
  free_agency_open: "Free agency open",
};

export function GameweekStatusCard({ context, waiverPriority, totalManagers }) {
  if (!context) return null;

  const upcoming = context.upcoming;
  const stateLabel = upcoming
    ? (PHASE_LABELS[upcoming.phase] ?? `Gameweek ${upcoming.event.id}`)
    : "";
  const deadlineLabel =
    upcoming?.phase === "waivers_open"
      ? `Waivers due ${formatDeadline(upcoming.waiversDueAt)}`
      : upcoming?.phase === "free_agency_open"
        ? `Squad locks ${formatDeadline(upcoming.squadLockAt)}`
        : null;

  return (
    <Paper radius="md" p="xs" maw="98vw" withBorder>
      <Group justify="space-between" wrap="nowrap">
        {context.mode === "live" && (
          <Badge size="sm" color="green" w="13ch">
            GW{context.event.id} live
          </Badge>
        )}
        <Stack gap={0}>
          <Text size="sm" fw={700}>
            {stateLabel}
          </Text>
          {deadlineLabel && (
            <Text size="xs" c="dimmed">
              {deadlineLabel}
            </Text>
          )}
        </Stack>

        {upcoming?.phase === "waivers_open" && waiverPriority != null && (
          <Text size="sm" fw={700}>
            You have pick: {waiverPriority}
          </Text>
        )}
      </Group>
    </Paper>
  );
}
