import { createClient } from "@supabase/supabase-js";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { anonClient, createTestManager, cleanupTestManager } from "./setup";
import {
  getGameweekLineup,
  getEarliestRecordedGameweekNumber,
} from "../../lib/teamHistory";

const adminClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
);
const RUN_ID = `test-${Date.now()}`;

describe("teamHistory integration", () => {
  const seasonId = "season-5";
  const gw1Id = "season-5-1";
  const gw2Id = "season-5-2";
  const managerId = 32000;

  describe("getGameweekLineup", () => {
    it("returns recorded lineup rows for a manager and gameweek, readable by an ordinary client", async () => {
      const rows = await getGameweekLineup(anonClient, managerId, gw1Id);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({ player_id: 1, is_starter: true });
    });

    it("returns an empty array when no lineup was recorded for that gameweek", async () => {
      const rows = await getGameweekLineup(
        anonClient,
        managerId,
        `${RUN_ID}-no-such-gw`,
      );
      expect(rows).toEqual([]);
    });
  });

  describe("getEarliestRecordedGameweekNumber", () => {
    it("returns the lowest gameweek number with a recorded lineup for that manager and season", async () => {
      expect(
        await getEarliestRecordedGameweekNumber(
          anonClient,
          managerId,
          seasonId,
        ),
      ).toBe(1);
    });

    it("returns null when the manager has no recorded history for that season", async () => {
      expect(
        await getEarliestRecordedGameweekNumber(
          anonClient,
          managerId + 1,
          seasonId,
        ),
      ).toBeNull();
    });
  });
});
