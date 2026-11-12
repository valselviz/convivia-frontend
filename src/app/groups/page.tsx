"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { eventsService } from "@/lib/events/service";
import { getLastEventId, setLastEventId } from "@/lib/events/storage";

export default function GroupsRedirectPage() {
  const router = useRouter();

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
        router.replace(`/events/${pick.id}/groups`);
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <p className="text-zinc-500">Redirigiendo...</p>
      </div>
    </div>
  );
}
