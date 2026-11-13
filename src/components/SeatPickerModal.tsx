"use client";

import { useEffect, useState } from "react";
import { getAvatarUrl } from "@/lib/avatars";
import type { Guest } from "@/lib/guests/types";

type SeatPickerModalProps = {
  open: boolean;
  tableName: string;
  seatNumber: number | null;
  guests: Guest[];
  onClose: () => void;
  onPick: (guestId: number) => void;
};

export default function SeatPickerModal({
  open,
  tableName,
  seatNumber,
  guests,
  onClose,
  onPick,
}: SeatPickerModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  if (!open) return null;

  const filtered = guests.filter((g) =>
    g.full_name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {tableName}
            {seatNumber != null ? ` · asiento ${seatNumber}` : ""}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-700"
          >
            Cerrar
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar invitado confirmado..."
          className="mt-4 h-11 rounded-lg border border-zinc-300 px-3 text-sm"
        />
        <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">
              No hay invitados confirmados sin asignar que coincidan.
            </p>
          ) : (
            filtered.map((guest) => (
              <button
                key={guest.id}
                type="button"
                onClick={() => onPick(guest.id)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-zinc-100"
              >
                {guest.avatar_key ? (
                  <img
                    src={getAvatarUrl(guest.avatar_key)}
                    alt={guest.full_name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-200" />
                )}
                <span className="text-sm font-medium text-zinc-900">
                  {guest.full_name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
