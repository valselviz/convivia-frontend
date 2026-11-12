import type {
  Guest,
  GuestCreateInput,
  GuestUpdateInput,
  GuestStatus,
  GuestType,
} from "./types";
import { apiRequest } from "../api/client";

export type GuestListParams = {
  search?: string;
  hostName?: string;
  type?: GuestType;
  status?: GuestStatus;
  plusOne?: "all" | "only";
  order?: "name" | "notes";
};

const buildQueryString = (params: GuestListParams): string => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.append("search", params.search);
  }
  if (params.hostName) {
    searchParams.append("hostName", params.hostName);
  }
  if (params.type) {
    searchParams.append("type", params.type);
  }
  if (params.status) {
    searchParams.append("status", params.status);
  }
  if (params.plusOne && params.plusOne !== "all") {
    searchParams.append("plusOne", params.plusOne);
  }
  if (params.order) {
    searchParams.append("order", params.order);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const base = (eventId: number) => `/events/${eventId}`;

export const guestService = {
  async list(eventId: number, params?: GuestListParams): Promise<Guest[]> {
    const query = params ? buildQueryString(params) : "";
    return apiRequest<Guest[]>(`${base(eventId)}/guests${query}`);
  },
  async create(eventId: number, input: GuestCreateInput): Promise<Guest> {
    return apiRequest<Guest>(`${base(eventId)}/guests`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async update(eventId: number, input: GuestUpdateInput): Promise<Guest | null> {
    const { id, ...payload } = input;
    return apiRequest<Guest>(`${base(eventId)}/guests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  async updateStatus(
    eventId: number,
    ids: number[],
    status: GuestStatus,
  ): Promise<Guest[]> {
    const updated = await Promise.all(
      ids.map((id) =>
        apiRequest<Guest>(`${base(eventId)}/guests/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      ),
    );
    return updated;
  },
  async delete(eventId: number, ids: number[]): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        apiRequest<void>(`${base(eventId)}/guests/${id}`, {
          method: "DELETE",
        }),
      ),
    );
  },
};
