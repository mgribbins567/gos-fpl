import { describe, it, expect } from "vitest";
import { resolveWaiverClaims } from "../../lib/waiverDisplay";

function makeBootstrap(elements) {
  return { elements };
}

describe("resolveWaiverClaims", () => {
  it("resolves drop/add player ids to their web_name via bootstrap elements", () => {
    const claims = [
      { id: "c1", priority: 1, drop_player_id: 101, add_player_id: 201 },
    ];
    const bootstrap = makeBootstrap([
      { id: 101, web_name: "Salah" },
      { id: 201, web_name: "Haaland" },
    ]);

    expect(resolveWaiverClaims(claims, bootstrap)).toEqual([
      {
        id: "c1",
        priority: 1,
        dropPlayerName: "Salah",
        addPlayerName: "Haaland",
      },
    ]);
  });

  it("falls back to '#<id>' when a player isn't found in bootstrap elements", () => {
    const claims = [
      { id: "c1", priority: 1, drop_player_id: 999, add_player_id: 201 },
    ];
    const bootstrap = makeBootstrap([{ id: 201, web_name: "Haaland" }]);
    expect(resolveWaiverClaims(claims, bootstrap)[0].dropPlayerName).toBe(
      "#999",
    );
  });

  it("returns an empty array for no claims", () => {
    expect(resolveWaiverClaims([], makeBootstrap([]))).toEqual([]);
  });
});
