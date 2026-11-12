"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LandingActions from "@/components/LandingActions";
import { eventsService, type EventDTO } from "@/lib/events/service";
import { hostsService } from "@/lib/hosts/service";
import { guestService } from "@/lib/guests/service";
import { getLastEventId, setLastEventId } from "@/lib/events/storage";
import type { Guest } from "@/lib/guests/types";

export default function Home() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [activeEventId, setActiveEventId] = useState<number | null>(null);
  const [hosts, setHosts] = useState<string[] | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createBusy, setCreateBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const evs = await eventsService.list();
        setEvents(evs);
        if (evs.length === 0) {
          setActiveEventId(null);
          setHosts(null);
          setGuests([]);
          return;
        }
        const last = getLastEventId();
        const pick = evs.find((e) => e.id === last) ?? evs[0];
        setActiveEventId(pick.id);
        setLastEventId(pick.id);
        const [h, g] = await Promise.all([
          hostsService.get(pick.id),
          guestService.list(pick.id),
        ]);
        setHosts(h);
        setGuests(g);
      } catch {
        setHosts(null);
        setGuests([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleCreateEvent = async () => {
    setCreateBusy(true);
    try {
      const ev = await eventsService.create("Mi primer evento");
      setLastEventId(ev.id);
      window.location.href = `/events/${ev.id}/guests`;
    } finally {
      setCreateBusy(false);
    }
  };

  const summary = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter((guest) => guest.status === "CONFIRMED")
      .length;
    const invited = guests.filter((guest) => guest.status === "INVITED").length;
    const declined = guests.filter((guest) => guest.status === "DECLINED")
      .length;
    const plusOnes = guests.filter((guest) => guest.guest_type === "PLUS_ONE")
      .length;
    return { total, confirmed, invited, declined, plusOnes };
  }, [guests]);

  const activeEvent = activeEventId
    ? events.find((e) => e.id === activeEventId)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
            Cargando panel...
          </div>
        ) : events.length === 0 ? (
          <>
            <header className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Convivia
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Organiza tus eventos
              </h1>
              <p className="max-w-2xl text-lg text-zinc-600">
                Crea un evento para empezar: invitados, hosts, grupos y mesas
                viven dentro de cada evento. Ideal para planificadores con
                varios clientes o celebraciones particulares.
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Primera vez aquí</h2>
                <p className="mt-2 text-zinc-600">
                  Crea tu primer evento y luego configura hosts e invitados.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCreateEvent}
                    disabled={createBusy}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {createBusy ? "Creando..." : "Crear primer evento"}
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold">Qué puedes hacer</h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                  <li>Gestionar varios eventos desde un mismo espacio.</li>
                  <li>Filtrar invitados por host, tipo y estado.</li>
                  <li>Agrupar invitados y preparar mesas (próximamente).</li>
                </ul>
              </div>
            </section>
          </>
        ) : hosts && hosts.length > 0 ? (
          <>
            <header className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Convivia
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Panel principal
              </h1>
              <p className="text-lg text-zinc-600">
                {activeEvent ? (
                  <>
                    <span className="font-medium text-zinc-900">
                      {activeEvent.name}
                    </span>
                    {" · "}
                    {hosts.join(" & ")}
                  </>
                ) : (
                  hosts.join(" & ")
                )}
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Invitados totales
                </p>
                <p className="mt-3 text-3xl font-semibold">{summary.total}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Confirmados
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {summary.confirmed}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Pendientes
                </p>
                <p className="mt-3 text-3xl font-semibold">{summary.invited}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Acompañantes
                </p>
                <p className="mt-3 text-3xl font-semibold">{summary.plusOnes}</p>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold">Accesos rápidos</h2>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {activeEventId != null && (
                    <Link
                      href={`/events/${activeEventId}/guests`}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      Ver invitados
                    </Link>
                  )}
                  {activeEventId != null && (
                    <Link
                      href={`/events/${activeEventId}/groups`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                    >
                      Grupos
                    </Link>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700"
                    disabled
                  >
                    Mesas (próximamente)
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold">Resumen rápido</h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                  <li>{summary.declined} invitados declinaron.</li>
                  <li>{summary.invited} invitados aún no responden.</li>
                  <li>{summary.plusOnes} acompañantes registrados.</li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <>
            <header className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Convivia
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Bienvenidos a la organización del gran día
              </h1>
              <p className="max-w-2xl text-lg text-zinc-600">
                Empieza definiendo a los hosts y luego gestiona a tus invitados
                con filtros, estados y acciones masivas.
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold">Primera vez aquí</h2>
                <p className="mt-2 text-zinc-600">
                  Configura los hosts para comenzar el flujo. Luego podrás
                  crear invitados, confirmar asistencia y armar el presupuesto.
                </p>
                <div className="mt-6">
                  <LandingActions eventId={activeEventId} />
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold">Qué puedes hacer</h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                  <li>Filtrar invitados por host, tipo y estado.</li>
                  <li>Ordenar por familia o relación.</li>
                  <li>Editar estados en bloque para confirmar o declinar.</li>
                  <li>Ver rango de edad para estimar presupuesto.</li>
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
