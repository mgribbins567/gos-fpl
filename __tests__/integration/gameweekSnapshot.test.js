import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { adminClient } from "./setup";

const RUN_ID = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

describe("snapshot_locked_gameweeks integration", () => {
  const seasonId = `${RUN_ID}-season`;
  const pastGwId = `${RUN_ID}-past-gw`;
  const futureGwId = `${RUN_ID}-future-gw`;
  const managerId = 300 + Math.floor(Math.random() * 100);

  beforeEach(async () => {
    await adminClient
      .from("Season")
      .insert({ id: seasonId, is_current: false, year: 3000 });
    await adminClient
      .from("Manager")
      .insert({ name: "TestManager-" + managerId, id: managerId });
    await adminClient.from("Gameweek").insert([
      {
        id: pastGwId,
        season_id: seasonId,
        gameweek: 6,
        deadline_time: new Date(Date.now() - 60_000).toISOString(),
        finished: true,
      },
      {
        id: futureGwId,
        season_id: seasonId,
        gameweek: 7,
        deadline_time: new Date(Date.now() + 86_400_000).toISOString(),
        finished: false,
      },
    ]);
    await adminClient.from("team_players").insert({
      manager_id: managerId,
      player_id: 101,
      is_starter: true,
      bench_order: null,
      added_via: "draft",
    });
  });

  afterEach(async () => {
    await adminClient
      .from("GameweekLineup")
      .delete()
      .in("gameweek_id", [pastGwId, futureGwId]);
    await adminClient.from("team_players").delete().eq("manager_id", managerId);
    await adminClient
      .from("Gameweek")
      .delete()
      .in("id", [pastGwId, futureGwId]);
    await adminClient.from("Manager").delete().eq("id", managerId);
    await adminClient.from("Season").delete().eq("id", seasonId);
  });

  it("snapshots team_players into GameweekLineup for a gameweek whose deadline has passed", async () => {
    const { error } = await adminClient.rpc("snapshot_locked_gameweeks");
    expect(error).toBeNull();

    const { data } = await adminClient
      .from("GameweekLineup")
      .select("*")
      .eq("gameweek_id", pastGwId);
    console.log("data: ", data);
    expect(
      data.find((r) => r.manager_id === managerId && r.player_id === 101),
    ).toMatchObject({ is_starter: true });
  });

  it("does not snapshot a gameweek whose deadline hasn't passed yet", async () => {
    await adminClient.rpc("snapshot_locked_gameweeks");
    const { data } = await adminClient
      .from("GameweekLineup")
      .select("*")
      .eq("gameweek_id", futureGwId);
    expect(data.find((r) => r.manager_id === managerId)).toBeUndefined();
  });

  it("is idempotent — running it twice does not create a duplicate row for this manager/gameweek/player", async () => {
    await adminClient.rpc("snapshot_locked_gameweeks");
    await adminClient.rpc("snapshot_locked_gameweeks");

    const { data } = await adminClient
      .from("GameweekLineup")
      .select("*")
      .eq("gameweek_id", pastGwId);
    const matchesForThisPlayer = data.filter(
      (r) => r.manager_id === managerId && r.player_id === 101,
    );
    expect(matchesForThisPlayer).toHaveLength(1);
  });

  it("does not snapshot a gameweek with no deadline_time set", async () => {
    await adminClient
      .from("Gameweek")
      .update({ deadline_time: null })
      .eq("id", pastGwId);
    await adminClient.rpc("snapshot_locked_gameweeks");

    const { data } = await adminClient
      .from("GameweekLineup")
      .select("*")
      .eq("gameweek_id", pastGwId);
    expect(data.find((r) => r.manager_id === managerId)).toBeUndefined();
  });
});
