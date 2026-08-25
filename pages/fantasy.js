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
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ManagerProvider, useManager } from "../contexts/ManagerContext";
import { PlayerDetailProvider } from "../contexts/PlayerDetailContext";
import { FantasyAuth } from "../components/Auth/FantasyAuth";
import { TeamCard } from "../components/Team/TeamCard";
import { PlayerDetailModal } from "../components/Team/PlayerDetailModal";
import { PlayerSearchPanel } from "../components/Team/PlayerSearchPanel";
import { TradeBuilderCard } from "../components/Team/TradeBuilderCard";
import { TradeApprovalQueue } from "../components/Team/TradeApprovalQueue";
import { WaiverListPanel } from "../components/Team/WaiverListPanel";
import { GameweekStatusCard } from "../components/Team/GameweekStatusCard";
import { TransactionHistoryPanel } from "../components/Team/TransactionHistory";
import { useSingleLeagueForManager } from "../hooks/useSingleLeagueForManager";
import { useBootstrapStatic } from "../hooks/useFplData";
import { useTransactionGameweeks } from "../hooks/useTransactionGameweeks";
import { useLeagueManagers } from "../hooks/useLeagueManagers";
import { useFreeAgentSigning } from "../hooks/useFreeAgentSigning";
import { getActiveGameweekContext } from "../lib/gameweek";
import { useTradeBuilder } from "../hooks/useTradeBuilder";
import { useIncomingTrades } from "../hooks/useIncomingTrades";
import { useAdminTradeQueue } from "../hooks/useAdminTradeQueue";
import { useWaiverList } from "../hooks/useWaiverList";
import { useWaiverClaimBuilder } from "../hooks/useWaiverClaimBuilder";
import {
  respondToTradeAsReceiver,
  respondToTradeAsAdmin,
} from "../lib/tradeData";
import { useWaiverPriority } from "../hooks/useWaiverPriority";
import { isAdmin, ADMIN_MANAGER_ID } from "../lib/tradeLogic";
import { POSITION_LABELS } from "../lib/fplData";

function FantasyPageContent() {
  const { manager, supabase } = useManager();
  const { data: league, error: leagueError } = useSingleLeagueForManager(
    manager,
    supabase,
  );
  const { data: leagueManagersById } = useLeagueManagers(league, supabase);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState(null);

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
  const upcomingPhase = context?.upcoming?.phase;
  const signButtonMode =
    upcomingPhase === "waivers_open"
      ? "waiver"
      : upcomingPhase === "free_agency_open"
        ? "free_agent"
        : "closed";
  const isAdminUser = manager ? isAdmin(manager.id) : false;

  const signing = useFreeAgentSigning({
    leagueId: league?.id,
    manager,
    supabase,
    gameweekId: txGameweeks?.gameweekId,
    nextGameweekId: txGameweeks?.nextGameweekId,
    onSigned: () => window.location.reload(),
  });

  const builder = useTradeBuilder({
    leagueId: league?.id,
    manager,
    supabase,
    gameweekId: txGameweeks?.gameweekId,
    onProposed: () => window.location.reload(),
  });

  const waiverList = useWaiverList(
    manager,
    league?.id,
    txGameweeks?.gameweekId,
    supabase,
    bootstrap,
  );
  const waiverBuilder = useWaiverClaimBuilder({
    leagueId: league?.id,
    manager,
    supabase,
    gameweekId: txGameweeks?.gameweekId,
    onSubmitted: () => waiverList.refresh(),
  });
  const { data: waiverPriority } = useWaiverPriority(
    league?.id,
    manager?.id,
    supabase,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const incomingTrades = useIncomingTrades(
    manager,
    supabase,
    bootstrap,
    leagueManagersById,
    refreshKey,
  );
  const adminTrades = useAdminTradeQueue(
    isAdminUser,
    supabase,
    bootstrap,
    refreshKey,
  );

  async function handleReceiverRespond(tradeId, accept) {
    await respondToTradeAsReceiver(supabase, tradeId, accept);
    window.location.reload();
  }
  async function handleAdminRespond(tradeId, accept) {
    await respondToTradeAsAdmin(supabase, tradeId, accept, ADMIN_MANAGER_ID);
    window.location.reload();
  }

  function handleTradeClick() {
    setSearchOpen(true);
  }

  function handleSign(player) {
    if (upcomingPhase === "waivers_open") {
      setSearchOpen(false);
      waiverBuilder.startClaim(player);
    } else if (upcomingPhase === "free_agency_open") {
      setSearchOpen(false);
      signing.startSigning(player);
    }
  }

  function handleTrade(player, ownerId) {
    setSearchOpen(false);
    builder.startWithTarget(ownerId, player);
  }

  function handleAddTradePlayer(player) {
    setSearchOpen(false);
    builder.addAnotherReceiverPlayer(player);
  }

  const fieldSelection = signing.isSelecting
    ? {
        elementType: signing.pendingAddPlayer.element_type,
        onSelect: (p) => {
          signing.selectDropPlayer(p);
          setSearchOpen(true);
        },
      }
    : waiverBuilder.isSelecting
      ? {
          elementType: waiverBuilder.pendingAddPlayer.element_type,
          onSelect: (p) => {
            waiverBuilder.selectDropPlayer(p);
            setSearchOpen(true);
          },
        }
      : builder.isSelectingProposerPlayer
        ? {
            elementType: builder.pendingReceiverPlayer.element_type,
            onSelect: (p) => {
              builder.selectProposerPlayer(p);
              setSearchOpen(true);
            },
          }
        : null;

  const searchPanel = league ? (
    <>
      <PlayerSearchPanel
        leagueId={league.id}
        viewingManagerId={manager?.id}
        supabase={supabase}
        onSign={handleSign}
        onTrade={handleTrade}
        onPlayerClick={setViewingPlayer}
        signButtonMode={signButtonMode}
        waiverClaims={waiverList.claims}
        waiverError={waiverList.error}
        onReorderWaiverClaim={waiverList.reorder}
        onRemoveWaiverClaim={waiverList.remove}
      />
      <PlayerDetailModal
        player={viewingPlayer}
        opened={!!viewingPlayer}
        onClose={() => setViewingPlayer(null)}
        canEdit={false}
        supabase={supabase}
      />
    </>
  ) : (
    leagueError && <Text c="red">{leagueError}</Text>
  );

  return (
    <Container fluid align="center" p={0} w="100%">
      <Stack align="center" gap="xs">
        <FantasyAuth />
        {context && (
          <GameweekStatusCard
            context={context}
            waiverPriority={waiverPriority?.priority}
            totalManagers={waiverPriority?.totalManagers}
          />
        )}
        {manager && league && isMobile && (
          <Button size="compact-xs" onClick={() => setSearchOpen(true)}>
            {builder.isActive ? "Trade Builder" : "Make Transfers"}
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

        {waiverBuilder.isSelecting && (
          <Alert variant="outline" maw="70vw" p="xs" color="deep-blue.5">
            <Group justify="center" wrap="wrap" gap={2}>
              Choose who to drop for {waiverBuilder.pendingAddPlayer.web_name}
              <Button size="compact-xs" onClick={waiverBuilder.cancel}>
                Cancel
              </Button>
              {waiverBuilder.submitting && (
                <Text size="xs" c="dimmed">
                  Adding claim...
                </Text>
              )}
            </Group>
          </Alert>
        )}
        {waiverBuilder.error && <Text c="red">{waiverBuilder.error}</Text>}

        {builder.isSelectingProposerPlayer && (
          <Alert variant="outline" maw="70vw" p="xs" color="deep-blue.5">
            <Group justify="center" wrap="wrap" gap={2}>
              Choose who to trade for {builder.pendingReceiverPlayer.web_name}
              <Button
                size="compact-xs"
                onClick={builder.cancelPendingSelection}
              >
                Cancel
              </Button>
            </Group>
          </Alert>
        )}
        {builder.error && <Text c="red">{builder.error}</Text>}

        <TradeApprovalQueue
          title="Incoming Trade Offers"
          trades={incomingTrades.data}
          showLeagueName={false}
          onRespond={async (id, accept) => {
            await handleReceiverRespond(id, accept);
          }}
        />
        {isAdminUser && (
          <TradeApprovalQueue
            title="Pending Admin Approvals"
            trades={adminTrades.data}
            showLeagueName={true}
            onRespond={async (id, accept) => {
              await handleAdminRespond(id, accept);
            }}
          />
        )}

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
              {builder.isActive ? (
                <TradeBuilderCard
                  builder={builder}
                  leagueId={league?.id}
                  supabase={supabase}
                  bootstrap={bootstrap}
                  receivingManagerName={
                    leagueManagersById?.get(builder.receivingManagerId)?.name ??
                    "..."
                  }
                  onAddPlayer={handleAddTradePlayer}
                />
              ) : (
                searchPanel
              )}
            </Grid.Col>
          </Grid>
        )}
        <TransactionHistoryPanel
          manager={manager}
          supabase={supabase}
          bootstrap={bootstrap}
          defaultGameweekId={txGameweeks?.gameweekId}
          defaultLeagueId={league?.id}
        />
      </Stack>

      <Drawer
        opened={isMobile && searchOpen}
        onClose={() => setSearchOpen(false)}
        position="right"
        title="Player Search"
        size="90%"
      >
        {builder.isActive ? (
          <TradeBuilderCard
            builder={builder}
            leagueId={league?.id}
            supabase={supabase}
            bootstrap={bootstrap}
            receivingManagerName={
              leagueManagersById?.get(builder.receivingManagerId)?.name ?? "..."
            }
            onAddPlayer={handleAddTradePlayer}
          />
        ) : (
          searchPanel
        )}
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

      <Modal
        opened={builder.confirming}
        onClose={builder.closeConfirm}
        title="Confirm Trade"
        centered
      >
        <Stack gap="sm" ta="center">
          {builder.pairings.map((p) => (
            <Text key={p.proposerPlayerId} size="sm">
              <b>{p.proposerPlayerName}</b> ↔ <b>{p.receiverPlayerName}</b>
            </Text>
          ))}
          <Group grow>
            <Button
              variant="default"
              onClick={builder.closeConfirm}
              disabled={builder.submitting}
            >
              Cancel
            </Button>
            <Button onClick={builder.send} loading={builder.submitting}>
              Send Offer
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default function Fantasy() {
  return (
    <ManagerProvider>
      <PlayerDetailProvider>
        <FantasyPageContent />
      </PlayerDetailProvider>
    </ManagerProvider>
  );
}
