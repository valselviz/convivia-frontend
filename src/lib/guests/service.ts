import type {
  Guest,
  GuestCreateInput,
  GuestUpdateInput,
  GuestStatus,
  GuestType,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

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

export const guestService = {
  async list(params?: GuestListParams): Promise<Guest[]> {
    const query = params ? buildQueryString(params) : "";
    return request<Guest[]>(`/guests${query}`);
  },
  async create(input: GuestCreateInput): Promise<Guest> {
    return request<Guest>("/guests", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async update(input: GuestUpdateInput): Promise<Guest | null> {
    const { id, ...payload } = input;
    return request<Guest>(`/guests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  async updateStatus(ids: number[], status: GuestStatus): Promise<Guest[]> {
    const updated = await Promise.all(
      ids.map((id) =>
        request<Guest>(`/guests/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      ),
    );
    return updated;
  },
  async delete(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        request<void>(`/guests/${id}`, {
          method: "DELETE",
        }),
      ),
    );
  },
};
