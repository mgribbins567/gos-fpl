import { describe, it, expect } from "vitest";
import {
  getForwardStates,
  getNavigationState,
  getPreviousViewedGameweek,
  getNextViewedGameweek,
} from "../../lib/gameweekNavigation";

describe("getForwardStates", () => {
  it("returns an empty array when context is undefined", () => {
    expect(getForwardStates(undefined)).toEqual([]);
  });

  it("returns [current] for live mode with no upcoming gameweek (true season-end edge case)", () => {
    const context = { mode: "live", event: { id: 5 }, upcoming: null };
    expect(getForwardStates(context)).toEqual([
      { gameweekNumber: 5, kind: "current" },
    ]);
  });

  it("returns [current, upcoming] for live mode with an upcoming gameweek", () => {
    const context = {
      mode: "live",
      event: { id: 5 },
      upcoming: { event: { id: 6 } },
    };
    expect(getForwardStates(context)).toEqual([
      { gameweekNumber: 5, kind: "current" },
      { gameweekNumber: 6, kind: "upcoming" },
    ]);
  });

  it("returns [upcoming] for between mode", () => {
    const context = {
      mode: "between",
      previousEvent: { id: 4 },
      upcoming: { event: { id: 5 } },
    };
    expect(getForwardStates(context)).toEqual([
      { gameweekNumber: 5, kind: "upcoming" },
    ]);
  });

  it("returns an empty array for between mode with no upcoming gameweek (true season-end edge case)", () => {
    const context = {
      mode: "between",
      previousEvent: { id: 38 },
      upcoming: null,
    };
    expect(getForwardStates(context)).toEqual([]);
  });
});

describe("getNavigationState", () => {
  const liveWithUpcoming = [
    { gameweekNumber: 5, kind: "current" },
    { gameweekNumber: 6, kind: "upcoming" },
  ];
  const betweenOnly = [{ gameweekNumber: 5, kind: "upcoming" }];

  it("defaults to the first forward state when viewedGameweek is null", () => {
    const state = getNavigationState(null, liveWithUpcoming, 1);
    expect(state).toMatchObject({
      displayedGameweekNumber: 5,
      kind: "current",
    });
  });

  it("returns undefined displayedGameweekNumber when there is no default and nothing is being viewed", () => {
    const state = getNavigationState(null, [], null);
    expect(state).toMatchObject({
      displayedGameweekNumber: undefined,
      kind: undefined,
      canGoBack: false,
      canGoForward: false,
    });
  });

  describe("the 'current' state (live gameweek, index 0)", () => {
    it("allows going forward to 'upcoming' when one exists", () => {
      const state = getNavigationState(5, liveWithUpcoming, null);
      expect(state.kind).toBe("current");
      expect(state.canGoForward).toBe(true);
    });

    it("disallows going forward when no upcoming gameweek exists", () => {
      const state = getNavigationState(
        5,
        [{ gameweekNumber: 5, kind: "current" }],
        null,
      );
      expect(state.canGoForward).toBe(false);
    });

    it("disallows going back when there is no recorded history", () => {
      const state = getNavigationState(5, liveWithUpcoming, null);
      expect(state.canGoBack).toBe(false);
    });

    it("allows going back when recorded history exists", () => {
      const state = getNavigationState(5, liveWithUpcoming, 1);
      expect(state.canGoBack).toBe(true);
    });
  });

  describe("the 'upcoming' state (index 1)", () => {
    it("always allows going back to 'current', regardless of recorded history", () => {
      const state = getNavigationState(6, liveWithUpcoming, null);
      expect(state.kind).toBe("upcoming");
      expect(state.canGoBack).toBe(true);
    });

    it("never allows going forward — it's the furthest reachable point", () => {
      const state = getNavigationState(6, liveWithUpcoming, null);
      expect(state.canGoForward).toBe(false);
    });
  });

  describe("historical states", () => {
    it("is classified as historical when the gameweek isn't in forwardStates", () => {
      const state = getNavigationState(3, liveWithUpcoming, 1);
      expect(state.kind).toBe("historical");
    });

    it("REGRESSION: allows going forward from the earliest recorded gameweek (GW1) toward the present", () => {
      // This is the exact bug: forwardIndex is always -1 for historical views,
      // so canGoForward must not be gated on forwardIndex for this case.
      const state = getNavigationState(1, liveWithUpcoming, 1);
      expect(state.kind).toBe("historical");
      expect(state.canGoBack).toBe(false); // GW1 is the floor — nothing earlier
      expect(state.canGoForward).toBe(true); // but forward must still work
    });

    it("allows going forward from any historical gameweek, not just the earliest", () => {
      const state = getNavigationState(3, liveWithUpcoming, 1);
      expect(state.canGoForward).toBe(true);
    });

    it("disallows going forward when forwardStates is empty (no current/upcoming to land on)", () => {
      const state = getNavigationState(3, [], 1);
      expect(state.kind).toBe("historical");
      expect(state.canGoForward).toBe(false);
    });

    it("disallows going back past the earliest recorded gameweek", () => {
      const state = getNavigationState(1, liveWithUpcoming, 1);
      expect(state.canGoBack).toBe(false);
    });

    it("allows going back when earlier history exists", () => {
      const state = getNavigationState(3, liveWithUpcoming, 1);
      expect(state.canGoBack).toBe(true);
    });
  });

  it("works identically for between-mode's single upcoming state", () => {
    const state = getNavigationState(null, betweenOnly, null);
    expect(state).toMatchObject({
      displayedGameweekNumber: 5,
      kind: "upcoming",
      canGoForward: false,
    });
  });
});

describe("getPreviousViewedGameweek", () => {
  const forwardStates = [
    { gameweekNumber: 5, kind: "current" },
    { gameweekNumber: 6, kind: "upcoming" },
  ];

  it("steps from 'upcoming' back to 'current' via forwardStates, not simple decrement", () => {
    expect(getPreviousViewedGameweek(6, forwardStates)).toBe(5);
  });

  it("decrements by one when stepping back from 'current' into history", () => {
    expect(getPreviousViewedGameweek(5, forwardStates)).toBe(4);
  });

  it("decrements by one when already within history", () => {
    expect(getPreviousViewedGameweek(3, forwardStates)).toBe(2);
  });
});

describe("getNextViewedGameweek", () => {
  const forwardStates = [
    { gameweekNumber: 5, kind: "current" },
    { gameweekNumber: 6, kind: "upcoming" },
  ];

  it("steps from 'current' forward to 'upcoming' via forwardStates", () => {
    expect(getNextViewedGameweek(5, forwardStates)).toBe(6);
  });

  it("returns null when already at the last forward state ('upcoming')", () => {
    expect(getNextViewedGameweek(6, forwardStates)).toBeNull();
  });

  it("increments by one when stepping forward within history", () => {
    expect(getNextViewedGameweek(3, forwardStates)).toBe(4);
  });

  it("snaps to null (the default view) when incrementing would reach the first forward state", () => {
    expect(getNextViewedGameweek(4, forwardStates)).toBeNull();
  });

  it("increments without a snap boundary when forwardStates is empty", () => {
    expect(getNextViewedGameweek(3, [])).toBe(4);
  });
});
