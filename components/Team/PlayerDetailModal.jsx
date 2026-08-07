import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  SimpleGrid,
  Table,
  Paper,
} from "@mantine/core";
import { getShirtUrl, getPlayerPositionName } from "../../lib/fplData";

function buildPlayerModalTitle(player) {
  return (
    player.name +
    " • " +
    player.teamName +
    " • " +
    getPlayerPositionName(player.elementType)
  );
}

const getRelevantStats = (elementType) => {
  const baseStats = [
    { key: "goals_scored", label: "Goals" },
    { key: "assists", label: "Assists" },
  ];

  const finalState = [
    { key: "yellow_cards", label: "Yellow Cards" },
    { key: "red_cards", label: "Red Cards" },
    { key: "bonus", label: "Bonus Points" },
  ];

  switch (elementType) {
    case 1:
      return [
        { key: "clean_sheets", label: "Clean Sheets" },
        { key: "saves", label: "Saves" },
        { key: "goals_conceded", label: "Goals Conceded" },
        ...baseStats,
        ...finalState,
      ];
    case 2:
      return [
        ...baseStats,
        { key: "clean_sheets", label: "Clean Sheets" },
        { key: "goals_conceded", label: "Goals Conceded" },
        ...finalState,
      ];
    case 3:
      return [
        ...baseStats,
        { key: "clean_sheets", label: "Clean Sheets" },
        ...finalState,
      ];
    case 4:
      return [...baseStats, ...finalState];
    default:
      return [...baseStats, ...finalState];
  }
};

export function PlayerDetailModal({
  player,
  opened,
  onClose,
  onMoveClick,
  onTradeClick,
  canEdit,
}) {
  if (!player) return null;

  const relevantStats = getRelevantStats(player.elementType);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={buildPlayerModalTitle(player)}
      centered
    >
      <Stack gap="sm">
        {!canEdit &&
        player.explain &&
        Object.keys(player.explain).length > 0 ? (
          <Stack gap="xs" spacing="xs">
            <Group justify="center">
              <img
                src={getShirtUrl(player.teamCode, player.elementType)}
                alt=""
                width={48}
                height={60}
              />
            </Group>
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
          <Stack gap="xs">
            <SimpleGrid cols={2} spacing="xs">
              <Paper withBorder p="xs" radius="md">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Total Points
                  </Text>
                  <Text size="sm" fw={700}>
                    {player.seasonStats?.total_points ?? 0}
                  </Text>
                </Group>
              </Paper>
              <Paper withBorder p="xs" radius="md">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Form
                  </Text>
                  <Text size="sm" fw={700}>
                    {player.seasonStats?.form ?? 0}
                  </Text>
                </Group>
              </Paper>

              {relevantStats.map(({ key, label }) => (
                <Paper key={key} withBorder p="xs" radius="md">
                  <Text size="xs" c="dimmed" fw={600}>
                    {label}
                  </Text>
                  <Text size="sm" fw={700}>
                    {player.seasonStats?.[key] ?? 0}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        ) : (
          <Text size="xs">No details available</Text>
        )}
        <Group grow>
          {canEdit && onTradeClick && (
            <>
              <Button onClick={onMoveClick}>Move / Sub</Button>
              <Button color="blue.6" onClick={() => onTradeClick(player)}>
                Trade
              </Button>
            </>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
