export type GuestRelationKind = "AFFINITY" | "FAMILY" | "SOCIAL" | "CONFLICT";

export type GuestRelationDTO = {
  id: number;
  event_id: number;
  guest_a_id: number;
  guest_b_id: number;
  kind: GuestRelationKind;
  strength: number;
  source: "USER" | "IMPORT" | "AI_SUGGESTION";
  notes: string | null;
  guest_a: { id: number; full_name: string };
  guest_b: { id: number; full_name: string };
};

export type GuestRelationCreateInput = {
  guest_id_1: number;
  guest_id_2: number;
  kind: GuestRelationKind;
  strength?: number;
  notes?: string | null;
};

export type GuestRelationUpdateInput = {
  id: number;
  strength?: number;
  notes?: string | null;
};

export const RELATION_KINDS: GuestRelationKind[] = [
  "AFFINITY",
  "FAMILY",
  "SOCIAL",
  "CONFLICT",
];

export const KIND_LABELS: Record<GuestRelationKind, string> = {
  AFFINITY: "Afinidad",
  FAMILY: "Familia",
  SOCIAL: "Social",
  CONFLICT: "Conflicto",
};

export const KIND_BADGE_CLASSES: Record<GuestRelationKind, string> = {
  AFFINITY: "bg-pink-100 text-pink-700",
  FAMILY: "bg-blue-100 text-blue-700",
  SOCIAL: "bg-zinc-100 text-zinc-700",
  CONFLICT: "bg-red-100 text-red-700",
};
