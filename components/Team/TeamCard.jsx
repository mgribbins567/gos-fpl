import { Card, Text, Stack, Group } from "@mantine/core";
import { useManager } from "../../contexts/ManagerContext";
import { useEffect, useState } from "react";
import { useBootstrapStatic, useLiveEvent } from "../../hooks/useFplData";
import {
  getCurrentGameweek,
  mergeTeamWithLiveData,
  getTotalStartingPoints,
} from "../../lib/fplData";
import { Field } from "./Field";

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
  const [teamError, setTeamError] = useState(null);

  useEffect(() => {
    getTeam(manager, supabase)
      .then(setTeam)
      .catch((err) => setTeamError(err.message));
  }, [manager, supabase]);

  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();
  const gameweek = bootstrap ? getCurrentGameweek(bootstrap) : undefined;
  const { data: live, error: liveError } = useLiveEvent(gameweek);

  if (!manager || team === undefined) {
    return null;
  }

  const loadError = teamError || bootstrapError || liveError;
  const players =
    team && bootstrap && live
      ? mergeTeamWithLiveData(team, bootstrap, live)
      : undefined;

  const totalPoints = players ? getTotalStartingPoints(players) : undefined;

  return (
    <Card shadow="sm" padding={1} radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={700} c="white">
            {manager?.name}
          </Text>
          {totalPoints !== undefined && (
            <Text fw={700} c="white">
              {totalPoints} pts
            </Text>
          )}
        </Group>
        {players === undefined && !loadError && <Text>Loading...</Text>}
        {loadError && <Text c="red">{loadError}</Text>}
        {players?.length === 0 && <Text>No players found.</Text>}
        {players && players.length > 0 && <Field players={players} />}
      </Stack>
    </Card>
  );
}
