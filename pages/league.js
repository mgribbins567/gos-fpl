import { Container, Stack, Title, Skeleton, Text } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { useLeague } from "../hooks/useLeague";
import { useManager } from "../contexts/ManagerContext";
import { useManagerLeagues } from "../hooks/useManagerLeagues";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { MatchupViewer } from "../components/Matchups/MatchupViewer";
import { StandingsTable } from "../components/League/StandingsTable";
import { GameweekNavigator } from "../components/Team/GameweekNavigator";

function LeagueTable({ data }) {
  return <Text>League Table</Text>;
}

function LeaguePageContent({}) {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );
  const { matchups, standings, navigator, error } = useLeague(
    league?.id,
    supabase,
  );

  return (
    <Container px={4} fluid>
      <Stack align="center">
        <Title ta="center">Game of Stones Season 5</Title>
        <FantasyAuth />
        <Text>{league?.name}</Text>

        {leagueError && <Text c="red">{leagueError}</Text>}
        {error && <Text c="red">{error}</Text>}

        {navigator.displayedGameweekNumber && (
          <GameweekNavigator
            gameweekNumber={navigator.displayedGameweekNumber}
            kind={navigator.kind}
            canGoBack={navigator.canGoBack}
            canGoForward={navigator.canGoForward}
            onBack={navigator.goBack}
            onForward={navigator.goForward}
          />
        )}
        <MatchupViewer matchups={matchups} standings={standings} />
        <StandingsTable standings={standings} />
      </Stack>
    </Container>
  );
}

export default function league() {
  return (
    <ManagerProvider>
      <LeaguePageContent />
    </ManagerProvider>
  );
}

function LeaguePageContent2() {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );
  const { matchups, standings, navigator, error } = useLeague(
    league?.id,
    supabase,
  );

  return (
    <Container fluid p={0} w="100%">
      <Stack align="center">
        <Title padding="sm" align="center">
          {league?.name ?? "League"}
        </Title>

        {leagueError && <Text c="red">{leagueError}</Text>}
        {error && <Text c="red">{error}</Text>}

        {navigator.displayedGameweekNumber && (
          <GameweekNavigator
            gameweekNumber={navigator.displayedGameweekNumber}
            kind={navigator.kind}
            canGoBack={navigator.canGoBack}
            canGoForward={navigator.canGoForward}
            onBack={navigator.goBack}
            onForward={navigator.goForward}
          />
        )}

        <Grid gutter="md" w="100%">
          <Grid.Col span={{ base: 12, sm: 7 }}>
            <Card shadow="sm" padding="sm" radius="md" withBorder>
              <Stack gap="xs">
                <Text fw={700}>
                  Matchups
                  {matchups?.provisional
                    ? " (provisional — bonus points pending)"
                    : ""}
                </Text>
                {!matchups && !error && <Text size="sm">Loading...</Text>}
                {matchups && (
                  <MatchupList matchupSummaries={matchups.matchupSummaries} />
                )}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 5 }}>
            <Card shadow="sm" padding="sm" radius="md" withBorder>
              <Stack gap="xs">
                <Text fw={700}>Standings</Text>
                {!standings && !error && <Text size="sm">Loading...</Text>}
                {standings && <StandingsTable standings={standings} />}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
