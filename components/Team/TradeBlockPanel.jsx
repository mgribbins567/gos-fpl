import React, { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Stack,
  Group,
  Select,
  Switch,
  Table,
  Text,
  Badge,
  Button,
  ScrollArea,
} from "@mantine/core";
import { getShirtUrl, POSITION_LABELS } from "../../lib/fplData";
import { POSITION_FILTER_OPTIONS, ROW_HEIGHT } from "./PlayerSearchPanel";
import { PlayerSearchInput } from "./PlayerSearchInput";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";
import { useTradeBlock } from "../../contexts/TradeBlockContext";
import { useWatchlist } from "../../contexts/WatchlistContext";

export const WILLINGNESS_COLOR = {
  low: "yellow.1",
  medium: "yellow.6",
  high: "orange.6",
};

const WILLINGESS_LABEL = {
  low: "low",
  medium: "med",
  high: "high",
};

const TradeBlockRow = React.memo(function TradeBlockRow({
  entry,
  player,
  team,
  isOwn,
  ownerShortName,
  onTrade,
  onPlayerClick,
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group wrap="nowrap">
          <img
            src={getShirtUrl(team?.code, player?.element_type)}
            alt=""
            width={20}
            height={20}
          />
          <Text
            size="sm"
            onClick={player ? () => onPlayerClick(player) : undefined}
            style={{ cursor: player ? "pointer" : "default" }}
          >
            {player?.web_name ?? "Unknown player"}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs">{team?.short_name}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs">
          {player ? POSITION_LABELS[player.element_type] : ""}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge size="xs" color={WILLINGNESS_COLOR[entry.willingness] ?? "gray"}>
          {WILLINGESS_LABEL[entry.willingness]}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Button
          fullWidth
          size="compact-xs"
          onClick={() => onTrade(player, entry.manager_id)}
          styles={{
            inner: { maxWidth: "100%" },
            label: {
              whiteSpace: "normal",
              overflow: "visible",
              textOverflow: "clip",
            },
            root: { outline: "1px solid grey" },
          }}
          disabled={!ownerShortName || !player || isOwn}
        >
          {ownerShortName ? ownerShortName : "✕"}
        </Button>
      </Table.Td>
    </Table.Tr>
  );
});

export function TradeBlockPanel({
  enrichedPlayersById,
  teamsById,
  leagueManagersById,
  viewingManagerId,
  onTrade,
}) {
  const openPlayerDetail = usePlayerDetail();
  const { entries, error } = useTradeBlock();
  const { watchlistedPlayerIds } = useWatchlist();
  const scrollViewportRef = useRef(null);

  const [filters, setFilters] = useState({
    searchText: "",
    position: null,
    teamId: null,
    ownerId: null,
    onlyWatchlisted: false,
  });

  const handleSearchTextChange = useCallback(
    (searchText) => setFilters((f) => ({ ...f, searchText })),
    [],
  );

  const teamFilterOptions = useMemo(
    () => [
      { value: "", label: "Team" },
      ...Array.from(teamsById?.values() ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    ],
    [teamsById],
  );

  const ownerFilterOptions = useMemo(
    () => [
      { value: "", label: "Manager" },
      ...Array.from(leagueManagersById?.entries() ?? [])
        .map(([id, m]) => ({ value: String(id), label: m.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ],
    [leagueManagersById],
  );

  const filteredEntries = useMemo(() => {
    if (!entries) return undefined;
    const searchLower = filters.searchText.trim().toLowerCase();
    return entries.filter((entry) => {
      const player = enrichedPlayersById?.get(entry.player_id);
      if (
        searchLower &&
        player &&
        !player.web_name.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
      if (
        filters.position &&
        player &&
        player.element_type !== filters.position
      ) {
        return false;
      }
      if (filters.teamId && player && player.team !== filters.teamId) {
        return false;
      }
      if (filters.ownerId && Number(entry.manager_id) !== filters.ownerId) {
        return false;
      }
      if (
        filters.onlyWatchlisted &&
        !watchlistedPlayerIds.has(Number(entry.player_id))
      ) {
        return false;
      }
      return true;
    });
  }, [entries, enrichedPlayersById, filters, watchlistedPlayerIds]);

  const rowVirtualizer = useVirtualizer({
    count: (filteredEntries ?? []).length,
    getScrollElement: () => scrollViewportRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (error)
    return (
      <Text c="red" size="sm">
        {error}
      </Text>
    );
  if (!entries) return <Text size="sm">Loading trade block...</Text>;
  if (entries.length === 0)
    return (
      <Text size="sm" c="dimmed">
        No players on the trade block yet.
      </Text>
    );

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <Stack gap="xs" style={{ flex: 1, minHeight: 0 }}>
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <PlayerSearchInput onDebouncedChange={handleSearchTextChange} />
        <Switch
          size="xs"
          withThumbIndicator={false}
          labelPosition="left"
          label="Only Watchlisted"
          checked={filters.onlyWatchlisted}
          onChange={(event) =>
            setFilters((f) => ({
              ...f,
              onlyWatchlisted: event.target.checked,
            }))
          }
          styles={{ label: { whiteSpace: "nowrap" } }}
        />
      </Group>
      <Group gap="xs" grow>
        <Select
          size="xs"
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
          size="xs"
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
          size="xs"
          data={ownerFilterOptions}
          value={filters.ownerId ? String(filters.ownerId) : ""}
          onChange={(value) =>
            setFilters((f) => ({
              ...f,
              ownerId: value ? Number(value) : null,
            }))
          }
          placeholder="Manager"
          allowDeselect={false}
        />
      </Group>
      {filteredEntries.length === 0 ? (
        <Text size="sm" c="dimmed">
          No players found.
        </Text>
      ) : (
        <ScrollArea
          type="never"
          h={{ base: "80vh", sm: "auto" }}
          style={{ flex: 1, minHeight: 0 }}
          viewportRef={scrollViewportRef}
        >
          <Table
            stickyHeader
            stickyHeaderOffset={0}
            verticalSpacing={4}
            horizontalSpacing={2}
            fz="xs"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <colgroup>
              <col style={{ width: "42%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Player</Table.Th>
                <Table.Th>Team</Table.Th>
                <Table.Th>Pos</Table.Th>
                <Table.Th>Willingness</Table.Th>
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
                const entry = filteredEntries[virtualRow.index];
                const player = enrichedPlayersById?.get(entry.player_id);
                const isOwn = entry.manager_id === viewingManagerId;
                const manager = leagueManagersById?.get(entry.manager_id);
                return (
                  <TradeBlockRow
                    key={entry.id}
                    entry={entry}
                    player={player}
                    team={teamsById?.get(player?.team)}
                    isOwn={isOwn}
                    ownerShortName={
                      manager?.short_name ??
                      manager?.name?.slice(0, 3).toUpperCase()
                    }
                    onTrade={onTrade}
                    onPlayerClick={(p) =>
                      openPlayerDetail(p, {
                        canEdit: isOwn,
                        onTradeClick: isOwn
                          ? undefined
                          : (pp) => onTrade(pp, entry.manager_id),
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
      )}
    </Stack>
  );
}
