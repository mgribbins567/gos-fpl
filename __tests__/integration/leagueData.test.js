import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { adminClient } from "./setup";
import {
  getLeaguesForManager,
  getLeagueMatchups,
  getLeagueMatchupsForSeason,
  getManagersByNames,
  getTeamsForManagers,
} from "../../lib/leagueData";

const RUN_ID = `test-${Date.now()}`;

describe("leagueData integration", () => {
  const seasonId = "season-5";
  const leagueId = "a";
  const gw1Id = "season-5-1";
  const gw2Id = "season-5-2";
  const managerAId = 21;
  const managerBId = 6;
  const managerAName = "Matthew";
  const managerBName = "Coop";
  const matchup1Id = "Matthew-Coop-5-1";
  const matchup2Id = "Matthew-Coop-5-2";

  //   beforeEach(async () => {
  //     await adminClient.from("Season").insert({ id: seasonId, is_current: false });
  //     await adminClient
  //       .from("League")
  //       .insert({ id: leagueId, name: `${RUN_ID} League` });
  //     await adminClient.from("Gameweek").insert([
  //       { id: gw1Id, season_id: seasonId, gameweek: 1 },
  //       { id: gw2Id, season_id: seasonId, gameweek: 2 },
  //     ]);
  //     await adminClient.from("Manager").insert([
  //       { id: managerAId, name: managerAName },
  //       { id: managerBId, name: managerBName },
  //     ]);
  //     await adminClient.from("LeagueManager").insert([
  //       { league_id: leagueId, manager_id: managerAId, season_id: seasonId },
  //       { league_id: leagueId, manager_id: managerBId, season_id: seasonId },
  //     ]);
  //     await adminClient.from("Matchup").insert([
  //       {
  //         id: matchup1Id,
  //         gameweek_id: gw1Id,
  //         league_id: leagueId,
  //         manager_1: managerAName,
  //         manager_2: managerBName,
  //         manager_1_score: 41,
  //         manager_2_score: 38,
  //         winner: managerAName,
  //       },
  //       {
  //         id: matchup2Id,
  //         gameweek_id: gw2Id,
  //         league_id: leagueId,
  //         manager_1: managerAName,
  //         manager_2: managerBName,
  //         manager_1_score: null,
  //         manager_2_score: null,
  //         winner: null,
  //       },
  //     ]);
  //     await adminClient.from("team_players").insert([
  //       {
  //         id: `${RUN_ID}-tp-a`,
  //         manager_id: managerAId,
  //         player_id: 101,
  //         is_starter: true,
  //         bench_order: null,
  //         added_via: "draft",
  //       },
  //       {
  //         id: `${RUN_ID}-tp-b`,
  //         manager_id: managerBId,
  //         player_id: 201,
  //         is_starter: true,
  //         bench_order: null,
  //         added_via: "draft",
  //       },
  //     ]);
  //   });

  //   afterEach(async () => {
  //     await adminClient
  //       .from("team_players")
  //       .delete()
  //       .in("manager_id", [managerAId, managerBId]);
  //     await adminClient.from("Matchup").delete().in("id", [matchup1Id, matchup2Id]);
  //     await adminClient.from("LeagueManager").delete().eq("league_id", leagueId);
  //     await adminClient.from("Manager").delete().in("id", [managerAId, managerBId]);
  //     await adminClient.from("Gameweek").delete().in("id", [gw1Id, gw2Id]);
  //     await adminClient.from("League").delete().eq("id", leagueId);
  //     await adminClient.from("Season").delete().eq("id", seasonId);
  //   });

  describe("getLeaguesForManager", () => {
    it("returns the leagues a manager belongs to for the given season", async () => {
      const leagues = await getLeaguesForManager(
        adminClient,
        managerAId,
        seasonId,
      );
      expect(leagues).toHaveLength(1);
      expect(leagues[0].id).toBe(leagueId);
    });

    it("returns an empty array when the manager belongs to no leagues that season", async () => {
      const leagues = await getLeaguesForManager(
        adminClient,
        managerAId,
        "season-0",
      );
      expect(leagues).toEqual([]);
    });
  });

  describe("getLeagueMatchups", () => {
    it("returns only matchups for the given league and gameweek", async () => {
      const matchups = await getLeagueMatchups(adminClient, leagueId, gw1Id);
      expect(matchups).toHaveLength(1);
      expect(matchups[0].id).toBe(matchup1Id);
    });

    it("returns an empty array when no matchups exist for that gameweek", async () => {
      const matchups = await getLeagueMatchups(
        adminClient,
        leagueId,
        "empty-gw",
      );
      expect(matchups).toEqual([]);
    });
  });

  describe("getLeagueMatchupsForSeason", () => {
    it("returns all matchups for the league across the season, annotated with gameweekNumber", async () => {
      const matchups = await getLeagueMatchupsForSeason(
        adminClient,
        leagueId,
        seasonId,
      );
      expect(matchups).toHaveLength(2);
      const byId = Object.fromEntries(matchups.map((m) => [m.id, m]));
      expect(byId[matchup1Id].gameweekNumber).toBe(1);
      expect(byId[matchup2Id].gameweekNumber).toBe(2);
    });
  });

  describe("getManagersByNames", () => {
    it("returns a Map keyed by name for the given manager names", async () => {
      const result = await getManagersByNames(adminClient, [
        managerAName,
        managerBName,
      ]);
      expect(result.get(managerAName).id).toBe(managerAId);
      expect(result.get(managerBName).id).toBe(managerBId);
    });

    it("omits names with no matching manager rather than throwing", async () => {
      const result = await getManagersByNames(adminClient, [
        managerAName,
        "nobody",
      ]);
      expect(result.has(managerAName)).toBe(true);
      expect(result.has("nobody")).toBe(false);
    });
  });

  describe("getTeamsForManagers", () => {
    it("returns a Map of manager_id to their team_players rows, in one query for multiple managers", async () => {
      const result = await getTeamsForManagers(adminClient, [
        managerAId,
        managerBId,
      ]);
      expect(result.get(managerAId)).toHaveLength(15);
      expect(result.get(managerBId)).toHaveLength(15);
      expect(result.get(managerAId)[0].player_id).toBeOneOf([
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
        115,
      ]);
    });

    it("returns a Map without an entry for a manager with no team_players rows", async () => {
      const result = await getTeamsForManagers(adminClient, [
        managerAId,
        managerAId + 999,
      ]);
      expect(result.has(managerAId + 999)).toBe(false);
    });
  });
});
