"use client";

import { getAvatarUrl } from "@/lib/avatars";
import type { Guest } from "@/lib/guests/types";

type GuestTableProps = {
  guests: Guest[];
  mainGuestNameById: Record<number, string>;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleAll: (selectAll: boolean) => void;
  onEdit: (guest: Guest) => void;
  onAddPlusOne: (guest: Guest) => void;
};

export default function GuestTable({
  guests,
  mainGuestNameById,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onAddPlusOne,
}: GuestTableProps) {
  const allSelected = guests.length > 0 && selectedIds.length === guests.length;
  const typeLabel = (type: Guest["guest_type"]) => {
    switch (type) {
      case "MAIN_GUEST":
        return "Invitado principal";
      case "PLUS_ONE":
        return "Acompañante";
      default:
        return type;
    }
  };
  const ageLabel = (age: Guest["age_range"]) => {
    switch (age) {
      case "ADULT":
        return "Adulto";
      case "CHILD":
        return "Niño";
      case "BABY":
        return "Bebé";
      default:
        return age;
    }
  };
  const statusLabel = (status: Guest["status"]) => {
    switch (status) {
      case "INVITED":
        return "Invitado";
      case "CONFIRMED":
        return "Confirmado";
      case "DECLINED":
        return "Declinado";
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => onToggleAll(event.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
            </th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Host</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Rango de edad</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-zinc-700">
          {guests.map((guest) => (
            <tr key={guest.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(guest.id)}
                  onChange={() => onToggleSelect(guest.id)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">
                <div className="flex items-center gap-2">
                  {guest.avatar_key ? (
                    <img
                      src={getAvatarUrl(guest.avatar_key)}
                      alt={guest.full_name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-100" />
                  )}
                  <span>{guest.full_name}</span>
                  {guest.guest_type === "PLUS_ONE" && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
                      +1
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {guest.host_name ?? "—"}
              </td>
              <td className="px-4 py-3">{typeLabel(guest.guest_type)}</td>
              <td className="px-4 py-3">{ageLabel(guest.age_range)}</td>
              <td className="px-4 py-3">{statusLabel(guest.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(guest)}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                  >
                    Editar
                  </button>
                  {guest.guest_type === "MAIN_GUEST" && (
                    <button
                      type="button"
                      onClick={() => onAddPlusOne(guest)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                      title="Agregar acompañante"
                    >
                      +1
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {guests.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-zinc-500">
          No hay invitados con los filtros actuales.
        </div>
      )}
    </div>
  );
}
