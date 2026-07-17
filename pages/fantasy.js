import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { TeamCard } from "../components/Team/TeamCard";
import { Container, Title, Stack, Group } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";

export default function Fantasy() {
  return (
    <ManagerProvider>
      <Container px={0}>
        <Stack align="center">
          <Title padding="sm" align="center">
            Game of Stones Fantasy
          </Title>
          <Group maw="100%">
            <TeamCard />
          </Group>
          <FantasyAuth />
        </Stack>
      </Container>
    </ManagerProvider>
  );
}
