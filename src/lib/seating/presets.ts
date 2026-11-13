import type { SeatingWeights } from "./types";

export const DEFAULT_WEIGHTS: SeatingWeights = {
  host: { mode: "indifferent", weight: 0 },
  family: 1,
  affinity: 1,
  groups: 1,
  age: 0,
};

export const SEATING_PRESETS: Record<string, SeatingWeights> = {
  "Boda clásica": {
    host: { mode: "separate", weight: 2 },
    family: 3,
    affinity: 1,
    groups: 1,
    age: 0,
  },
  "Fiesta integrada": {
    host: { mode: "mixed", weight: 2 },
    family: 1,
    affinity: 2,
    groups: 3,
    age: 3,
  },
};
