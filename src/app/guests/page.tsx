import { Suspense } from "react";
import GuestsClient from "./GuestsClient";

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
      <GuestsClient />
    </Suspense>
  );
}
