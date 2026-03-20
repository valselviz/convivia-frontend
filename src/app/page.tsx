"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LandingActions from "@/components/LandingActions";
import { hostsService } from "@/lib/hosts/service";
import { guestService } from "@/lib/guests/service";
import type { Guest } from "@/lib/guests/types";

export default function Home() {
  const [hosts, setHosts] = useState<string[] | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([hostsService.get(), guestService.list()])
      .then(([hostsResponse, guestList]) => {
        setHosts(hostsResponse);
        setGuests(guestList);
      })
      .finally(() => setIsLoading(false));
  }, []);

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

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-zinc-500">
            Cargando panel...
          </div>
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
                {hosts.join(" & ")}
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
                  <Link
                    href="/guests"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Ver invitados
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700"
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
                  <LandingActions />
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
