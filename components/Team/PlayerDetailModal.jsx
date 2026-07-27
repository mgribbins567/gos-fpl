import { Modal, Stack, Group, Text, Button, SimpleGrid } from "@mantine/core";
import { getShirtUrl } from "../../lib/fplData";

const STAT_LABELS = {
  goals_scored: "Goals",
  assists: "Assists",
  clean_sheets: "Clean sheets",
  goals_conceded: "Goals conceded",
  saves: "Saves",
  bonus: "Bonus",
  yellow_cards: "Yellow cards",
  red_cards: "Red cards",
};

export function PlayerDetailModal({
  player,
  opened,
  onClose,
  onMoveClick,
  canEdit,
}) {
  if (!player) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={player.name} centered>
      <Stack gap="sm">
        <Group justify="center">
          <img
            src={getShirtUrl(player.teamCode, player.elementType)}
            alt=""
            width={48}
            height={48}
          />
        </Group>
        <SimpleGrid cols={2} spacing="xs">
          {Object.entries(STAT_LABELS).map(([key, label]) => (
            <Group key={key} justify="space-between">
              <Text size="sm" c="dimmed">
                {label}
              </Text>
              <Text size="sm" fw={600}>
                {player.liveStats?.[key] ?? "-"}
              </Text>
            </Group>
          ))}
        </SimpleGrid>
        <Text size="xs" c="dimmed" ta="center">
          Recent match history coming soon.
        </Text>
        {canEdit && (
          <Button fullWidth onClick={onMoveClick}>
            Move / Sub
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
