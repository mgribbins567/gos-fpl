import { createClient } from "@supabase/supabase-js";
import { getBootstrapData, getLiveData } from "../../../api/fantasyService";
import {
  getCurrentSeason,
  getGameweekByNumber,
} from "../../../lib/matchupData";
import { getManagersByNames } from "../../../lib/leagueData";
import { getGameweekLineupsForManagers } from "../../../lib/teamHistory";
import {
  mergeTeamWithLiveData,
  getTotalStartingPoints,
} from "../../../lib/fplData";
import { buildFinalizedMatchupUpdates } from "../../../lib/matchupFinalization";
import {
  applyAutoSubstitutions,
  buildAutoSubUpdates,
} from "../../../lib/lineup";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const bootstrap = await getBootstrapData();
  const checkedEvents = bootstrap.events.filter((e) => e.data_checked);
  const season = await getCurrentSeason(supabase);

  const results = {};

  for (const event of checkedEvents) {
    let gameweekRow;
    try {
      gameweekRow = await getGameweekByNumber(supabase, season.id, event.id);
    } catch {
      continue;
    }
    if (gameweekRow.scores_finalized) continue;

    try {
      const { data: matchups, error: matchupsError } = await supabase
        .from("Matchup")
        .select("*")
        .eq("gameweek_id", gameweekRow.id);
      if (matchupsError) throw new Error(matchupsError.message);

      if (matchups.length === 0) {
        await supabase
          .from("Gameweek")
          .update({ scores_finalized: true })
          .eq("id", gameweekRow.id);
        results[event.id] = "no matchups to finalize";
        continue;
      }

      const managerNames = [
        ...new Set(matchups.flatMap((m) => [m.manager_1, m.manager_2])),
      ];
      const managersByName = await getManagersByNames(supabase, managerNames);
      const managerIds = [...managersByName.values()].map((m) => m.id);

      const live = await getLiveData(event.id);
      const lineupsByManagerId = await getGameweekLineupsForManagers(
        supabase,
        managerIds,
        gameweekRow.id,
      );

      const scoreByManagerName = new Map();
      for (const name of managerNames) {
        const manager = managersByName.get(name);
        if (!manager)
          throw new Error(
            `Manager "${name}" referenced in Matchup not found in Manager table`,
          );
        const rows = lineupsByManagerId.get(manager.id) ?? [];
        const merged = mergeTeamWithLiveData(rows, bootstrap, live);
        const { players, subbedInPlayerIds } = applyAutoSubstitutions(merged);
        scoreByManagerName.set(name, getTotalStartingPoints(players));

        const lineupUpdates = buildAutoSubUpdates(
          rows,
          players,
          subbedInPlayerIds,
        );
        for (const update of lineupUpdates) {
          const { error: lineupUpdateError } = await supabase
            .from("GameweekLineup")
            .update({
              is_starter: update.is_starter,
              bench_order: update.bench_order,
              was_auto_subbed: update.was_auto_subbed,
            })
            .eq("manager_id", manager.id)
            .eq("gameweek_id", gameweekRow.id)
            .eq("player_id", update.player_id);
          if (lineupUpdateError) throw new Error(lineupUpdateError.message);
        }
      }

      const updates = buildFinalizedMatchupUpdates(
        matchups,
        scoreByManagerName,
      );
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from("Matchup")
          .update({
            manager_1_score: update.manager_1_score,
            manager_2_score: update.manager_2_score,
            winner: update.winner,
          })
          .eq("id", update.id);
        if (updateError) throw new Error(updateError.message);
      }

      await supabase
        .from("Gameweek")
        .update({ scores_finalized: true })
        .eq("id", gameweekRow.id);
      results[event.id] = `finalized ${updates.length} matchups`;
    } catch (err) {
      results[event.id] = `error: ${err.message}`;
    }
  }

  res.status(200).json({ results });
}
