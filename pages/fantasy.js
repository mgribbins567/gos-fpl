import { useMemo, useState } from "react";
import {
  Container,
  Title,
  Stack,
  Grid,
  Button,
  Drawer,
  Text,
  Card,
  Modal,
  Alert,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { TeamCard } from "../components/Team/TeamCard";
import { PlayerSearchPanel } from "../components/Team/PlayerSearchPanel";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { useBootstrapStatic } from "../hooks/useFplData";
import { useTransactionGameweeks } from "../hooks/useTransactionGameweeks";
import { useFreeAgentSigning } from "../hooks/useFreeAgentSigning";
import { getActiveGameweekContext } from "../lib/gameweek";
import { POSITION_LABELS } from "../lib/fplData";

function FantasyPageContent() {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: bootstrap } = useBootstrapStatic();
  const context = useMemo(() => {
    if (!bootstrap) return undefined;
    try {
      return getActiveGameweekContext(bootstrap);
    } catch {
      return undefined;
    }
  }, [bootstrap]);

  const { data: txGameweeks } = useTransactionGameweeks(
    bootstrap,
    context,
    supabase,
  );
  const canSignFreeAgents = context?.upcoming?.phase === "free_agency_open";

  const signing = useFreeAgentSigning({
    leagueId: league?.id,
    manager,
    supabase,
    gameweekId: txGameweeks?.gameweekId,
    nextGameweekId: txGameweeks?.nextGameweekId,
    onSigned: () => window.location.reload(),
  });

  function handleTradeClick() {
    setSearchOpen(true);
  }

  function handleSign(player) {
    if (!canSignFreeAgents) return;
    setSearchOpen(false);
    signing.startSigning(player);
  }

  const fieldSelection = signing.isSelecting
    ? {
        elementType: signing.pendingAddPlayer.element_type,
        onSelect: signing.selectDropPlayer,
      }
    : null;

  const searchPanel = league ? (
    <PlayerSearchPanel
      leagueId={league.id}
      viewingManagerId={manager?.id}
      supabase={supabase}
      onSign={handleSign}
      onTrade={(player) => console.log("trade for (stub):", player)}
      signingDisabled={!canSignFreeAgents}
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

        {signing.isSelecting && (
          <Alert variant="outline" maw="70vw" p="xs" color="deep-blue.5">
            <Group justify="center" wrap="wrap" gap={2}>
              Choose who to drop for {signing.pendingAddPlayer.web_name}
              <Button size="compact-xs" onClick={signing.cancel}>
                Cancel
              </Button>
            </Group>
          </Alert>
        )}
        {signing.error && <Text c="red">{signing.error}</Text>}

        {isMobile ? (
          <TeamCard
            onTradeClick={handleTradeClick}
            fieldSelection={fieldSelection}
          />
        ) : (
          <Grid justify="center" gutter="md" w="80%">
            <Grid.Col maw="500px">
              <TeamCard
                onTradeClick={handleTradeClick}
                fieldSelection={fieldSelection}
              />
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

      <Modal
        opened={signing.isConfirming}
        onClose={signing.cancel}
        title="Confirm Signing"
        centered
      >
        {signing.pendingAddPlayer && signing.pendingDropPlayer && (
          <Stack gap="sm">
            <Text>
              Player in: <b>{signing.pendingAddPlayer.web_name}</b> (
              {POSITION_LABELS[signing.pendingAddPlayer.element_type]})
            </Text>
            <Text>
              Player out: <b>{signing.pendingDropPlayer.name}</b> (
              {POSITION_LABELS[signing.pendingAddPlayer.element_type]})
            </Text>
            <Group grow>
              <Button
                variant="default"
                onClick={signing.cancel}
                disabled={signing.submitting}
              >
                Cancel
              </Button>
              <Button onClick={signing.confirm} loading={signing.submitting}>
                Confirm
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
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
