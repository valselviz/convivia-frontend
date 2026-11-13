import { apiRequest } from "../api/client";
import type { TableCreateInput, TableDTO, TableUpdateInput } from "./types";

const base = (eventId: number) => `/events/${eventId}`;

export const tablesService = {
  async list(eventId: number): Promise<TableDTO[]> {
    return apiRequest<TableDTO[]>(`${base(eventId)}/tables`);
  },

  async create(eventId: number, input: TableCreateInput): Promise<TableDTO> {
    return apiRequest<TableDTO>(`${base(eventId)}/tables`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async update(eventId: number, input: TableUpdateInput): Promise<TableDTO> {
    const { id, ...payload } = input;
    return apiRequest<TableDTO>(`${base(eventId)}/tables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async delete(eventId: number, id: number): Promise<void> {
    return apiRequest<void>(`${base(eventId)}/tables/${id}`, {
      method: "DELETE",
    });
  },
};
