"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Panel principal" },
  { href: "/guests", label: "Invitados" },
  { href: "/groups", label: "Grupos" },
  { href: "/tables", label: "Mesas (próximamente)" },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="p-4 font-semibold text-zinc-900">Convivia</div>
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                  isActive(item.href)
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  item.href === "/tables" ? "opacity-60 pointer-events-none" : "",
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
            <nav className="space-y-1 px-1 pb-4 pt-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive(item.href)
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                    item.href === "/tables" ? "opacity-60 pointer-events-none" : "",
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

