import { Group, ActionIcon, Text, Button, Badge, Box } from "@mantine/core";

export function GameweekNavigator({
  gameweekNumber,
  isHistorical,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}) {
  return (
    <Group justify="center" wrap="nowrap" gap={0}>
      <Button
        size="compact-xs"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Previous gameweek"
      >
        ◂ Prev
      </Button>
      <Box w={60} style={{ display: "flex", justifyContent: "center" }}>
        <Badge
          color={!isHistorical ? "green" : "grey"}
          size="xs"
          variant="dot"
          fz="xs"
          bg="none"
          bd="none"
          radius="xs"
        >
          GW{gameweekNumber}
        </Badge>
      </Box>
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
