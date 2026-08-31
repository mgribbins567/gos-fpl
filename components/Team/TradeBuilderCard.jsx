import {
  Card,
  Stack,
  Group,
  Text,
  Button,
  Table,
  Divider,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { POSITION_LABELS } from "../../lib/fplData";
import { receivingManagerRosterQuery } from "../../hooks/queries/tradeData";

export function TradeBuilderCard({
  builder,
  leagueId,
  supabase,
  bootstrap,
  receivingManagerName,
  onAddPlayer,
}) {
  const [rosterPlayerIds, setRosterPlayerIds] = useState(undefined);
  const [rosterError, setRosterError] = useState(null);

  useEffect(() => {
    if (!builder.receivingManagerId) return;
    let cancelled = false;
    receivingManagerRosterQuery
      .fetch(supabase, leagueId, builder.receivingManagerId)
      .then((ids) => !cancelled && setRosterPlayerIds(ids))
      .catch((err) => !cancelled && setRosterError(err.message));
    return () => {
      cancelled = true;
    };
  }, [builder.receivingManagerId, leagueId, supabase]);

  if (!builder.isActive || !bootstrap) return null;

  const elementsById = new Map(bootstrap.elements.map((e) => [e.id, e]));
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));
  const pairedReceiverIds = new Set(
    builder.pairings.map((p) => p.receiverPlayerId),
  );
  const remainingPlayers = (rosterPlayerIds ?? [])
    .filter(
      (id) =>
        !pairedReceiverIds.has(id) && id !== builder.pendingReceiverPlayer?.id,
    )
    .map((id) => elementsById.get(id))
    .filter(Boolean);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap="sm">
        <Text fw={600}>Trading with: {receivingManagerName}</Text>

        <Stack gap="xs">
          {builder.pairings.map((p) => (
            <Group key={p.receiverPlayerId} justify="space-between">
              <Text size="sm">
                {p.proposerPlayerName} ↔ {p.receiverPlayerName}
              </Text>
              <Button
                size="compact-xs"
                onClick={() => builder.removePairing(p.receiverPlayerId)}
              >
                Remove
              </Button>
            </Group>
          ))}
          {builder.pairings.length === 0 &&
            !builder.isSelectingProposerPlayer && (
              <Text size="sm" c="dimmed">
                No players selected yet.
              </Text>
            )}
        </Stack>
        <Divider />

        {rosterError && (
          <Text c="red" size="sm">
            {rosterError}
          </Text>
        )}
        {rosterPlayerIds !== undefined &&
          !builder.isSelectingProposerPlayer && (
            <Stack gap={4}>
              <Text size="xs" fw={600}>
                {receivingManagerName}'s team
              </Text>
              <ScrollArea type="never" h={{ sm: "420px" }}>
                <Table
                  stickyHeader
                  stickyHeaderOffset={0}
                  verticalSpacing={4}
                  horizontalSpacing={2}
                  p={0}
                  fz="xs"
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Player</Table.Th>
                      <Table.Th>Team</Table.Th>
                      <Table.Th>Pos</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {remainingPlayers.map((player) => (
                      <Table.Tr key={player.id}>
                        <Table.Td>{player.web_name}</Table.Td>
                        <Table.Td>
                          {teamsById.get(player.team)?.name || "Unknown"}
                        </Table.Td>
                        <Table.Td>
                          {POSITION_LABELS[player.element_type]}
                        </Table.Td>
                        <Table.Td maw="9ch" align="right">
                          <Button
                            size="compact-xs"
                            fullWidth
                            onClick={() => onAddPlayer(player)}
                          >
                            Add
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Stack>
          )}

        <Group grow>
          <Button variant="default" onClick={builder.cancel}>
            Cancel
          </Button>
          <Button
            disabled={builder.pairings.length === 0}
            onClick={builder.openConfirm}
          >
            Send
          </Button>
        </Group>
        {builder.error && (
          <Text c="red" size="sm">
            {builder.error}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
