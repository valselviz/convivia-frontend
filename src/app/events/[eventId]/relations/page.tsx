"use client";

import { useParams } from "next/navigation";
import RelationsClient from "@/app/relations/RelationsClient";

export default function EventRelationsPage() {
  const params = useParams();
  const raw = params?.eventId;
  const id = typeof raw === "string" ? Number(raw) : NaN;
  if (!Number.isFinite(id)) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
        <div className="mx-auto flex max-w-6xl justify-center">
          <p className="text-zinc-500">Evento no válido</p>
        </div>
      </div>
    );
  }
  return <RelationsClient eventId={id} />;
}
