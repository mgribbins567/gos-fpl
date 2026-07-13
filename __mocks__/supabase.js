import { vi } from "vitest";

export const mockSingle = vi.fn();
export const mockEq = vi.fn(() => ({ single: mockSingle }));
export const mockSelect = vi.fn(() => ({ eq: mockEq }));
export const mockFrom = vi.fn(() => ({ select: mockSelect }));

export const supabase = {
  from: mockFrom,
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
};
