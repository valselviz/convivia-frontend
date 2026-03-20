const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

type HostDTO = { id: number; name: string };

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

  return (await response.json()) as T;
};

export const hostsService = {
  async get(): Promise<string[]> {
    const hosts = await request<HostDTO[]>("/hosts");
    return hosts.map((h) => h.name);
  },

  async upsert(nextHosts: string[]): Promise<string[]> {
    const cleaned = nextHosts.map((h) => h.trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));

    const hosts = await request<HostDTO[]>("/hosts", {
      method: "PUT",
      body: JSON.stringify({ names: unique }),
    });

    return hosts.map((h) => h.name);
  },
};

