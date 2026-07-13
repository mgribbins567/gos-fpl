import { Card, Text, Stack, Group } from "@mantine/core";
import { useManager } from "../../contexts/ManagerContext";
import { useEffect, useState } from "react";

export async function getTeam(manager, supabase) {
  if (!manager) {
    return null;
  }
  const { data: team, error } = await supabase
    .from("team_players")
    .select("*")
    .eq("manager_id", manager.id);

  if (error) {
    throw new Error(error.message);
  }
  return team;
}

export function TeamCard() {
  const { manager, supabase } = useManager();
  const [team, setTeam] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeam(manager, supabase)
      .then(setTeam)
      .catch((err) => setError(err.message));
  }, [manager, supabase]);

  if (!manager || team === undefined) {
    return;
  }

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap="xs">
        <Text fw={700}>{manager?.name}</Text>
        {team === undefined && <Text>Loading...</Text>}
        {error && <Text c="red">{error}</Text>}
        {team?.length === 0 && <Text>No players found.</Text>}
        {team?.map((player) => (
          <Group key={player.id} justify="space-between">
            <Text>{player.player_id}</Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
