import { apiRequest } from "../api/client";

export type EventDTO = {
  id: number;
  name: string;
  room_width_m: number;
  room_height_m: number;
  created_at: string;
  updated_at: string;
};

export const eventsService = {
  async list(): Promise<EventDTO[]> {
    return apiRequest<EventDTO[]>("/events");
  },

  async getById(id: number): Promise<EventDTO> {
    return apiRequest<EventDTO>(`/events/${id}`);
  },

  async create(name?: string): Promise<EventDTO> {
    return apiRequest<EventDTO>("/events", {
      method: "POST",
      body: JSON.stringify({ name: name ?? "Nuevo evento" }),
    });
  },

  async update(id: number, name: string): Promise<EventDTO> {
    return apiRequest<EventDTO>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },

  async updateRoomSize(
    id: number,
    roomWidthM: number,
    roomHeightM: number,
  ): Promise<EventDTO> {
    return apiRequest<EventDTO>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        room_width_m: roomWidthM,
        room_height_m: roomHeightM,
      }),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/events/${id}`, {
      method: "DELETE",
    });
  },
};
