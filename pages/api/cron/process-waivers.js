import { createClient } from "@supabase/supabase-js";
import {
  getLeagueMatchupsForSeason,
  getManagersInLeague,
} from "../../../lib/leagueData";
import { computeStandings } from "../../../lib/leagueLogic";
import {
  buildWaiverProcessingOrder,
  groupClaimsByManager,
  processWaivers,
  filterGameweeksDueForProcessing,
} from "../../../lib/waiverProcessing";

export default async function handler(req, res) {
  //   if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //     res.status(401).json({ error: "Unauthorized" });
  //     return;
  //   }

  const received = req.headers.authorization;
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (received !== expected) {
    res.status(401).json({
      error: "Unauthorized",
      receivedLength: received?.length ?? 0,
      expectedLength: expected.length,
      receivedPreview: received
        ? `${received.slice(0, 10)}...${received.slice(-4)}`
        : null,
      expectedPreview: `${expected.slice(0, 10)}...${expected.slice(-4)}`,
    });
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data: pendingRows, error: pendingError } = await supabase
    .from("WaiverClaim")
    .select("gameweek_id")
    .eq("status", "pending");
  if (pendingError) {
    res.status(500).json({ error: pendingError.message });
    return;
  }

  const distinctGameweekIds = [
    ...new Set(pendingRows.map((r) => r.gameweek_id)),
  ];
  if (distinctGameweekIds.length === 0) {
    res
      .status(200)
      .json({ processed: {}, message: "No pending waiver claims" });
    return;
  }

  const { data: gameweeks, error: gwError } = await supabase
    .from("Gameweek")
    .select("*")
    .in("id", distinctGameweekIds);
  if (gwError) {
    res.status(500).json({ error: gwError.message });
    return;
  }

  const dueGameweeks = filterGameweeksDueForProcessing(gameweeks);

  const processed = {};
  for (const gameweek of dueGameweeks) {
    const { data: nextGameweek, error: nextGwError } = await supabase
      .from("Gameweek")
      .select("*")
      .eq("season_id", gameweek.season_id)
      .eq("gameweek", gameweek.gameweek + 1)
      .maybeSingle();
    if (nextGwError) {
      res.status(500).json({ error: nextGwError.message });
      return;
    }

    const { data: leagueRows, error: leaguesError } = await supabase
      .from("WaiverClaim")
      .select("league_id")
      .eq("gameweek_id", gameweek.id)
      .eq("status", "pending");
    if (leaguesError) {
      res.status(500).json({ error: leaguesError.message });
      return;
    }
    const leagueIds = [...new Set(leagueRows.map((r) => r.league_id))];

    for (const leagueId of leagueIds) {
      const { data: claims, error: claimsError } = await supabase
        .from("WaiverClaim")
        .select("*")
        .eq("league_id", leagueId)
        .eq("gameweek_id", gameweek.id)
        .eq("status", "pending")
        .order("priority", { ascending: true });
      if (claimsError) {
        res.status(500).json({ error: claimsError.message });
        return;
      }

      const matchups = await getLeagueMatchupsForSeason(
        supabase,
        leagueId,
        gameweek.season_id,
      );
      const standings = computeStandings(matchups);
      const managersInLeague = await getManagersInLeague(
        supabase,
        leagueId,
        gameweek.season_id,
      );

      const order = buildWaiverProcessingOrder(
        claims,
        standings,
        managersInLeague,
      );
      const claimsByManagerId = groupClaimsByManager(claims);

      const attemptClaim = async (claim) => {
        const { data, error } = await supabase.rpc("process_waiver_claim", {
          p_claim_id: claim.id,
          p_gameweek_id: gameweek.id,
          p_next_gameweek_id: nextGameweek?.id ?? gameweek.id,
        });
        if (error) throw new Error(error.message);
        return data;
      };

      processed[`${gameweek.id}:${leagueId}`] = await processWaivers(
        claimsByManagerId,
        order,
        attemptClaim,
      );
    }
  }

  res.status(200).json({ processed });
}
