import { apiRequest } from "../api/client";
import type {
  GuestRelationCreateInput,
  GuestRelationDTO,
  GuestRelationUpdateInput,
} from "./types";

export type {
  GuestRelationDTO,
  GuestRelationKind,
  GuestRelationCreateInput,
  GuestRelationUpdateInput,
} from "./types";

const base = (eventId: number) => `/events/${eventId}`;

export const relationsService = {
  async list(eventId: number): Promise<GuestRelationDTO[]> {
    return apiRequest<GuestRelationDTO[]>(`${base(eventId)}/relations`);
  },

  async create(
    eventId: number,
    body: GuestRelationCreateInput,
  ): Promise<GuestRelationDTO> {
    return apiRequest<GuestRelationDTO>(`${base(eventId)}/relations`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async update(
    eventId: number,
    input: GuestRelationUpdateInput,
  ): Promise<GuestRelationDTO> {
    const { id, ...payload } = input;
    return apiRequest<GuestRelationDTO>(`${base(eventId)}/relations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(eventId: number, id: number): Promise<void> {
    return apiRequest<void>(`${base(eventId)}/relations/${id}`, {
      method: "DELETE",
    });
  },
};
