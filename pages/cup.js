import { Container, Stack, Text, Title } from "@mantine/core";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { PlayerDetailProvider } from "../contexts/PlayerDetailContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { useCup } from "../hooks/useCup";
import { MatchupViewer } from "../components/Matchups/MatchupViewer";
import { StandingsTable } from "../components/League/StandingsTable";
import { GameweekNavigator } from "../components/Team/GameweekNavigator";
import { useGameweekTeams } from "../hooks/useGameweekTeams";
import { useUpcomingFixturesWithTeams } from "../hooks/useFplData";

function CupDashboard({ supabase }) {
  const { name, matchups, standings, navigator, error } = useCup(supabase);
  const { data: fixtures, error: fixturesError } = useUpcomingFixturesWithTeams(
    navigator?.currentGameweekNumber,
  );
  const { data: teams, gameweekTeamsError } = useGameweekTeams(
    navigator?.displayedGameweekNumber,
    fixtures,
    supabase,
  );

  return (
    <>
      {error && <Text c="red">{error}</Text>}
      {gameweekTeamsError && <Text c="red">{gameweekTeamsError}</Text>}
      {fixturesError && <Text c="red">{fixturesError}</Text>}
      {name && <Title order={5}>{name}</Title>}

      {navigator?.displayedGameweekNumber && (
        <GameweekNavigator
          gameweekNumber={navigator.displayedGameweekNumber}
          kind={navigator.kind}
          canGoBack={navigator.canGoBack}
          canGoForward={navigator.canGoForward}
          onBack={navigator.goBack}
          onForward={navigator.goForward}
        />
      )}
      <MatchupViewer matchups={matchups} standings={standings} teams={teams} />
      <StandingsTable standings={standings} />
    </>
  );
}

function LeaguePageContent({}) {
  const { manager, supabase } = useManager();

  return (
    <Container px={4} fluid>
      <Stack align="center">
        <FantasyAuth />
        <CupDashboard supabase={supabase} />
      </Stack>
    </Container>
  );
}

export default function league() {
  return (
    <ManagerProvider>
      <PlayerDetailProvider>
        <LeaguePageContent />
      </PlayerDetailProvider>
    </ManagerProvider>
  );
}
