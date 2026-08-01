import { createClient } from "@supabase/supabase-js";
import { getBootstrapData } from "../../../api/fantasyService";
import {
  buildGameweekSyncRows,
  buildPlayerSyncRows,
} from "../../../lib/gameweekSync";

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

  const { data: season, error: seasonError } = await supabase
    .from("Season")
    .select("*")
    .eq("is_current", true)
    .single();
  if (seasonError) {
    res.status(500).json({ error: seasonError.message });
    return;
  }

  const gameweekRows = buildGameweekSyncRows(bootstrap, season.id);
  const { error } = await supabase
    .from("Gameweek")
    .upsert(gameweekRows, { onConflict: "season_id,gameweek" });

  const playerRows = buildPlayerSyncRows(bootstrap);
  const { error: playerError } = await supabase
    .from("Player")
    .upsert(playerRows, { onConflict: "id" });
  if (playerError) {
    res.status(500).json({ error: playerError.message });
    return;
  }

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json({
    syncedGameweeks: gameweekRows.length,
    syncedPlayers: playerRows.length,
  });
}
