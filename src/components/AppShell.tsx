"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { eventsService, type EventDTO } from "@/lib/events/service";
import { setLastEventId } from "@/lib/events/storage";

type NavItem = { href: string; label: string; disabled?: boolean };

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState<EventDTO[]>([]);

  const eventMatch = pathname.match(/^\/events\/(\d+)/);
  const currentEventId = eventMatch ? Number(eventMatch[1]) : null;

  const section = useMemo(() => {
    if (pathname.includes("/groups")) return "groups";
    if (pathname.includes("/relations")) return "relations";
    if (pathname.includes("/guests")) return "guests";
    return "guests";
  }, [pathname]);

  useEffect(() => {
    eventsService.list().then(setEvents).catch(() => setEvents([]));
  }, [pathname]);

  const eventBase =
    currentEventId != null && Number.isFinite(currentEventId)
      ? `/events/${currentEventId}`
      : null;

  const navItems: NavItem[] = useMemo(() => {
    if (!eventBase) {
      return [
        { href: "/", label: "Panel principal" },
        { href: "/guests", label: "Invitados" },
        { href: "/groups", label: "Grupos" },
        { href: "/tables", label: "Mesas (próximamente)", disabled: true },
      ];
    }
    return [
      { href: "/", label: "Panel principal" },
      { href: `${eventBase}/guests`, label: "Invitados" },
      { href: `${eventBase}/groups`, label: "Grupos" },
      { href: `${eventBase}/relations`, label: "Relaciones" },
      { href: "/tables", label: "Mesas (próximamente)", disabled: true },
    ];
  }, [eventBase]);

  const isActive = (href: string, disabled?: boolean) => {
    if (disabled) return false;
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  const onEventChange = (idStr: string) => {
    const id = Number(idStr);
    if (!Number.isFinite(id)) return;
    setLastEventId(id);
    const path =
      section === "groups"
        ? `/events/${id}/groups`
        : section === "relations"
          ? `/events/${id}/relations`
          : `/events/${id}/guests`;
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="p-4 font-semibold text-zinc-900">Convivia</div>
          {events.length > 0 && (
            <div className="px-3 pb-3">
              <label className="grid gap-1 text-xs font-medium text-zinc-600">
                Evento
                <select
                  value={
                    currentEventId != null &&
                    events.some((e) => e.id === currentEventId)
                      ? String(currentEventId)
                      : ""
                  }
                  onChange={(e) => onEventChange(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm text-zinc-900"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.disabled ? "#" : item.href}
                onClick={() => !item.disabled && setMobileOpen(false)}
                className={[
                  "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                  isActive(item.href, item.disabled)
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  item.disabled ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center gap-3 border-b bg-white px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <div className="text-sm font-semibold text-zinc-900">Convivia</div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r bg-white p-2">
            <div className="flex items-center justify-between p-2">
              <div className="font-semibold text-zinc-900">Convivia</div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"
              >
                Cerrar
              </button>
            </div>
            {events.length > 0 && (
              <div className="px-2 pb-2">
                <label className="grid gap-1 text-xs font-medium text-zinc-600">
                  Evento
                  <select
                    value={
                      currentEventId != null &&
                      events.some((e) => e.id === currentEventId)
                        ? String(currentEventId)
                        : ""
                    }
                    onChange={(e) => onEventChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <nav className="space-y-1 px-1 pb-4 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.disabled ? "#" : item.href}
                  onClick={() => !item.disabled && setMobileOpen(false)}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive(item.href, item.disabled)
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                    item.disabled ? "opacity-60 pointer-events-none" : "",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
