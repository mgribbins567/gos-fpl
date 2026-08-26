import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Stack,
  Group,
  TextInput,
  Select,
  Table,
  Button,
  ScrollArea,
  Text,
  Switch,
  SegmentedControl,
} from "@mantine/core";
import { usePlayerSearch } from "../../hooks/usePlayerSearch";
import { SORT_OPTIONS, isFreeAgent } from "../../lib/playerSearch";
import { POSITION_LABELS, ELEMENT_TYPE, getShirtUrl } from "../../lib/fplData";
import { WaiverListPanel } from "./WaiverListPanel";
import { useLeagueManagers } from "../../hooks/useLeagueManagers";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";

const ROW_HEIGHT = 32;

const POSITION_FILTER_OPTIONS = [
  { value: "", label: "Position" },
  { value: String(ELEMENT_TYPE.GOALKEEPER), label: "GKP" },
  { value: String(ELEMENT_TYPE.DEFENDER), label: "DEF" },
  { value: String(ELEMENT_TYPE.MIDFIELDER), label: "MID" },
  { value: String(ELEMENT_TYPE.FORWARD), label: "FWD" },
];

const SORT_SELECT_OPTIONS = Object.entries(SORT_OPTIONS).map(
  ([value, { label }]) => ({ value, label }),
);

function PlayerSearchInput({ onDebouncedChange }) {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);

  useEffect(() => {
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  return (
    <TextInput
      placeholder="Search players..."
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}

const PlayerRow = React.memo(function PlayerRow({
  player,
  team,
  teamName,
  statValue,
  isFree,
  signButtonMode,
  ownerId,
  ownerShortName,
  onSign,
  onTrade,
  onPlayerClick,
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group wrap="nowrap">
          <img
            src={getShirtUrl(team?.code, player.element_type)}
            alt=""
            width={20}
            height={20}
          />
          <Text
            size="sm"
            onClick={() => onPlayerClick(player)}
            style={{ cursor: "pointer" }}
            c={
              player.status === "a"
                ? ""
                : player.status === "d"
                  ? "orange"
                  : "red"
            }
          >
            {player.web_name} {player.news ? "⚠" : ""}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{team?.short_name}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{POSITION_LABELS[player.element_type]}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" ta="center" fw={700}>
          {statValue}
        </Text>
      </Table.Td>
      <Table.Td>
        {isFree ? (
          <Button
            fullWidth
            size="compact-xs"
            disabled={signButtonMode === "closed"}
            onClick={() => onSign(player)}
          >
            {signButtonMode === "waiver"
              ? "＋"
              : signButtonMode === "closed"
                ? "✕"
                : "＋"}
          </Button>
        ) : (
          <Button
            fullWidth
            size="compact-xs"
            onClick={() => onTrade(player, ownerId)}
            styles={{
              inner: { maxWidth: "100%" },
              label: {
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "clip",
              },
            }}
            disabled={!ownerShortName}
          >
            {ownerShortName ? ownerShortName : "✕"}
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  );
});

export function PlayerSearchPanel({
  leagueId,
  viewingManagerId,
  supabase,
  onSign,
  onTrade,
  signButtonMode,
  waiverClaims,
  waiverError,
  onReorderWaiverClaim,
  onRemoveWaiverClaim,
}) {
  const openPlayerDetail = usePlayerDetail();
  const [showWaiverList, setShowWaiverList] = useState(false);
  const scrollViewportRef = useRef(null);

  const {
    results,
    sortKey,
    setSortKey,
    filters,
    setFilters,
    ownershipMap,
    unavailablePlayerIds,
    bootstrap,
    error,
  } = usePlayerSearch(leagueId, viewingManagerId, supabase);
  const { data: leagueManagersById } = useLeagueManagers(leagueId, supabase);

  const handleSearchTextChange = useCallback(
    (searchText) => setFilters((f) => ({ ...f, searchText })),
    [setFilters],
  );

  const teamsById = useMemo(
    () => new Map((bootstrap?.teams ?? []).map((t) => [t.id, t])),
    [bootstrap],
  );

  const teamFilterOptions = useMemo(
    () => [
      { value: "", label: "Team" },
      ...(bootstrap?.teams ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    ],
    [bootstrap],
  );

  const enrichedResults = useMemo(
    () =>
      (results ?? []).map((player) => ({
        ...player,
        teamName: teamsById.get(player.team)?.name,
      })),
    [results, teamsById],
  );

  const rowVirtualizer = useVirtualizer({
    count: enrichedResults.length,
    getScrollElement: () => scrollViewportRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (error) return <Text c="red">{error}</Text>;
  if (!results || !bootstrap) return <Text>Loading players...</Text>;

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <Stack gap="xs">
      <SegmentedControl
        fullWidth
        value={showWaiverList ? "waivers" : "search"}
        onChange={(value) => setShowWaiverList(value === "waivers")}
        data={[
          { label: "Players", value: "search" },
          {
            label: `Waivers${waiverClaims ? ` (${waiverClaims.length})` : ""}`,
            value: "waivers",
          },
        ]}
      />
      {showWaiverList ? (
        <>
          {waiverError && (
            <Text c="red" size="sm">
              {waiverError}
            </Text>
          )}
          <WaiverListPanel
            claims={waiverClaims}
            onReorder={onReorderWaiverClaim}
            onRemove={onRemoveWaiverClaim}
          />
        </>
      ) : (
        <>
          <Group gap="xs" justify="space-between" wrap="nowrap">
            <PlayerSearchInput onDebouncedChange={handleSearchTextChange} />
            <Switch
              size="sm"
              withThumbIndicator={false}
              labelPosition="left"
              label="Only FAs"
              checked={filters.onlyAvailable}
              onChange={(event) =>
                setFilters((f) => ({
                  ...f,
                  onlyAvailable: event.target.checked,
                }))
              }
              styles={{ label: { whiteSpace: "nowrap" } }}
            />
          </Group>
          <Group gap="xs" grow>
            <Select
              data={POSITION_FILTER_OPTIONS}
              value={filters.position ? String(filters.position) : ""}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  position: value ? Number(value) : null,
                }))
              }
              placeholder="Position"
              allowDeselect={false}
            />
            <Select
              data={teamFilterOptions}
              value={filters.teamId ? String(filters.teamId) : ""}
              onChange={(value) =>
                setFilters((f) => ({
                  ...f,
                  teamId: value ? Number(value) : null,
                }))
              }
              placeholder="Team"
              allowDeselect={false}
            />
            <Select
              data={SORT_SELECT_OPTIONS}
              value={sortKey}
              onChange={setSortKey}
              placeholder="Sort by"
              allowDeselect={false}
            />
          </Group>
          <ScrollArea
            h={{ base: "80vh", sm: "420px" }}
            viewportRef={scrollViewportRef}
          >
            <Table
              stickyHeader
              stickyHeaderOffset={0}
              verticalSpacing={4}
              horizontalSpacing={2}
              p={0}
              fz="xs"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Player</Table.Th>
                  <Table.Th>Team</Table.Th>
                  <Table.Th>Pos</Table.Th>
                  <Table.Th ta="center">{SORT_OPTIONS[sortKey].label}</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paddingTop > 0 && (
                  <tr>
                    <td
                      style={{ height: paddingTop, padding: 0, border: 0 }}
                      colSpan={5}
                    />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const player = enrichedResults[virtualRow.index];
                  const ownerId = ownershipMap.get(player.id);
                  const isFree = isFreeAgent(
                    player.id,
                    ownershipMap,
                    unavailablePlayerIds,
                  );
                  return (
                    <PlayerRow
                      key={player.id}
                      player={player}
                      ownerId={ownerId}
                      ownerShortName={
                        leagueManagersById?.get(ownerId)?.short_name ??
                        leagueManagersById
                          ?.get(ownerId)
                          ?.name.slice(0, 3)
                          .toUpperCase()
                      }
                      team={teamsById.get(player.team)}
                      statValue={SORT_OPTIONS[sortKey].getValue(player)}
                      isFree={isFree}
                      signButtonMode={signButtonMode}
                      onSign={onSign}
                      onTrade={onTrade}
                      onPlayerClick={() =>
                        openPlayerDetail(player, {
                          onTradeClick: isFree
                            ? undefined
                            : (p) => onTrade(p, ownerId),
                          canEdit: true,
                        })
                      }
                    />
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td
                      style={{ height: paddingBottom, padding: 0, border: 0 }}
                      colSpan={5}
                    />
                  </tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </>
      )}
    </Stack>
  );
}
