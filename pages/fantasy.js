import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { TeamCard } from "../components/Team/TeamCard";
import { Container, Title, Stack, Group } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";

export default function Fantasy() {
  return (
    <ManagerProvider>
      <Container fluid align="center" p={0} w="100%">
        <Stack align="center">
          <Title padding="sm" align="center">
            My Team
          </Title>
          <FantasyAuth />
          <TeamCard />
        </Stack>
      </Container>
    </ManagerProvider>
  );
}
