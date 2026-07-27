import { Group, ActionIcon, Text, Button, Badge } from "@mantine/core";

export function GameweekNavigator({
  gameweekNumber,
  isHistorical,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}) {
  return (
    <Group justify="center" wrap="nowrap" gap={3}>
      <Button
        size="compact-xs"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Previous gameweek"
      >
        ◂ Prev
      </Button>
      <Badge
        color={!isHistorical ? "green" : "grey"}
        variant="dot"
        bg="none"
        radius="xs"
      >
        GW{gameweekNumber}
      </Badge>
      <Button
        size="compact-xs"
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Next gameweek"
      >
        Next ▸
      </Button>
    </Group>
  );
}
