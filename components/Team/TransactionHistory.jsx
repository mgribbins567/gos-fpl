import { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Group,
  Select,
  Text,
  Divider,
  Title,
  Table,
  Collapse,
  UnstyledButton,
} from "@mantine/core";
import { useSeasonGameweeks } from "../../hooks/useSeasonGameweeks";
import { useWaiverResults } from "../../hooks/useWaiverResults";
import { useFreeAgentSignings } from "../../hooks/useFreeAgentSignings";

function getPlayerName(bootstrap, playerId) {
  if (!bootstrap || playerId == null) return "—";
  const player = bootstrap.elements.find((el) => el.id === playerId);
  return player?.web_name ?? `#${playerId}`;
}

function getManagerShortName(leagueManagersById, managerId) {
  return (
    leagueManagersById?.get(managerId)?.short_name ?? `Manager ${managerId}`
  );
}

export function TransactionHistoryPanel({
  league,
  supabase,
  bootstrap,
  leagueManagersById,
  defaultGameweekId,
}) {
  const { data: gameweeks } = useSeasonGameweeks(supabase);
  const [selectedGameweekId, setSelectedGameweekId] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    if (!selectedGameweekId && defaultGameweekId) {
      setSelectedGameweekId(defaultGameweekId);
    }
  }, [defaultGameweekId, selectedGameweekId]);

  const waiverResults = useWaiverResults(league, selectedGameweekId, supabase);
  const freeAgentSignings = useFreeAgentSignings(
    league,
    selectedGameweekId,
    supabase,
  );

  const managerOptions = leagueManagersById
    ? [...leagueManagersById.values()].map((m) => ({
        value: String(m.id),
        label: m.short_name,
      }))
    : [];

  const filteredWaiverClaims = (waiverResults.data ?? []).filter(
    (c) => !selectedManagerId || String(c.manager_id) === selectedManagerId,
  );
  const filteredSignings = (freeAgentSignings.data ?? []).filter(
    (s) => !selectedManagerId || String(s.manager_id) === selectedManagerId,
  );

  return (
    <Card withBorder maw="98vw" p="xs">
      <Stack gap="xs">
        <UnstyledButton onClick={() => setOpened((o) => !o)}>
          <Group justify="space-between" wrap="wrap">
            <Title order={6}>Transactions</Title>
            {opened ? <Text>▲</Text> : <Text>▼</Text>}
          </Group>
        </UnstyledButton>
        <Collapse expanded={opened}>
          <Group gap="xs">
            <Select
              size="xs"
              w={80}
              placeholder="Gameweek"
              data={(gameweeks ?? []).map((gw) => ({
                value: gw.id,
                label: `GW ${gw.gameweek}`,
              }))}
              value={selectedGameweekId}
              onChange={setSelectedGameweekId}
            />
            <Select
              size="xs"
              w={120}
              placeholder="All managers"
              clearable
              data={managerOptions}
              value={selectedManagerId}
              onChange={setSelectedManagerId}
            />
          </Group>
          <Divider label="Waivers" labelPosition="left" />
          {waiverResults.error && <Text c="red">{waiverResults.error}</Text>}
          {!waiverResults.error && filteredWaiverClaims.length === 0 && (
            <Text size="sm" c="dimmed">
              No processed waiver claims for this gameweek.
            </Text>
          )}
          {filteredWaiverClaims.length > 0 && (
            <Table verticalSpacing={4} fz="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Manager</Table.Th>
                  <Table.Th>In</Table.Th>
                  <Table.Th>Out</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredWaiverClaims.map((claim) => (
                  <Table.Tr key={claim.id}>
                    <Table.Td>
                      {getManagerShortName(
                        leagueManagersById,
                        claim.manager_id,
                      )}
                    </Table.Td>
                    <Table.Td>
                      {getPlayerName(bootstrap, claim.add_player_id)}
                    </Table.Td>
                    <Table.Td>
                      {getPlayerName(bootstrap, claim.drop_player_id)}
                    </Table.Td>
                    <Table.Td
                      c={claim.status === "successful" ? "green" : "red"}
                    >
                      {claim.status}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          <Divider label="Free Agents" labelPosition="left" />
          {freeAgentSignings.error && (
            <Text c="red">{freeAgentSignings.error}</Text>
          )}
          {!freeAgentSignings.error && filteredSignings.length === 0 && (
            <Text size="sm" c="dimmed">
              No free agent signings for this gameweek.
            </Text>
          )}
          {filteredSignings.length > 0 && (
            <Table verticalSpacing={4} fz="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Manager</Table.Th>
                  <Table.Th>In</Table.Th>
                  <Table.Th>Out</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredSignings.map((signing) => (
                  <Table.Tr key={signing.id}>
                    <Table.Td>
                      {getManagerShortName(
                        leagueManagersById,
                        signing.manager_id,
                      )}
                    </Table.Td>
                    <Table.Td>
                      {getPlayerName(bootstrap, signing.player_in_id)}
                    </Table.Td>
                    <Table.Td>
                      {getPlayerName(bootstrap, signing.player_out_id)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Collapse>
      </Stack>
    </Card>
  );
}
