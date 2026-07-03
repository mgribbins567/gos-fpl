import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { Container, Title, Stack, Group } from "@mantine/core";
import { ManagerProvider } from "../contexts/ManagerContext";

export default function Fantasy() {
  return (
    <ManagerProvider>
      <Container>
        <Stack align="center">
          <Title padding="sm" align="center">
            Game of Stones Fantasy
          </Title>
          <Group>
            <FantasyAuth />
          </Group>
        </Stack>
      </Container>
    </ManagerProvider>
  );
}
