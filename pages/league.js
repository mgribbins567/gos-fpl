import { useState } from "react";
import { Container, Stack, Text, Tabs } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { useLeague } from "../hooks/useLeague";
import { useManager } from "../contexts/ManagerContext";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { MatchupViewer } from "../components/Matchups/MatchupViewer";
import { StandingsTable } from "../components/League/StandingsTable";
import { GameweekNavigator } from "../components/Team/GameweekNavigator";
import { useLeagueGameweekTeams } from "../hooks/useLeagueGameweekTeams";
import { useLeagues } from "../hooks/useLeagues";
import { useFixturesWithTeams } from "../hooks/useFplData";
import { FixturesViewer } from "../components/Fixtures/FixturesViewer";

function LeagueDashboard({ leagueId, supabase }) {
  const { matchups, standings, navigator, error } = useLeague(
    leagueId,
    supabase,
  );
  const { data: fixtures, error: fixturesError } = useFixturesWithTeams(
    navigator?.displayedGameweekNumber,
  );
  const { data: teams, leagueGameweekError } = useLeagueGameweekTeams(
    leagueId,
    navigator?.displayedGameweekNumber,
    fixtures,
    supabase,
  );

  return (
    <>
      {error && <Text c="red">{error}</Text>}
      {leagueGameweekError && <Text c="red">{leagueGameweekError}</Text>}
      {fixturesError && <Text c="red">{fixturesError}</Text>}

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
      <FixturesViewer fixtures={fixtures} />
    </>
  );
}

function LeaguePageContent({}) {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );

  const { data: leagues, error: leaguesError } = useLeagues(supabase);

  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const activeLeagueId =
    selectedLeagueId ?? (league?.id != null ? String(league.id) : undefined);
  const activeLeague = leagues?.find(
    (league) => String(league.id) === activeLeagueId,
  );

  return (
    <Container px={4} fluid>
      <Stack align="center">
        <FantasyAuth />
        {leagues && leagues.length > 0 && (
          <Tabs
            w={400}
            maw="98vw"
            radius="sm"
            value={activeLeagueId ?? null}
            onChange={setSelectedLeagueId}
          >
            <Tabs.List grow justify="space-between">
              {leagues.map((league) => (
                <Tabs.Tab key={league.id} value={String(league.id)}>
                  {league.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        )}

        {leagueError && <Text c="red">{leagueError}</Text>}
        {leaguesError && <Text c="red">{leaguesError}</Text>}

        {activeLeague && (
          <LeagueDashboard
            key={activeLeague.id}
            leagueId={activeLeague.id}
            supabase={supabase}
          />
        )}
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
