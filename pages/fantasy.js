import {
  Container,
  Title,
  Stack,
  Grid,
  Button,
  Drawer,
  Text,
  Card,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { TeamCard } from "../components/Team/TeamCard";
import { PlayerSearchPanel } from "../components/Team/PlayerSearchPanel";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";

function FantasyPageContent() {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchOpen, setSearchOpen] = useState(false);

  function handleTradeClick() {
    setSearchOpen(true);
    // setViewingPlayer(null);
  }

  const searchPanel = league ? (
    <PlayerSearchPanel
      leagueId={league.id}
      viewingManagerId={manager?.id}
      supabase={supabase}
      onSign={(player) => console.log("sign (stub):", player)}
      onTrade={(player) => console.log("trade for (stub):", player)}
    />
  ) : (
    leagueError && <Text c="red">{leagueError}</Text>
  );

  return (
    <Container fluid align="center" p={0} w="100%">
      <Stack align="center" gap="xs">
        <FantasyAuth />

        {manager && league && isMobile && (
          <Button size="compact-xs" onClick={() => setSearchOpen(true)}>
            Player Search
          </Button>
        )}

        {isMobile ? (
          <TeamCard onTradeClick={isMobile ? handleTradeClick : undefined} />
        ) : (
          <Grid justify="center" gutter="md" w="80%">
            <Grid.Col maw="500px">
              <TeamCard />
            </Grid.Col>
            <Grid.Col maw="400px" h="540px">
              <Card shadow="sm" h="100%" padding="sm" radius="md" withBorder>
                {searchPanel}
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Stack>

      <Drawer
        opened={isMobile && searchOpen}
        onClose={() => setSearchOpen(false)}
        position="right"
        title="Player Search"
        size="90%"
      >
        {searchPanel}
      </Drawer>
    </Container>
  );
}

export default function Fantasy() {
  return (
    <ManagerProvider>
      <FantasyPageContent />
    </ManagerProvider>
  );
}
