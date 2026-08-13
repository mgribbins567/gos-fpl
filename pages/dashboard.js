import {
  Stack,
  Title,
  Container,
  SimpleGrid,
  Skeleton,
  Text,
} from "@mantine/core";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { TeamPreviewCard } from "../components/Team/TeamPreviewCard";
import { LeaguePreviewCard } from "../components/League/LeaguePreviewCard";
import { useManagerLeagues } from "../hooks/useManagerLeagues";

function LeagueCards() {
  const { manager, supabase } = useManager();
  const { data: leagues, error } = useManagerLeagues(manager, supabase);

  if (error) return <Text c="red">{error}</Text>;
  if (!leagues) return <Skeleton height={200} />;

  return leagues.map((league) => (
    <LeaguePreviewCard
      key={league.id}
      leagueId={league.id}
      leagueName={league.name}
      supabase={supabase}
    />
  ));
}

export default function Dashboard({ allPostsData, featuredPost }) {
  return (
    <>
      <ManagerProvider>
        <Container fluid>
          <Stack align="center">
            <Title ta="center">Game of Stones Season 5</Title>
            <Text fw={700}>Draft Times</Text>
            <Text>League A: Saturday, August 15th @ 11am PT</Text>
            <Text>League B: Sunday, August 15th @ 4pm PT</Text>
            <Text>League C: Saturday, August 15th @ 3pm PT</Text>
            <FantasyAuth />
            <SimpleGrid maw="100vw" cols={1} spacing="md" align="center">
              <TeamPreviewCard />
              <LeagueCards />
            </SimpleGrid>
          </Stack>
        </Container>
      </ManagerProvider>
    </>
  );
}
