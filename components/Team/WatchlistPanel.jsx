import React, { useMemo, useState } from "react";
import {
  Table,
  Text,
  Group,
  ActionIcon,
  Button,
  TextInput,
} from "@mantine/core";
import { isFreeAgent } from "../../lib/playerSearch";
import { getShirtUrl } from "../../lib/fplData";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";
import { useWatchlist } from "../../contexts/WatchlistContext";

function RankInput({ entry, maxRank, onReorder }) {
  const [value, setValue] = useState(String(entry.rank));

  function commit() {
    const parsed = parseInt(value, 10);
    if (
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > maxRank ||
      parsed === entry.rank
    ) {
      setValue(String(entry.rank));
      return;
    }
    onReorder(entry, parsed);
  }

  return (
    <TextInput
      size="xs"
      w={36}
      ta="center"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}

const WatchlistRow = React.memo(function WatchlistRow({
  entry,
  player,
  team,
  maxRank,
  isFirst,
  isLast,
  isFree,
  signButtonMode,
  ownerId,
  ownerShortName,
  onSign,
  onTrade,
  onReorder,
  onRemove,
  onPlayerClick,
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={6} wrap="nowrap">
          <RankInput
            key={`${entry.id}-${entry.rank}`}
            entry={entry}
            maxRank={maxRank}
            onReorder={onReorder}
          />
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
            c={
              player?.status === "a"
                ? ""
                : player?.status === "d"
                  ? "orange"
                  : "red"
            }
          >
            {player?.web_name ?? "Unknown player"} {player?.news ? "⚠" : ""}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4} justify="center" wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="subtle"
            disabled={isFirst}
            onClick={() => onReorder(entry, entry.rank - 1)}
          >
            ▲
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            disabled={isLast}
            onClick={() => onReorder(entry, entry.rank + 1)}
          >
            ▼
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => onRemove(entry)}
          >
            ✕
          </ActionIcon>
        </Group>
      </Table.Td>
      <Table.Td>
        {player &&
          (isFree ? (
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
          ))}
      </Table.Td>
    </Table.Tr>
  );
});

export function WatchlistPanel({
  enrichedPlayersById,
  teamsById,
  ownershipMap,
  unavailablePlayerIds,
  leagueManagersById,
  signButtonMode,
  onSign,
  onTrade,
}) {
  const openPlayerDetail = usePlayerDetail();
  const { entries, reorder, remove, error } = useWatchlist();

  if (error)
    return (
      <Text c="red" size="sm">
        {error}
      </Text>
    );
  if (!entries) return <Text size="sm">Loading watchlist...</Text>;
  if (entries.length === 0)
    return (
      <Text size="sm" c="dimmed">
        Add players to your watchlist via detailed player view to see them here.
      </Text>
    );

  return (
    <Table
      verticalSpacing={4}
      horizontalSpacing={2}
      fz="xs"
      style={{ tableLayout: "fixed", width: "100%" }}
    >
      <colgroup>
        <col style={{ width: "60%" }} />
        <col style={{ width: "26%" }} />
        <col style={{ width: "14%" }} />
      </colgroup>
      <Table.Tbody>
        {entries.map((entry, i) => {
          const player = enrichedPlayersById?.get(entry.player_id);
          const ownerId = ownershipMap?.get(entry.player_id);
          const isFree =
            ownershipMap && unavailablePlayerIds
              ? isFreeAgent(entry.player_id, ownershipMap, unavailablePlayerIds)
              : false;
          return (
            <WatchlistRow
              key={entry.id}
              entry={entry}
              player={player}
              team={teamsById?.get(player?.team)}
              maxRank={entries.length}
              isFirst={i === 0}
              isLast={i === entries.length - 1}
              isFree={isFree}
              signButtonMode={signButtonMode}
              ownerId={ownerId}
              ownerShortName={
                leagueManagersById?.get(ownerId)?.short_name ??
                leagueManagersById?.get(ownerId)?.name.slice(0, 3).toUpperCase()
              }
              onSign={onSign}
              onTrade={onTrade}
              onReorder={reorder}
              onRemove={remove}
              onPlayerClick={(p) =>
                openPlayerDetail(p, {
                  onTradeClick: isFree
                    ? undefined
                    : (pp) => onTrade(pp, ownerId),
                  canEdit: true,
                })
              }
            />
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
