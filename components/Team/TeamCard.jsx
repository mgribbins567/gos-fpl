import { Card, Text, Stack, Group, Badge, Box } from "@mantine/core";
import { useManager } from "../../contexts/ManagerContext";
import { useEffect, useState, useMemo } from "react";
import {
  useBootstrapStatic,
  useLiveEvent,
  useFixtures,
} from "../../hooks/useFplData";
import {
  mergeTeamWithLiveData,
  getTotalStartingPoints,
  attachFixtureStatus,
} from "../../lib/fplData";
import { canEditLineup } from "../../lib/gameweek";
import { Field } from "./Field";
import { LineupEditor } from "./LineupEditor";
import { getActiveGameweekContext } from "../../lib/gameweek";
import { FieldViewer } from "./FieldViewer";
import { GameweekNavigator } from "./GameweekNavigator";
import { useTeamHistory } from "../../hooks/useTeamHistory";

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

  const { context, error: contextError } = useMemo(() => {
    if (!bootstrap) return { context: undefined, error: null };
    try {
      return { context: getActiveGameweekContext(bootstrap), error: null };
    } catch (err) {
      return { context: undefined, error: err.message };
    }
  }, [bootstrap]);

  const boundaryGameweekNumber =
    context?.mode === "live"
      ? context.event.id
      : context?.mode === "between"
        ? context.nextEvent.id
        : undefined;
  const relevantEventId =
    context?.mode === "live"
      ? context.event.id
      : context?.mode === "between"
        ? context.nextEvent?.id
        : undefined;
  const { data: live, error: liveError } = useLiveEvent(relevantEventId);
  const { data: fixtures, error: fixturesError } = useFixtures(relevantEventId);

  const history = useTeamHistory(
    manager,
    supabase,
    bootstrap,
    boundaryGameweekNumber,
  );

  if (!manager || team === undefined) {
    return null;
  }

  const loadError =
    teamError ||
    bootstrapError ||
    contextError ||
    liveError ||
    fixturesError ||
    history.error;
  let players;
  if (!history.isHistorical && team && bootstrap && context) {
    if (relevantEventId && live && fixtures) {
      players = attachFixtureStatus(
        mergeTeamWithLiveData(team, bootstrap, live),
        bootstrap,
        fixtures,
      );
    } else if (!relevantEventId) {
      players = mergeTeamWithStaticData(team, bootstrap);
    }
  }

  const editable =
    !history.isHistorical && context?.mode === "between"
      ? canEditLineup(context.nextEvent.deadline_time)
      : false;

  const totalPoints = players
    ? getTotalStartingPoints(players)
    : history.historicalPlayers
      ? getTotalStartingPoints(history.historicalPlayers)
      : undefined;

  return (
    <Card maw="98vw" shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap="xs">
        <Group wrap="nowrap" align="center">
          <Box style={{ flex: 1, textAlign: "left" }}>
            <Text fw={700} c="white" truncate>
              {manager?.name}
            </Text>
          </Box>
          {boundaryGameweekNumber && (
            <GameweekNavigator
              gameweekNumber={history.displayedGameweekNumber}
              isHistorical={history.isHistorical}
              canGoBack={history.canGoBack}
              canGoForward={history.canGoForward}
              onBack={history.goBack}
              onForward={history.goForward}
            />
          )}
          {totalPoints !== undefined && (
            <Box style={{ flex: 1, textAlign: "right" }}>
              {totalPoints !== undefined && (
                <Text fw={700} c="white">
                  {totalPoints} pts
                </Text>
              )}
            </Box>
          )}
        </Group>
        {loadError && <Text c="red">{loadError}</Text>}
        {history.isHistorical && !history.historicalPlayers && !loadError && (
          <Text>Loading...</Text>
        )}

        {history.isHistorical && history.historicalPlayers?.length > 0 && (
          <FieldViewer players={history.historicalPlayers} />
        )}

        {!history.isHistorical && players === undefined && !loadError && (
          <Text>Loading...</Text>
        )}
        {!history.isHistorical && players?.length === 0 && (
          <Text>No players found.</Text>
        )}
        {!history.isHistorical && players?.length > 0 && editable && (
          <LineupEditor
            players={players}
            manager={manager}
            supabase={supabase}
            onLineupUpdated={setTeam}
          />
        )}
        {!history.isHistorical && players?.length > 0 && !editable && (
          <FieldViewer players={players} />
        )}
      </Stack>
    </Card>
  );
}
