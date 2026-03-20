"use client";

import { useEffect, useState } from "react";

type HostsSetupModalProps = {
  open: boolean;
  initialHosts: string[] | null;
  onClose: () => void;
  onSubmit: (hosts: string[]) => void;
};

export default function HostsSetupModal({
  open,
  initialHosts,
  onClose,
  onSubmit,
}: HostsSetupModalProps) {
  const [hosts, setHosts] = useState<string[]>([]);
  const [hostDraft, setHostDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    setHosts(initialHosts ?? []);
    setHostDraft("");
  }, [open, initialHosts]);

  if (!open) return null;

  const addHost = () => {
    const cleaned = hostDraft.trim();
    if (!cleaned) return;
    setHosts((prev) => Array.from(new Set([...prev, cleaned])));
    setHostDraft("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = hosts.map((h) => h.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    onSubmit(Array.from(new Set(cleaned)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            Configurar hosts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-700"
          >
            Cerrar
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Nombre del host
              <div className="mt-2 flex gap-2">
                <input
                  value={hostDraft}
                  onChange={(e) => setHostDraft(e.target.value)}
                  className="h-11 flex-1 rounded-lg border border-zinc-300 px-3 text-sm"
                  placeholder="Ej. Valeria"
                />
                <button
                  type="button"
                  onClick={addHost}
                  className="h-11 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Agregar
                </button>
              </div>
            </label>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium text-zinc-700">Hosts</div>
            {hosts.length === 0 ? (
              <div className="text-sm text-zinc-500">Agrega al menos 1 host.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hosts.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => setHosts((prev) => prev.filter((x) => x !== h))}
                      className="text-zinc-500 hover:text-zinc-700"
                      aria-label={`Eliminar ${h}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={hosts.length === 0}
              className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

