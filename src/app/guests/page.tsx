"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { eventsService } from "@/lib/events/service";
import { getLastEventId, setLastEventId } from "@/lib/events/storage";

function GuestsRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const events = await eventsService.list();
        if (events.length === 0) {
          router.replace("/");
          return;
        }
        const last = getLastEventId();
        const pick =
          events.find((e) => e.id === last) ?? events[0] ?? null;
        if (!pick) {
          router.replace("/");
          return;
        }
        setLastEventId(pick.id);
        const qs = searchParams.toString();
        router.replace(
          `/events/${pick.id}/guests${qs ? `?${qs}` : ""}`,
        );
      } catch {
        router.replace("/");
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <p className="text-zinc-500">Redirigiendo...</p>
      </div>
    </div>
  );
}

export default function GuestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
            <p className="text-zinc-500">Cargando...</p>
          </div>
        </div>
      }
    >
      <GuestsRedirectInner />
    </Suspense>
  );
}
