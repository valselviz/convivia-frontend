export type HostMode = "separate" | "indifferent" | "mixed";

/** 0 = ninguno, 1 = bajo, 2 = medio, 3 = alto. */
export type WeightLevel = 0 | 1 | 2 | 3;

export type SeatingWeights = {
  host: { mode: HostMode; weight: WeightLevel };
  family: WeightLevel;
  affinity: WeightLevel;
  groups: WeightLevel;
  age: WeightLevel;
};

export type SeatingAlert =
  | { type: "conflict_unavoidable"; message: string; guestIds: [number, number]; tableId: number }
  | { type: "table_below_minimum"; message: string; tableId: number }
  | { type: "guest_unassigned"; message: string; guestIds: number[] }
  | { type: "capacity_insufficient"; message: string };

export type SeatingTableScore = {
  tableId: number;
  score: number;
  occupantCount: number;
  belowMinimum: boolean;
};

export type SeatingResult = {
  assignments: Array<{ guestId: number; tableId: number; locked: boolean }>;
  unassignedGuestIds: number[];
  tableScores: SeatingTableScore[];
  alerts: SeatingAlert[];
};

export const HOST_MODE_LABELS: Record<HostMode, string> = {
  separate: "Separar por host",
  indifferent: "Indiferente",
  mixed: "Mezclar hosts",
};

export const WEIGHT_LABELS: Record<WeightLevel, string> = {
  0: "Ninguno",
  1: "Bajo",
  2: "Medio",
  3: "Alto",
};

export const WEIGHT_LEVELS: WeightLevel[] = [0, 1, 2, 3];
