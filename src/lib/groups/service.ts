import type {
  GuestGroup,
  GuestGroupWithMembers,
  GuestGroupCreateInput,
  GuestGroupUpdateInput,
} from "./types";
import { apiRequest } from "../api/client";

const base = (eventId: number) => `/events/${eventId}`;

export const groupService = {
  async list(eventId: number): Promise<GuestGroup[]> {
    return apiRequest<GuestGroup[]>(`${base(eventId)}/groups`);
  },
  async getById(eventId: number, id: number): Promise<GuestGroupWithMembers> {
    return apiRequest<GuestGroupWithMembers>(`${base(eventId)}/groups/${id}`);
  },
  async create(
    eventId: number,
    input: GuestGroupCreateInput,
  ): Promise<GuestGroup> {
    return apiRequest<GuestGroup>(`${base(eventId)}/groups`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async update(eventId: number, input: GuestGroupUpdateInput): Promise<GuestGroup> {
    const { id, ...payload } = input;
    return apiRequest<GuestGroup>(`${base(eventId)}/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async delete(eventId: number, id: number): Promise<void> {
    return apiRequest<void>(`${base(eventId)}/groups/${id}`, {
      method: "DELETE",
    });
  },
  async addMembers(
    eventId: number,
    groupId: number,
    guestIds: number[],
  ): Promise<GuestGroupWithMembers> {
    return apiRequest<GuestGroupWithMembers>(
      `${base(eventId)}/groups/${groupId}/members`,
      {
        method: "POST",
        body: JSON.stringify({ guestIds }),
      },
    );
  },
  async removeMember(
    eventId: number,
    groupId: number,
    guestId: number,
  ): Promise<void> {
    return apiRequest<void>(
      `${base(eventId)}/groups/${groupId}/members/${guestId}`,
      {
        method: "DELETE",
      },
    );
  },
};
