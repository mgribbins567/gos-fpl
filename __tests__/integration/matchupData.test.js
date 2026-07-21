import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { adminClient, createTestManager, cleanupTestManager } from "./setup";
import {
  getCurrentSeason,
  getGameweekByNumber,
  getManagerByName,
  getMatchupForManager,
} from "../../lib/matchupData";

const RUN_ID = `test-${Date.now()}`;
const TEST_SEASON_ID = "season-5";
const TEST_GAMEWEEK_NUMBER = 1;
const TEST_GAMEWEEK_ID = "season-5-1";

describe("matchupData integration", () => {
  describe("getCurrentSeason", () => {
    it("returns the season flagged is_current", async () => {
      const season = await getCurrentSeason(adminClient);
      expect(season.id).toBe(TEST_SEASON_ID);
    });
  });

  describe("getGameweekByNumber", () => {
    it("returns the gameweek row matching season_id and gameweek number", async () => {
      const gameweek = await getGameweekByNumber(
        adminClient,
        TEST_SEASON_ID,
        1,
      );
      expect(gameweek.id).toBe(TEST_GAMEWEEK_ID);
    });

    it("throws when no gameweek matches", async () => {
      await expect(
        getGameweekByNumber(adminClient, TEST_SEASON_ID, 999),
      ).rejects.toThrow();
    });
  });

  describe("getManagerByName", () => {
    const managerName = "Matthew";
    const managerId = 21;

    it("returns the manager row matching the given name", async () => {
      const manager = await getManagerByName(adminClient, managerName);
      expect(manager.id).toBe(managerId);
    });

    it("throws when no manager matches the given name", async () => {
      await expect(getManagerByName(adminClient, `nobody`)).rejects.toThrow();
    });
  });

  describe("getMatchupForManager", () => {
    const gameweekId = "season-5-3";
    const managerA = "Matthew";
    const managerB = "Coop";
    const matchupId = "Matthew-Coop-1-1";

    it("finds the matchup when the manager is manager_1", async () => {
      const matchup = await getMatchupForManager(
        adminClient,
        TEST_GAMEWEEK_ID,
        managerA,
      );
      expect(matchup.id).toBe(matchupId);
    });

    it("finds the matchup when the manager is manager_2", async () => {
      const matchup = await getMatchupForManager(
        adminClient,
        TEST_GAMEWEEK_ID,
        managerB,
      );
      expect(matchup.id).toBe(matchupId);
    });

    it("returns null when the manager has no matchup that gameweek (bye week)", async () => {
      const matchup = await getMatchupForManager(
        adminClient,
        gameweekId,
        `nobody`,
      );
      expect(matchup).toBeNull();
    });
  });
});
