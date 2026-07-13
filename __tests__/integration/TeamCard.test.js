import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { adminClient, createTestManager, cleanupTestManager } from "./setup";
import { getTeam } from "../../components/Team/TeamCard";

let testUserId;
let testManager;

function getMockTeam(userId) {
  return [
    {
      id: "00000000-0000-0000-0000-000000000000",
      manager_id: userId,
      player_id: 50,
      is_starter: true,
      bench_order: null,
      added_at: "2026-07-06 03:49:16.019597+00",
      added_via: "draft",
    },
    {
      id: "00000000-0000-0000-0000-000000000001",
      manager_id: userId,
      player_id: 51,
      is_starter: true,
      bench_order: null,
      added_at: "2026-07-06 03:52:16.019597+00",
      added_via: "draft",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      manager_id: userId,
      player_id: 52,
      is_starter: false,
      bench_order: null,
      added_at: "2026-07-06 03:55:16.019597+00",
      added_via: "draft",
    },
  ];
}

beforeAll(async () => {
  const { userId, manager } = await createTestManager(
    "teamcard-test@test.com",
    "IntegrationTestManager",
  );
  testUserId = userId;
  testManager = manager;

  const { error } = await adminClient
    .from("team_players")
    .insert(getMockTeam(testManager.id));
  if (error) throw new Error(`Team seed failed: ${error.message}`);
});

afterAll(async () => {
  await cleanupTestManager(testUserId, testManager.id);
});

describe("getTeam integration", () => {
  it("returns null when manager is null", async () => {
    const result = await getTeam(null, adminClient);
    expect(result).toBeNull();
  });

  it("returns team players for a valid manager", async () => {
    const result = await getTeam(testManager, adminClient);

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ player_id: 50, is_starter: true }),
        expect.objectContaining({ player_id: 51, is_starter: true }),
        expect.objectContaining({ player_id: 52, is_starter: false }),
      ]),
    );
  });

  it("returns empty array for manager with no players", async () => {
    const { data: emptyManager, error } = await adminClient
      .from("Manager")
      .insert({ name: "EmptyManager" })
      .select()
      .single();
    if (error) throw new Error(`Empty manager seed failed: ${error.message}`);

    const result = await getTeam(emptyManager, adminClient);
    expect(result).toEqual([]);

    await adminClient.from("Manager").delete().eq("id", emptyManager.id);
  });

  it("only returns players belonging to the queried manager", async () => {
    const result = await getTeam(testManager, adminClient);
    result.forEach((player) => {
      expect(player.manager_id).toBe(testManager.id);
    });
  });
});
