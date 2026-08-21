import { Container, Stack, Text } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { useCup } from "../hooks/useCup";
import { useManager } from "../contexts/ManagerContext";
import { MatchupViewer } from "../components/Matchups/MatchupViewer";
import { StandingsTable } from "../components/League/StandingsTable";
import { GameweekNavigator } from "../components/Team/GameweekNavigator";
import { useGameweekTeams } from "../hooks/useGameweekTeams";

function CupDashboard({ supabase }) {
  const { matchups, standings, navigator, error } = useCup(supabase);
  const { data: teams, LeagueGameweekError } = useGameweekTeams(
    navigator?.displayedGameweekNumber,
    supabase,
  );

  return (
    <>
      {error && <Text c="red">{error}</Text>}

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
      <LeaguePageContent />
    </ManagerProvider>
  );
}
