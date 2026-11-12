import { apiRequest } from "../api/client";

export type GuestRelationKind =
  | "AFFINITY"
  | "FAMILY"
  | "SOCIAL"
  | "CONFLICT";

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

const base = (eventId: number) => `/events/${eventId}`;

export const relationsService = {
  async list(eventId: number): Promise<GuestRelationDTO[]> {
    return apiRequest<GuestRelationDTO[]>(`${base(eventId)}/relations`);
  },

  async create(
    eventId: number,
    body: {
      guest_id_1: number;
      guest_id_2: number;
      kind: GuestRelationKind;
      strength?: number;
      notes?: string | null;
    },
  ): Promise<GuestRelationDTO> {
    return apiRequest<GuestRelationDTO>(`${base(eventId)}/relations`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
