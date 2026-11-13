"use client";

import { useEffect, useState } from "react";
import type { Guest } from "@/lib/guests/types";
import type { GuestRelationDTO, GuestRelationKind } from "@/lib/relations/types";
import { KIND_LABELS, RELATION_KINDS } from "@/lib/relations/types";

export type RelationFormInput = {
  guest_id_1: number;
  guest_id_2: number;
  kind: GuestRelationKind;
  strength: number;
  notes: string | null;
};

type RelationModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialRelation: GuestRelationDTO | null;
  guests: Guest[];
  onClose: () => void;
  onSubmit: (input: RelationFormInput) => void;
};

export default function RelationModal({
  open,
  mode,
  initialRelation,
  guests,
  onClose,
  onSubmit,
}: RelationModalProps) {
  const [guestAId, setGuestAId] = useState<number | "">("");
  const [guestBId, setGuestBId] = useState<number | "">("");
  const [kind, setKind] = useState<GuestRelationKind>("AFFINITY");
  const [strength, setStrength] = useState(3);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialRelation) {
      setGuestAId(initialRelation.guest_a_id);
      setGuestBId(initialRelation.guest_b_id);
      setKind(initialRelation.kind);
      setStrength(initialRelation.strength);
      setNotes(initialRelation.notes ?? "");
    } else {
      setGuestAId("");
      setGuestBId("");
      setKind("AFFINITY");
      setStrength(3);
      setNotes("");
    }
  }, [open, initialRelation]);

  if (!open) return null;

  const isEdit = mode === "edit";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestAId === "" || guestBId === "") return;
    onSubmit({
      guest_id_1: Number(guestAId),
      guest_id_2: Number(guestBId),
      kind,
      strength,
      notes: notes.trim() || null,
    });
  };

  const guestBOptions = guests.filter((g) => g.id !== guestAId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {isEdit ? "Editar relación" : "Crear relación"}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Invitado A
              <select
                required
                disabled={isEdit}
                value={guestAId}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setGuestAId(value);
                  if (value === guestBId) setGuestBId("");
                }}
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
              >
                <option value="">Elegir invitado</option>
                {guests.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Invitado B
              <select
                required
                disabled={isEdit}
                value={guestBId}
                onChange={(e) => setGuestBId(Number(e.target.value))}
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
              >
                <option value="">Elegir invitado</option>
                {guestBOptions.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.full_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Tipo de relación
            <select
              disabled={isEdit}
              value={kind}
              onChange={(e) => setKind(e.target.value as GuestRelationKind)}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
            >
              {RELATION_KINDS.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Intensidad ({strength}/5)
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Notas
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Ej. prefieren estar cerca de la pista"
            />
          </label>
          {isEdit && (
            <p className="text-xs text-zinc-500">
              El par de invitados y el tipo no se pueden cambiar — borrá la
              relación y creá una nueva si necesitás otra combinación.
            </p>
          )}
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
              className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
