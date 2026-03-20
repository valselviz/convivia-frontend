"use client";

import type { GuestType, GuestStatus } from "@/lib/guests/types";
import type { GuestFiltersValue } from "./GuestFilters";

type GuestFiltersModalProps = {
  open: boolean;
  filters: GuestFiltersValue;
  hosts: string[];
  onClose: () => void;
  onChange: (filters: GuestFiltersValue) => void;
  onClear: () => void;
};

export default function GuestFiltersModal({
  open,
  filters,
  hosts,
  onClose,
  onChange,
  onClear,
}: GuestFiltersModalProps) {
  if (!open) return null;

  const hasActiveFilters =
    filters.host !== "all" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.plusOne !== "all" ||
    filters.order !== "name";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-700"
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Host</label>
            <select
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              value={filters.host}
              onChange={(event) =>
                onChange({
                  ...filters,
                  host: event.target.value as GuestFiltersValue["host"],
                })
              }
            >
              <option value="all">Todos los hosts</option>
              {hosts.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Tipo</label>
            <select
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              value={filters.type}
              onChange={(event) =>
                onChange({
                  ...filters,
                  type: event.target.value as GuestFiltersValue["type"],
                })
              }
            >
              <option value="all">Todos los tipos</option>
              <option value="MAIN_GUEST">Invitado principal</option>
              <option value="PLUS_ONE">Acompañante</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Estado</label>
            <select
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              value={filters.status}
              onChange={(event) =>
                onChange({
                  ...filters,
                  status: event.target.value as GuestFiltersValue["status"],
                })
              }
            >
              <option value="all">Todos los estados</option>
              <option value="INVITED">Invitado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="DECLINED">Declinado</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">
              Acompañantes
            </label>
            <select
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              value={filters.plusOne}
              onChange={(event) =>
                onChange({
                  ...filters,
                  plusOne: event.target.value as GuestFiltersValue["plusOne"],
                })
              }
            >
              <option value="all">Todos (incluye +1)</option>
              <option value="only">Solo acompañantes</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700">Ordenar</label>
            <select
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              value={filters.order}
              onChange={(event) =>
                onChange({
                  ...filters,
                  order: event.target.value as GuestFiltersValue["order"],
                })
              }
            >
              <option value="name">Orden: Nombre</option>
              <option value="notes">Orden: Notas</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="h-11 rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpiar filtros
          </button>
          <div className="flex gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
