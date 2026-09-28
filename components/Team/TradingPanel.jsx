import { Tabs, Stack } from "@mantine/core";
import { usePlayerSearch } from "../../hooks/usePlayerSearch";
import { useLeagueManagers } from "../../hooks/useLeagueManagers";
import { PlayerSearchPanel } from "./PlayerSearchPanel";
import { TradeBlockPanel } from "./TradeBlockPanel";
import { WaiverListPanel } from "./WaiverListPanel";

export function TradingPanel({
  leagueId,
  viewingManagerId,
  supabase,
  onSign,
  onTrade,
  signButtonMode,
  waiverClaims,
  waiverError,
  onReorderWaiverClaim,
  onRemoveWaiverClaim,
  activeTab,
  onActiveTabChange,
  showTabSwitcher = true,
}) {
  const {
    results,
    sortKey,
    setSortKey,
    filters,
    setFilters,
    ownershipMap,
    unavailablePlayerIds,
    teamsById,
    enrichedPlayersById,
    error,
  } = usePlayerSearch(leagueId, viewingManagerId, supabase);
  const { data: leagueManagersById } = useLeagueManagers(leagueId, supabase);

  return (
    <Stack gap="xs" h="100%">
      {showTabSwitcher && (
        <Tabs value={activeTab} onChange={onActiveTabChange} size="xs">
          <Tabs.List
            justify="space-between"
            style={{ flexWrap: "nowrap", overflowX: "auto" }}
            grow
          >
            <Tabs.Tab value="playerSearch">Players</Tabs.Tab>
            <Tabs.Tab value="waivers">
              Waivers
              {waiverClaims ? ` (${waiverClaims.length})` : ""}
            </Tabs.Tab>
            <Tabs.Tab value="tradeBlock">Trade Block</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      )}
      {activeTab === "tradeBlock" ? (
        <TradeBlockPanel
          enrichedPlayersById={enrichedPlayersById}
          teamsById={teamsById}
          leagueManagersById={leagueManagersById}
          viewingManagerId={viewingManagerId}
          onTrade={onTrade}
        />
      ) : activeTab === "waivers" ? (
        <WaiverListPanel
          claims={waiverClaims}
          onReorder={onReorderWaiverClaim}
          onRemove={onRemoveWaiverClaim}
        />
      ) : (
        <PlayerSearchPanel
          results={results}
          sortKey={sortKey}
          setSortKey={setSortKey}
          filters={filters}
          setFilters={setFilters}
          ownershipMap={ownershipMap}
          unavailablePlayerIds={unavailablePlayerIds}
          teamsById={teamsById}
          enrichedPlayersById={enrichedPlayersById}
          leagueManagersById={leagueManagersById}
          viewingManagerId={viewingManagerId}
          error={error}
          onSign={onSign}
          onTrade={onTrade}
          signButtonMode={signButtonMode}
          waiverClaims={waiverClaims}
          waiverError={waiverError}
          onReorderWaiverClaim={onReorderWaiverClaim}
          onRemoveWaiverClaim={onRemoveWaiverClaim}
        />
      )}
    </Stack>
  );
}
