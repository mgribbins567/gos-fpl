import { describe, it, expect } from "vitest";
import {
  getNavigationState,
  getPreviousViewedGameweek,
  getNextViewedGameweek,
} from "../../lib/gameweekNavigation";

describe("getNavigationState", () => {
  it("displays the boundary gameweek and is not historical when viewedGameweek is null", () => {
    const state = getNavigationState(null, 5, 1);
    expect(state).toMatchObject({
      displayedGameweekNumber: 5,
      isHistorical: false,
      canGoForward: false,
    });
  });

  it("displays the viewed gameweek and is historical when viewedGameweek is set", () => {
    const state = getNavigationState(3, 5, 1);
    expect(state).toMatchObject({
      displayedGameweekNumber: 3,
      isHistorical: true,
    });
  });

  it("allows going back when displayed gameweek is above the earliest recorded one", () => {
    const state = getNavigationState(3, 5, 1);
    expect(state.canGoBack).toBe(true);
  });

  it("disallows going back at the earliest recorded gameweek", () => {
    const state = getNavigationState(1, 5, 1);
    expect(state.canGoBack).toBe(false);
  });

  it("disallows going back entirely when no history has been recorded yet (earliestGameweek is null)", () => {
    const state = getNavigationState(3, 5, null);
    expect(state.canGoBack).toBe(false);
  });

  it("allows going forward while historical and below the boundary", () => {
    const state = getNavigationState(3, 5, 1);
    expect(state.canGoForward).toBe(true);
  });

  it("disallows going forward when already at the live/between boundary", () => {
    const state = getNavigationState(null, 5, 1);
    expect(state.canGoForward).toBe(false);
  });
});

describe("getPreviousViewedGameweek", () => {
  it("returns one gameweek earlier", () => {
    expect(getPreviousViewedGameweek(5)).toBe(4);
  });
});

describe("getNextViewedGameweek", () => {
  it("returns the next gameweek number when still below the boundary", () => {
    expect(getNextViewedGameweek(3, 5)).toBe(4);
  });

  it("snaps back to the live boundary (null) when advancing would reach or pass it", () => {
    expect(getNextViewedGameweek(4, 5)).toBeNull();
  });

  it("snaps back to the boundary rather than overshooting it, even from further back", () => {
    // Regression guard: confirms the >= check, not just ==, in case boundaryGameweekNumber
    // ever changes between renders (e.g. a new gameweek goes live while a user is browsing history)
    expect(getNextViewedGameweek(4, 4)).toBeNull();
  });
});
