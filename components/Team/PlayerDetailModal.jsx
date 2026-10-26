import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  SimpleGrid,
  Table,
  Paper,
  Divider,
  ActionIcon,
  SegmentedControl,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  HiOutlineUser,
  HiOutlineBolt,
  HiOutlineStar,
  HiStar,
} from "react-icons/hi2";
import { getShirtUrl, getPlayerPositionName } from "../../lib/fplData";
import { usePlayerGameweekHistory } from "../../hooks/usePlayerGameweekHistory";
import { WILLINGNESS_COLOR } from "./TradeBlockPanel";

function buildPlayerModalTitle(player) {
  const name = player.seasonStats
    ? player.seasonStats.first_name + " " + player.seasonStats.second_name
    : player.name || player.web_name;
  const position = getPlayerPositionName(
    player.elementType || player.element_type,
  );
  return name + " • " + player.teamName + " • " + position;
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

const HISTORY_COLUMNS = [
  "GW",
  "VS",
  "OPP",
  "PTS",
  "MP",
  "G",
  "A",
  "CS",
  "GC",
  "OG",
  "YC",
  "RC",
  "B",
  "BPS",
  "DC",
  "PS",
  "PM",
  "XG",
  "XA",
  "XGI",
];

export function PlayerDetailModal({
  player,
  opened,
  onClose,
  onMoveClick,
  onTradeClick,
  canEdit,
  isOverview,
  supabase,
  isWatchlisted,
  onToggleWatchlist,
  tradeBlockEntry,
  onSetTradeBlockWillingness,
  onRemoveFromTradeBlock,
}) {
  const [overviewOverride, setOverviewOverride] = useState(null);
  const showOverview = overviewOverride ?? isOverview;
  const playerId = player?.player_id ?? player?.id;
  const [tradeBlockModalOpen, setTradeBlockModalOpen] = useState(false);
  const [selectedWillingness, setSelectedWillingness] = useState("medium");
  const [tradeBlockSubmitting, setTradeBlockSubmitting] = useState(false);

  function openTradeBlockModal() {
    setSelectedWillingness(tradeBlockEntry?.willingness ?? "medium");
    setTradeBlockModalOpen(true);
  }

  async function handleConfirmTradeBlock() {
    setTradeBlockSubmitting(true);
    try {
      await onSetTradeBlockWillingness(playerId, selectedWillingness);
      setTradeBlockModalOpen(false);
    } catch (err) {
      notifications.show({ color: "red", message: err.message });
    } finally {
      setTradeBlockSubmitting(false);
    }
  }

  async function handleRemoveFromTradeBlock() {
    setTradeBlockSubmitting(true);
    try {
      await onRemoveFromTradeBlock(playerId);
      setTradeBlockModalOpen(false);
    } catch (err) {
      notifications.show({ color: "red", message: err.message });
    } finally {
      setTradeBlockSubmitting(false);
    }
  }

  const scrollRef = useRef(null);
  const {
    rows: gwHistory,
    ownerColumns,
    totals,
    error: historyError,
  } = usePlayerGameweekHistory(playerId, supabase);

  useEffect(() => {
    if (gwHistory?.length && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gwHistory]);

  useEffect(() => {
    setOverviewOverride(null);
  }, [player?.player_id]);

  if (!player) return null;

  const relevantStats = getRelevantStats(player.elementType);
  const seasonStats = player.seasonStats ? player.seasonStats : player;

  const hasLiveData =
    !showOverview && player.explain && Object.keys(player.explain).length > 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      zIndex={500}
      title={
        <Group gap={4} wrap="nowrap">
          {hasLiveData && !showOverview && (
            <ActionIcon
              variant="transparent"
              onClick={() => setOverviewOverride(true)}
              size={28}
              aria-label="Season stats"
            >
              <HiOutlineUser cursor="pointer" />
            </ActionIcon>
          )}
          {!hasLiveData && showOverview && (
            <ActionIcon
              variant="transparent"
              onClick={() => setOverviewOverride(false)}
              size={28}
              aria-label="Live stats"
            >
              <HiOutlineBolt cursor="pointer" />
            </ActionIcon>
          )}
          <Text fw={500}>{buildPlayerModalTitle(player)}</Text>
          {onToggleWatchlist && (
            <ActionIcon
              variant="transparent"
              size={28}
              aria-label={
                isWatchlisted ? "Remove from watchlist" : "Add to watchlist"
              }
              onClick={() => onToggleWatchlist(playerId)}
            >
              {isWatchlisted ? (
                <HiStar color="var(--mantine-color-yellow-5)" />
              ) : (
                <HiOutlineStar />
              )}
            </ActionIcon>
          )}
        </Group>
      }
    >
      <Stack gap="xs">
        {seasonStats.news && (
          <Paper withBorder fz="sm" p={4} radius="md">
            ⚠ {seasonStats.news}
          </Paper>
        )}
        <Group gap={4}>
          <Text fz="sm">Next 5:</Text>
          {player.upcomingFixtures &&
            player.upcomingFixtures.map((fixture) => (
              <Paper p={4} fz="xs" radius="xs" withBorder>
                {!fixture.isHome ? "@" : ""}
                {fixture.opponentShortName}
              </Paper>
            ))}
        </Group>
        <Divider my={0} color="gray.8" />
        {hasLiveData ? (
          <Stack gap="xs" spacing="xs">
            <Group justify="center">
              <img
                src={getShirtUrl(player.teamCode, player.elementType)}
                alt=""
                width={48}
                height={60}
              />
              <Stack>
                {player.fixtures.map((fixture) => (
                  <Group gap={4}>
                    <Text fz="md" fw={fixture.isHome ? 700 : ""}>
                      {fixture.isHome
                        ? player.teamShortName
                        : fixture.opponentShortName}
                    </Text>
                    <Text fz="md">
                      {fixture.isHome
                        ? (fixture.teamScore || "0") +
                          " - " +
                          (fixture.opponentScore || "0")
                        : (fixture.opponentScore || "0") +
                          " - " +
                          (fixture.teamScore || "0")}
                    </Text>
                    <Text fz="md" fw={fixture.isHome ? 500 : 700}>
                      {fixture.isHome
                        ? fixture.opponentShortName
                        : player.teamShortName}
                    </Text>
                    <Text fz="sm" c="dimmed">
                      {fixture.minutes}'
                    </Text>
                  </Group>
                ))}
              </Stack>
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
        ) : seasonStats && Object.keys(seasonStats).length > 0 ? (
          <Stack gap="xs">
            <SimpleGrid cols={2} spacing="xs">
              <Paper
                withBorder
                p={6}
                radius="sm"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Total Points
                  </Text>
                  <Text size="sm" fw={700}>
                    {seasonStats?.total_points ?? 0}
                  </Text>
                </Group>
              </Paper>
              <Paper
                withBorder
                p={6}
                radius="sm"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Form
                  </Text>
                  <Text size="sm" fw={700}>
                    {seasonStats?.form ?? 0}
                  </Text>
                </Group>
              </Paper>
            </SimpleGrid>
            <SimpleGrid cols={4} spacing="xs">
              {relevantStats.map(({ key, label }) => (
                <Paper
                  key={key}
                  withBorder
                  p={6}
                  radius="sm"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text size="xs" c="dimmed" fw={600}>
                    {label}
                  </Text>
                  <Text size="sm" fw={700}>
                    {seasonStats?.[key] ?? 0}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
            {historyError && (
              <Text c="red" size="xs">
                {historyError}
              </Text>
            )}
            {gwHistory?.length > 0 && (
              <Stack gap={4}>
                <Divider my={0} color="gray.8" />
                <div
                  ref={scrollRef}
                  style={{
                    maxHeight: 240,
                    overflowY: "auto",
                    overflowX: "auto",
                  }}
                >
                  <Table fz="xs" horizontalSpacing={5} verticalSpacing={4}>
                    <Table.Thead>
                      <Table.Tr>
                        {HISTORY_COLUMNS.map((col) => (
                          <Table.Th key={col}>{col}</Table.Th>
                        ))}
                        {ownerColumns.map((col) => (
                          <Table.Th key={col.leagueId}>{col.label}</Table.Th>
                        ))}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {gwHistory.map((row) => (
                        <Table.Tr key={row.GW}>
                          {HISTORY_COLUMNS.map((col) => (
                            <Table.Td
                              key={col}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {row[col]}
                            </Table.Td>
                          ))}
                          {ownerColumns.map((col) => (
                            <Table.Td key={col.leagueId}>
                              {row[col.label]}
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      ))}
                      {totals && (
                        <Table.Tr
                          style={{
                            borderTop: "2px solid var(--mantine-color-gray-6)",
                          }}
                        >
                          {HISTORY_COLUMNS.map((col) => (
                            <Table.Td key={col} fw={700}>
                              {totals[col]}
                            </Table.Td>
                          ))}
                          {ownerColumns.map((col) => (
                            <Table.Td key={col.leagueId} fw={700}>
                              {totals[col.label]}
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </div>
              </Stack>
            )}
          </Stack>
        ) : (
          <Text size="xs">No details available</Text>
        )}
        <Group gap="xs" grow>
          {canEdit && (
            <Button
              size="compact-sm"
              px={0}
              onClick={() => onMoveClick(player)}
              fw={500}
            >
              Move / Sub
            </Button>
          )}
          {onTradeClick && (
            <Button
              size="compact-sm"
              px={0}
              color="blue.6"
              onClick={() => onTradeClick(player)}
              fw={500}
            >
              Trade
            </Button>
          )}
          {canEdit && onSetTradeBlockWillingness && (
            <Button
              size="compact-sm"
              px={0}
              tt="capitalize"
              color={
                WILLINGNESS_COLOR[tradeBlockEntry?.willingness] ?? "blue.9"
              }
              onClick={openTradeBlockModal}
              fw={500}
            >
              {tradeBlockEntry ? tradeBlockEntry.willingness : "Add to Block"}
            </Button>
          )}
        </Group>
      </Stack>

      <Modal
        opened={tradeBlockModalOpen}
        onClose={() => setTradeBlockModalOpen(false)}
        title={
          tradeBlockEntry ? "Update Trade Block Listing" : "Add to Trade Block"
        }
        centered
        zIndex={600}
      >
        <Stack gap="sm">
          <Text size="sm">
            {tradeBlockEntry
              ? `Update willingness to trade: ${player.web_name ?? player.name}`
              : `Set willingness to trade: ${player.web_name ?? player.name}`}
          </Text>
          <SegmentedControl
            fullWidth
            value={selectedWillingness}
            onChange={setSelectedWillingness}
            data={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ]}
          />
          <Group grow>
            <Button
              size="compact-sm"
              px={0}
              variant="default"
              onClick={() => setTradeBlockModalOpen(false)}
              disabled={tradeBlockSubmitting}
            >
              Cancel
            </Button>
            {tradeBlockEntry && (
              <Button
                size="compact-sm"
                px={0}
                color="red"
                variant="outline"
                onClick={handleRemoveFromTradeBlock}
                loading={tradeBlockSubmitting}
              >
                Remove
              </Button>
            )}
            <Button
              size="compact-sm"
              px={0}
              onClick={handleConfirmTradeBlock}
              loading={tradeBlockSubmitting}
            >
              {tradeBlockEntry ? "Update" : "Add"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Modal>
  );
}
