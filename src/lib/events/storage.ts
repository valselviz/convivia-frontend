const LAST_EVENT_KEY = "convivia:lastEventId";

export function getLastEventId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_EVENT_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function setLastEventId(id: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_EVENT_KEY, String(id));
}
