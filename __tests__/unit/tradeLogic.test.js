import { describe, it, expect } from "vitest";
import {
  isAdmin,
  ADMIN_MANAGER_ID,
  buildResolvedTrades,
} from "../../lib/tradeLogic";

describe("isAdmin", () => {
  it("returns true for the admin manager id", () => {
    expect(isAdmin(ADMIN_MANAGER_ID)).toBe(true);
  });
  it("returns false for any other manager id", () => {
    expect(isAdmin(ADMIN_MANAGER_ID + 1)).toBe(false);
  });
});

describe("buildResolvedTrades", () => {
  function makeBootstrap(elements) {
    return { elements };
  }

  it("resolves manager names, league name, and player names for a trade and its pairings", () => {
    const trades = [
      {
        id: "t1",
        league_id: "L1",
        proposing_manager_id: 1,
        receiving_manager_id: 2,
      },
    ];
    const pairings = [
      {
        id: "p1",
        trade_id: "t1",
        proposer_player_id: 101,
        receiver_player_id: 201,
      },
    ];
    const bootstrap = makeBootstrap([
      { id: 101, web_name: "Salah" },
      { id: 201, web_name: "Haaland" },
    ]);
    const managersById = new Map([
      [1, { id: 1, name: "Matthew" }],
      [2, { id: 2, name: "Andrew" }],
    ]);
    const leaguesById = new Map([["L1", { id: "L1", name: "The League" }]]);

    expect(
      buildResolvedTrades(
        trades,
        pairings,
        bootstrap,
        managersById,
        leaguesById,
      ),
    ).toEqual([
      {
        id: "t1",
        leagueName: "The League",
        proposingManagerName: "Matthew",
        receivingManagerName: "Andrew",
        pairings: [
          {
            id: "p1",
            proposerPlayerName: "Salah",
            receiverPlayerName: "Haaland",
          },
        ],
      },
    ]);
  });

  it("only includes pairings belonging to the given trade, when multiple trades are resolved together", () => {
    const trades = [
      {
        id: "t1",
        league_id: "L1",
        proposing_manager_id: 1,
        receiving_manager_id: 2,
      },
      {
        id: "t2",
        league_id: "L1",
        proposing_manager_id: 1,
        receiving_manager_id: 3,
      },
    ];
    const pairings = [
      {
        id: "p1",
        trade_id: "t1",
        proposer_player_id: 101,
        receiver_player_id: 201,
      },
      {
        id: "p2",
        trade_id: "t2",
        proposer_player_id: 102,
        receiver_player_id: 202,
      },
    ];
    const bootstrap = makeBootstrap([
      { id: 101, web_name: "A" },
      { id: 102, web_name: "B" },
      { id: 201, web_name: "C" },
      { id: 202, web_name: "D" },
    ]);
    const managersById = new Map([
      [1, { id: 1, name: "M1" }],
      [2, { id: 2, name: "M2" }],
      [3, { id: 3, name: "M3" }],
    ]);
    const leaguesById = new Map([["L1", { id: "L1", name: "L" }]]);

    const result = buildResolvedTrades(
      trades,
      pairings,
      bootstrap,
      managersById,
      leaguesById,
    );

    expect(result.find((t) => t.id === "t1").pairings).toEqual([
      { id: "p1", proposerPlayerName: "A", receiverPlayerName: "C" },
    ]);
    expect(result.find((t) => t.id === "t2").pairings).toEqual([
      { id: "p2", proposerPlayerName: "B", receiverPlayerName: "D" },
    ]);
  });

  it("falls back to the raw league_id when leaguesById isn't provided (admin-only param)", () => {
    const trades = [
      {
        id: "t1",
        league_id: "L1",
        proposing_manager_id: 1,
        receiving_manager_id: 2,
      },
    ];
    const managersById = new Map([
      [1, { id: 1, name: "Matthew" }],
      [2, { id: 2, name: "Andrew" }],
    ]);
    expect(
      buildResolvedTrades(
        trades,
        [],
        makeBootstrap([]),
        managersById,
        undefined,
      )[0].leagueName,
    ).toBe("L1");
  });

  it("falls back to 'Manager <id>' when a manager isn't found in managersById", () => {
    const trades = [
      {
        id: "t1",
        league_id: "L1",
        proposing_manager_id: 999,
        receiving_manager_id: 2,
      },
    ];
    const managersById = new Map([[2, { id: 2, name: "Andrew" }]]);
    const leaguesById = new Map([["L1", { id: "L1", name: "L" }]]);
    expect(
      buildResolvedTrades(
        trades,
        [],
        makeBootstrap([]),
        managersById,
        leaguesById,
      )[0].proposingManagerName,
    ).toBe("Manager 999");
  });
});
