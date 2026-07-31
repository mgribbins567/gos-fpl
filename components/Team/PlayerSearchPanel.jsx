import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Stack,
  Group,
  TextInput,
  Select,
  Table,
  Button,
  ScrollArea,
  Text,
} from "@mantine/core";
import { usePlayerSearch } from "../../hooks/usePlayerSearch";
import { SORT_OPTIONS, isFreeAgent } from "../../lib/playerSearch";
import { POSITION_LABELS, ELEMENT_TYPE, getShirtUrl } from "../../lib/fplData";

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

function PlayerRow({ player, team, statValue, isFree, onSign, onTrade }) {
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
          <Text size="sm">{player.web_name}</Text>
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
      <Table.Td maw="9ch">
        {isFree ? (
          <Button fullWidth size="compact-xs" onClick={() => onSign(player)}>
            Sign
          </Button>
        ) : (
          <Button fullWidth size="compact-xs" onClick={() => onTrade(player)}>
            Trade
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  );
}

export function PlayerSearchPanel({
  leagueId,
  viewingManagerId,
  supabase,
  onSign,
  onTrade,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchText] = useDebouncedValue(searchInput, 300);

  const {
    results,
    sortKey,
    setSortKey,
    filters,
    setFilters,
    ownershipMap,
    bootstrap,
    error,
  } = usePlayerSearch(leagueId, viewingManagerId, supabase);

  useEffect(() => {
    setFilters((f) => ({ ...f, searchText: debouncedSearchText }));
  }, [debouncedSearchText, setFilters]);

  if (error) return <Text c="red">{error}</Text>;
  if (!results || !bootstrap) return <Text>Loading players...</Text>;

  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));
  const teamFilterOptions = [
    { value: "", label: "Team" },
    ...bootstrap.teams.map((t) => ({ value: String(t.id), label: t.name })),
  ];

  return (
    <Stack gap="xs">
      <TextInput
        placeholder="Search players..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.currentTarget.value)}
      />
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
            setFilters((f) => ({ ...f, teamId: value ? Number(value) : null }))
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
      <ScrollArea h={{ base: "80vh", sm: "420px" }}>
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
              <Table.Th ta="center">{SORT_OPTIONS[sortKey].label}</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {results.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                team={teamsById.get(player.team)}
                statValue={SORT_OPTIONS[sortKey].getValue(player)}
                isFree={isFreeAgent(player.id, ownershipMap)}
                onSign={onSign}
                onTrade={onTrade}
              />
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}
