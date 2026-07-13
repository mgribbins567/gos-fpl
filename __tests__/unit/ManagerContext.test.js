import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchManager } from "../../contexts/ManagerContext";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
    }),
    auth: {
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  }),
}));

import { createClient } from "@supabase/supabase-js";

const supabase = createClient("", "");

describe("fetchManager", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns manager when row exists", async () => {
    const mockManager = { id: "123", name: "John", auth_id: "uuid-123456" };
    mockSingle.mockResolvedValue({
      data: mockManager,
      error: null,
    });

    const result = await fetchManager("uuid-123456");
    expect(result).toEqual(mockManager);
  });

  it("returns null when no row found (PGRST116)", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });

    const result = await fetchManager("uuid-123");
    expect(result).toBeNull();
  });

  it("throws on real database error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "500", message: "DB exploded" },
    });

    await expect(fetchManager("uuid-123")).rejects.toThrow("DB exploded");
  });
});
