import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  SimpleGrid,
  Table,
} from "@mantine/core";
import { getShirtUrl, getPlayerPositionName } from "../../lib/fplData";

const STAT_LABELS = {
  goals_scored: "Goals",
  assists: "Assists",
  clean_sheets: "Clean sheets",
  goals_conceded: "Goals conceded",
  saves: "Saves",
  bonus: "Bonus",
  yellow_cards: "Yellow cards",
  red_cards: "Red cards",
  total_points: "Total points",
};

function buildPlayerModalTitle(player) {
  return (
    player.name +
    " • " +
    player.teamName +
    " • " +
    getPlayerPositionName(player.elementType)
  );
}

export function PlayerDetailModal({
  player,
  opened,
  onClose,
  onMoveClick,
  canEdit,
}) {
  if (!player) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={buildPlayerModalTitle(player)}
      centered
    >
      <Stack gap="sm">
        <Group justify="center">
          <img
            src={getShirtUrl(player.teamCode, player.elementType)}
            alt=""
            width={48}
            height={48}
          />
        </Group>
        {!canEdit &&
        player.explain &&
        Object.keys(player.explain).length > 0 ? (
          <Stack gap="xs" spacing="xs">
            <Table tabularNums variant="vertical">
              <Table.Tbody>
                {Object.values(player.explain).flatMap((match) =>
                  match.stats.map((stat) => (
                    <Table.Tr key={`${match.id}-${stat.identifier}`}>
                      <Table.Td>
                        {stat.identifier
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1),
                          )
                          .join(" ")}
                      </Table.Td>
                      <Table.Td ta="center">({stat.value})</Table.Td>
                      <Table.Td ta="right">{stat.points}</Table.Td>
                    </Table.Tr>
                  )),
                )}
                <Table.Tr
                  key="total"
                  style={{
                    backgroundColor: "#80808017",
                  }}
                >
                  <Table.Td>Total Points:</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right">{player.points}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        ) : canEdit &&
          player.seasonStats &&
          Object.keys(player.seasonStats).length > 0 ? (
          <SimpleGrid cols={2} spacing="xs">
            {Object.entries(STAT_LABELS).map(([key, label]) => (
              <Group key={key} justify="space-between">
                <Text size="sm" c="white">
                  {label}
                </Text>
                <Text size="sm" fw={700}>
                  {player.seasonStats?.[key] ?? "-"}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        ) : (
          <Text size="xs">No details available</Text>
        )}
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
