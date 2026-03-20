"use client";

import type { GuestType, GuestStatus } from "@/lib/guests/types";

export type GuestFiltersValue = {
  host: string | "all";
  type: GuestType | "all";
  status: GuestStatus | "all";
  plusOne: "all" | "only";
  order: "name" | "notes";
};

type GuestFiltersProps = {
  value: GuestFiltersValue;
  onChange: (next: GuestFiltersValue) => void;
  hosts: string[];
};

export default function GuestFilters({ value, onChange, hosts }: GuestFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
        value={value.host}
        onChange={(event) =>
          onChange({ ...value, host: event.target.value as GuestFiltersValue["host"] })
        }
      >
        <option value="all">Todos los hosts</option>
        {hosts.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <select
        className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
        value={value.type}
        onChange={(event) =>
          onChange({ ...value, type: event.target.value as GuestFiltersValue["type"] })
        }
      >
        <option value="all">Todos los tipos</option>
        <option value="MAIN_GUEST">Invitado principal</option>
        <option value="PLUS_ONE">Acompañante</option>
      </select>
      <select
        className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
        value={value.status}
        onChange={(event) =>
          onChange({
            ...value,
            status: event.target.value as GuestFiltersValue["status"],
          })
        }
      >
        <option value="all">Todos los estados</option>
        <option value="INVITED">Invitado</option>
        <option value="CONFIRMED">Confirmado</option>
        <option value="DECLINED">Declinado</option>
      </select>
      <select
        className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
        value={value.plusOne}
        onChange={(event) =>
          onChange({
            ...value,
            plusOne: event.target.value as GuestFiltersValue["plusOne"],
          })
        }
      >
        <option value="all">Todos (incluye +1)</option>
        <option value="only">Solo acompañantes</option>
      </select>
      <select
        className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
        value={value.order}
        onChange={(event) =>
          onChange({ ...value, order: event.target.value as GuestFiltersValue["order"] })
        }
      >
        <option value="name">Orden: Nombre</option>
        <option value="notes">Orden: Notas</option>
      </select>
    </div>
  );
}
