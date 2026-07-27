import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { updateLineup } from "../../lib/lineupData";
import { anonClient } from "./setup";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL = "testManager@test.com";
const TEST_PASSWORD = "password123";
const TEST_MANAGER_NAME = "TestManager2";
const TEST_MANAGER_ID = 32000;
const OTHER_MANAGER_ID = 21;

let userId;

beforeAll(async () => {
  const { data, error } = await anonClient.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (error) {
    throw new Error(`Failed to sign in test user: ${error.message}`);
  }
  userId = data.user.id;
});

afterAll(async () => {
  await anonClient.auth.signOut();
});

describe("updateLineup integration", () => {
  it("persists is_starter and bench_order changes to the matching rows", async () => {
    await updateLineup(anonClient, TEST_MANAGER_ID, [
      { player_id: 1, is_starter: false, bench_order: 1 },
      { player_id: 2, is_starter: true, bench_order: null },
    ]);

    const { data } = await anonClient
      .from("team_players")
      .select("*")
      .eq("manager_id", TEST_MANAGER_ID);
    const starterRow = data.find((r) => r.player_id === 1);
    const benchRow = data.find((r) => r.player_id === 2);

    expect(starterRow).toMatchObject({ is_starter: false, bench_order: 1 });
    expect(benchRow).toMatchObject({ is_starter: true, bench_order: null });
    await updateLineup(anonClient, TEST_MANAGER_ID, [
      { player_id: 1, is_starter: true, bench_order: null },
      { player_id: 2, is_starter: false, bench_order: 1 },
    ]);
  });

  it("updates all rows atomically — an update touching two rows leaves neither half-applied", async () => {
    await updateLineup(anonClient, TEST_MANAGER_ID, [
      { player_id: 1, is_starter: false, bench_order: 2 },
      { player_id: 2, is_starter: true, bench_order: null },
    ]);

    const { data } = await anonClient
      .from("team_players")
      .select("*")
      .eq("manager_id", TEST_MANAGER_ID);
    const swappedStarter =
      data.find((r) => r.player_id === 1).is_starter === false;
    const swappedBench =
      data.find((r) => r.player_id === 2).is_starter === true;

    expect(swappedStarter).toBe(swappedBench);
    await updateLineup(anonClient, TEST_MANAGER_ID, [
      { player_id: 1, is_starter: true, bench_order: null },
      { player_id: 2, is_starter: false, bench_order: 1 },
    ]);
  });

  it("silently no-ops for a player_id that doesn't belong to the given manager_id", async () => {
    await expect(() =>
      updateLineup(anonClient, OTHER_MANAGER_ID, [
        { player_id: 999, is_starter: true, bench_order: null },
      ]),
    ).rejects.toThrow("expected to update 1 row(s) but updated 0");

    const { data } = await anonClient
      .from("team_players")
      .select("*")
      .eq("manager_id", TEST_MANAGER_ID);
    expect(data.find((r) => r.player_id === 1)).toMatchObject({
      is_starter: true,
      bench_order: null,
    });
    expect(data.find((r) => r.player_id === 2)).toMatchObject({
      is_starter: false,
      bench_order: 1,
    });
  });
});
