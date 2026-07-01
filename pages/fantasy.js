import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { Container, Title, Stack } from "@mantine/core";

export default function Fantasy() {
  return (
    <Container maw={520}>
      <Stack>
        <Title padding="sm" align="center">
          Game of Stones Fantasy
        </Title>
        <FantasyAuth />
      </Stack>
    </Container>
  );
}
