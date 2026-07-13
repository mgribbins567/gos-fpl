import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTeam } from "../../components/Team/TeamCard";

const { mockSelect } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: mockSelect,
      }),
    }),
    auth: {
      onAuthStateChange: vi.fn(),
    },
  }),
}));

import { createClient } from "@supabase/supabase-js";

const supabase = createClient("", "");

const mockManager = { id: "21", name: "John", auth_id: "uuid-123456" };
const mockTeam = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    manager_id: 21,
    player_id: 50,
    is_starter: true,
    bench_order: null,
    added_at: "2026-07-06 03:49:16.019597+00",
    added_via: "draft",
  },
];

describe("getTeam", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when manager is null", async () => {
    const result = await getTeam(null, supabase);
    expect(result).toBeNull();
  });

  it("returns team when manager exists", async () => {
    mockSelect.mockResolvedValue({ data: mockTeam, error: null });

    const result = await getTeam(mockManager, supabase);
    expect(result).toEqual(mockTeam);
  });

  it("returns empty array when manager has no players", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    const result = await getTeam(mockManager, supabase);
    expect(result).toEqual([]);
  });

  it("throws on database error", async () => {
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: "DB exploded" },
    });

    await expect(getTeam(mockManager, supabase)).rejects.toThrow("DB exploded");
  });
});
