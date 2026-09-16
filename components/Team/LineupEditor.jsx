import { useMemo, useState } from "react";
import { Stack, Alert, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Field } from "./Field";
import {
  swapLineupSlots,
  validateLineup,
  getValidSwapTargets,
  getPositionMatchedPlayers,
} from "../../lib/lineup";
import { updateLineup } from "../../lib/lineupData";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";

export function LineupEditor({
  players,
  manager,
  supabase,
  onLineupUpdated,
  onTradeClick,
  fieldSelection,
}) {
  const openPlayerDetail = usePlayerDetail();
  const [sourcePlayer, setSourcePlayer] = useState(null);
  const [saving, setSaving] = useState(false);

  const validTargetIds = useMemo(
    () =>
      sourcePlayer
        ? new Set(getValidSwapTargets(players, sourcePlayer))
        : undefined,
    [players, sourcePlayer],
  );

  if (fieldSelection) {
    const matchingIds = new Set(
      getPositionMatchedPlayers(players, fieldSelection.elementType).map(
        (p) => p.player_id,
      ),
    );
    return (
      <Field
        players={players}
        onPlayerClick={(player) =>
          matchingIds.has(player.player_id) && fieldSelection.onSelect(player)
        }
        highlightedPlayerIds={matchingIds}
      />
    );
  }

  function handlePlayerClick(player) {
    if (sourcePlayer) {
      if (player.player_id === sourcePlayer.player_id) {
        setSourcePlayer(null);
        return;
      }
      handleSelectDestination(player);
      return;
    }
    openPlayerDetail(player, {
      canEdit: true,
      onMoveClick: handleMoveClick,
      onTradeClick: onTradeClick ? handleTradeClick : undefined,
    });
  }

  function handleMoveClick(player) {
    setSourcePlayer(player);
  }

  function handleTradeClick(player) {
    onTradeClick?.(player);
  }

  async function handleSelectDestination(destPlayer) {
    let candidate;
    try {
      candidate = swapLineupSlots(
        players,
        sourcePlayer.player_id,
        destPlayer.player_id,
      );
      validateLineup(candidate);
    } catch (err) {
      notifications.show({ color: "red", message: err.message });
      setSourcePlayer(null);
      return;
    }

    setSaving(true);
    try {
      await updateLineup(supabase, manager.id, candidate);
      onLineupUpdated(candidate);
    } catch (err) {
      notifications.show({
        color: "red",
        message: `Failed to save lineup: ${err.message}`,
      });
    } finally {
      setSaving(false);
      setSourcePlayer(null);
    }
  }

  return (
    <Stack gap="xs" align="center">
      {sourcePlayer && (
        <Alert variant="outline" maw="70vw" p="xs" color="deep-blue.5">
          <Group justify="center" wrap="wrap" gap={2}>
            Choose who to sub for {sourcePlayer.name}
            <Button size="compact-xs" onClick={() => setSourcePlayer(null)}>
              Cancel
            </Button>
          </Group>
        </Alert>
      )}

      <Field
        players={players}
        onPlayerClick={saving ? undefined : handlePlayerClick}
        selectedPlayerId={sourcePlayer?.player_id}
        highlightedPlayerIds={validTargetIds}
      />
    </Stack>
  );
}
