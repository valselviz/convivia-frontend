const rawBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

/** Base URL for API calls. Defaults to `/api` (proxied to the backend via Next rewrites). */
export const API_BASE_URL = rawBase;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const raw = await response.text();
    const isHtml = raw.trimStart().startsWith("<!");
    if (isHtml) {
      throw new Error(
        `No se pudo conectar con la API (${response.status}). ¿Está el backend en marcha?`,
      );
    }
    let message = raw || `Request failed: ${response.status}`;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.error === "string") {
        message = parsed.error;
      }
    } catch {
      // raw wasn't JSON, fall back to the raw text above
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
