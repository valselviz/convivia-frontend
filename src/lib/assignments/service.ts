import { apiRequest } from "../api/client";
import type { AssignmentDTO, ReassignInput, ReassignResult } from "./types";

const base = (eventId: number) => `/events/${eventId}`;

export const assignmentsService = {
  async list(eventId: number): Promise<AssignmentDTO[]> {
    return apiRequest<AssignmentDTO[]>(`${base(eventId)}/assignments`);
  },

  async reassign(
    eventId: number,
    input: ReassignInput,
  ): Promise<ReassignResult> {
    return apiRequest<ReassignResult>(`${base(eventId)}/assignments`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  async unassign(eventId: number, guestId: number): Promise<void> {
    return apiRequest<void>(`${base(eventId)}/assignments/${guestId}`, {
      method: "DELETE",
    });
  },

  async setLocked(
    eventId: number,
    guestId: number,
    locked: boolean,
  ): Promise<AssignmentDTO> {
    return apiRequest<AssignmentDTO>(
      `${base(eventId)}/assignments/${guestId}/lock`,
      {
        method: "PATCH",
        body: JSON.stringify({ locked }),
      },
    );
  },

  async unlockAll(eventId: number): Promise<number> {
    const result = await apiRequest<{ count: number }>(
      `${base(eventId)}/assignments/unlock-all`,
      { method: "POST" },
    );
    return result.count;
  },
};
