import { Card, Text, Stack, Group, Box } from "@mantine/core";
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

export function TeamCard({ onTradeClick, fieldSelection }) {
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

  const history = useTeamHistory(manager, supabase, bootstrap, context);

  useEffect(() => {
    if (fieldSelection && history.kind && history.kind !== "upcoming") {
      history.jumpToUpcoming();
    }
  }, [fieldSelection]);

  const relevantEventId =
    history.kind === "current" || history.kind === "upcoming"
      ? history.displayedGameweekNumber
      : undefined;
  const { data: live, error: liveError } = useLiveEvent(relevantEventId);
  const { data: fixtures, error: fixturesError } = useFixtures(relevantEventId);
  const gameUpdating = live === "The game is being updated.";

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
  if (history.kind === "upcoming" && !gameUpdating) {
    if (relevantEventId && team && bootstrap && live && fixtures) {
      players = attachFixtureStatus(
        mergeTeamWithLiveData(team, bootstrap, live),
        bootstrap,
        fixtures,
        history.displayedGameweekNumber,
      );
    }
  } else {
    if (relevantEventId && history.historicalPlayers && bootstrap && fixtures) {
      players = attachFixtureStatus(
        history.historicalPlayers,
        bootstrap,
        fixtures,
        history.displayedGameweekNumber,
      );
    }
  }

  const editable =
    history.kind === "upcoming" && context?.upcoming
      ? canEditLineup(context.upcoming.event.deadline_time)
      : false;
  const totalPoints = players
    ? getTotalStartingPoints(players)
    : history.historicalPlayers
      ? getTotalStartingPoints(history.historicalPlayers)
      : undefined;

  return (
    <Card
      miw={{ base: "98vw", sm: "0" }}
      maw="98vw"
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
    >
      <Stack gap="xs">
        <Group wrap="nowrap" align="center">
          <Box style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <Text fw={700} c="white">
              {manager?.name}
            </Text>
          </Box>
          {history.displayedGameweekNumber && (
            <GameweekNavigator
              gameweekNumber={history.displayedGameweekNumber}
              kind={history.kind}
              canGoBack={history.canGoBack}
              canGoForward={history.canGoForward}
              onBack={history.goBack}
              onForward={history.goForward}
            />
          )}
          {history.kind !== "upcoming" && totalPoints !== undefined ? (
            <Box style={{ flex: 1, textAlign: "right", minWidth: 0 }}>
              {totalPoints !== undefined && (
                <Text fw={700} c="white">
                  {totalPoints} pts
                </Text>
              )}
            </Box>
          ) : (
            <Box style={{ flex: 1, textAlign: "right", minWidth: "6ch" }}></Box>
          )}
        </Group>
        {gameUpdating && <Text>Game is updating, blame FPL</Text>}
        {loadError && <Text c="red">{loadError}</Text>}

        {history.kind !== "upcoming" &&
          !history.historicalPlayers &&
          !loadError && <Text>Loading...</Text>}
        {history.kind !== "upcoming" &&
          history.historicalPlayers?.length === 0 && (
            <Text c="dimmed">No lineup recorded for this gameweek.</Text>
          )}
        {history.kind === "historical" &&
          history.historicalPlayers?.length > 0 && (
            <FieldViewer
              players={history.historicalPlayers}
              onTradeClick={onTradeClick}
            />
          )}

        {history.kind === "upcoming" && players === undefined && !loadError && (
          <Text>Loading...</Text>
        )}
        {history.kind === "upcoming" && players?.length === 0 && (
          <Text>No players found.</Text>
        )}
        {history.kind === "upcoming" && players?.length > 0 && editable && (
          <LineupEditor
            players={players}
            manager={manager}
            supabase={supabase}
            onLineupUpdated={setTeam}
            onTradeClick={onTradeClick}
            fieldSelection={fieldSelection}
          />
        )}
        {history.kind === "current" && players?.length > 0 && !editable && (
          <FieldViewer
            players={players}
            onTradeClick={onTradeClick}
            fieldSelection={fieldSelection}
          />
        )}
      </Stack>
    </Card>
  );
}
