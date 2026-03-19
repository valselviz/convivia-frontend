import type { Couple } from "./types";

const COUPLE_KEY = "convivia-couple";
const LEGACY_COUPLE_KEY = "wedding-couple";

export const coupleService = {
  async get(): Promise<Couple | null> {
    if (typeof window === "undefined") return null;
    // Backward compatible: if there is legacy data stored under the old key,
    // keep it working after the rename.
    const raw =
      localStorage.getItem(COUPLE_KEY) ??
      localStorage.getItem(LEGACY_COUPLE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Couple;
    } catch {
      return null;
    }
  },
  async upsert(couple: Couple): Promise<Couple> {
    if (typeof window === "undefined") return couple;
    localStorage.setItem(COUPLE_KEY, JSON.stringify(couple));
    localStorage.removeItem(LEGACY_COUPLE_KEY);
    return couple;
  },
};
