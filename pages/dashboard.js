import { Stack, Title, Container, SimpleGrid } from "@mantine/core";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { ManagerProvider } from "../contexts/ManagerContext";
import { TeamPreviewCard } from "../components/Team/TeamPreviewCard";

export default function Dashboard({ allPostsData, featuredPost }) {
  return (
    <>
      <ManagerProvider>
        <Container fluid>
          <Stack align="center">
            <Title ta="center">Game of Stones Season 5</Title>
            <FantasyAuth />
            <SimpleGrid
              miw="400px"
              maw="70%"
              cols={1}
              spacing="md"
              align="center"
            >
              <TeamPreviewCard />
            </SimpleGrid>
          </Stack>
        </Container>
      </ManagerProvider>
    </>
  );
}
