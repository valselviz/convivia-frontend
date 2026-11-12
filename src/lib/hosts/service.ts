import { apiRequest } from "../api/client";

type HostDTO = { id: number; name: string };

const base = (eventId: number) => `/events/${eventId}`;

export const hostsService = {
  async get(eventId: number): Promise<string[]> {
    const hosts = await apiRequest<HostDTO[]>(`${base(eventId)}/hosts`);
    return hosts.map((h) => h.name);
  },

  async upsert(eventId: number, nextHosts: string[]): Promise<string[]> {
    const cleaned = nextHosts.map((h) => h.trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));

    const hosts = await apiRequest<HostDTO[]>(`${base(eventId)}/hosts`, {
      method: "PUT",
      body: JSON.stringify({ names: unique }),
    });

    return hosts.map((h) => h.name);
  },
};
