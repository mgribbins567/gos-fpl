import {
  Stack,
  Title,
  Container,
  SimpleGrid,
  Skeleton,
  Text,
  Box,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { TeamPreviewCard } from "../components/Team/TeamPreviewCard";
import { LeaguePreviewCard } from "../components/League/LeaguePreviewCard";
import { getSortedPostsData } from "../lib/posts";
import { useLeagues } from "../hooks/useLeagues";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { BlogPreviewCard } from "../components/Blog/BlogPreviewCard";

function LeagueCards() {
  const { manager, supabase } = useManager();
  const { data: managerLeague, error: managerLeagueError } =
    useSingleLeagueForManager(manager, supabase);
  const { data: leagues, error } = useLeagues(supabase);

  if (managerLeagueError) return <Text c="red">{managerLeagueError}</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!leagues) return <Skeleton height={200} />;

  const defaultLeagueId = managerLeague?.id;

  const initialSlideIndex = Math.max(
    0,
    leagues.findIndex((league) => league.id === defaultLeagueId),
  );

  return (
    <Box maw={380} w="98vw">
      <Carousel
        withIndicators={false}
        height="100%"
        width="100%"
        slideGap="md"
        align="center"
        controlsOffset={4}
        controlSize={14}
        initialSlide={initialSlideIndex}
        emblaOptions={{
          loop: true,
        }}
        styles={{
          controls: {
            top: "5%",
          },
        }}
      >
        {leagues.map((league) => (
          <Carousel.Slide key={league.id}>
            <LeaguePreviewCard
              leagueId={league.id}
              leagueName={league.name}
              supabase={supabase}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  allPostsData.length = 3;
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Dashboard({ allPostsData }) {
  return (
    <>
      <ManagerProvider>
        <Container fluid px={0}>
          <Stack align="center">
            <Title ta="center">Game of Stones Season 5</Title>
            <FantasyAuth />
            <SimpleGrid maw="100vw" cols={1} spacing="md" align="center">
              <TeamPreviewCard />
              <LeagueCards />
              <BlogPreviewCard posts={allPostsData} />
            </SimpleGrid>
          </Stack>
        </Container>
      </ManagerProvider>
    </>
  );
}
