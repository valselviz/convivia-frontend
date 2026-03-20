"use client";

import { useEffect, useState } from "react";
import { avatarKeys, getAvatarUrl } from "@/lib/avatars";
import type {
  Guest,
  GuestCreateInput,
  AgeRange,
  Gender,
  GuestStatus,
  GuestType,
} from "@/lib/guests/types";

type GuestModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialGuest: Guest | null;
  mainGuests: Guest[];
  hosts: string[];
  onClose: () => void;
  onSubmit: (input: GuestCreateInput) => void;
};

const defaultForm: GuestCreateInput = {
  full_name: "",
  guest_type: "MAIN_GUEST",
  main_guest_id: null,
  host_name: null,
  gender: "FEMALE",
  age_range: "ADULT",
  avatar_key: null,
  notes: "",
  status: "INVITED",
};

export default function GuestModal({
  open,
  mode,
  initialGuest,
  mainGuests,
  hosts,
  onClose,
  onSubmit,
}: GuestModalProps) {
  const [form, setForm] = useState<GuestCreateInput>(defaultForm);

  useEffect(() => {
    if (initialGuest) {
      const {
        full_name,
        guest_type,
        main_guest_id,
        host_name,
        gender,
        age_range,
        avatar_key,
        notes,
        status,
      } = initialGuest;
      setForm({
        full_name,
        guest_type,
        main_guest_id,
        host_name,
        gender,
        age_range,
        avatar_key,
        notes: notes ?? "",
        status,
      });
      return;
    }
    setForm({
      ...defaultForm,
      host_name: hosts[0] ?? null,
    });
  }, [initialGuest, open, hosts]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized: GuestCreateInput = {
      ...form,
      notes: form.notes?.trim() ? form.notes.trim() : null,
      main_guest_id:
        form.guest_type === "PLUS_ONE" ? form.main_guest_id : null,
    };
    onSubmit(normalized);
  };

  const isAdult = form.age_range === "ADULT";
  const avatarPrefix =
    form.gender === "FEMALE" ? (isAdult ? "female" : "girl") : isAdult ? "male" : "boy";
  const filteredAvatarKeys = avatarKeys.filter((key) =>
    key.startsWith(`${avatarPrefix}-`),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {mode === "create" ? "Crear invitado" : "Editar invitado"}
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
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Nombre
            <input
              required
              value={form.full_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, full_name: event.target.value }))
              }
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              placeholder="Nombre completo"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Notas / relacion
            <input
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              placeholder="Prima, amigo, etc."
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Host
              <select
                value={form.host_name ?? ""}
                disabled={form.guest_type === "PLUS_ONE"}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    host_name: event.target.value || null,
                  }))
                }
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                <option value="">Seleccionar</option>
                {hosts.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Tipo
              <select
                value={form.guest_type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    guest_type: event.target.value as GuestType,
                    main_guest_id:
                      event.target.value === "PLUS_ONE"
                        ? prev.main_guest_id
                        : null,
                    ...(event.target.value === "PLUS_ONE"
                      ? {
                          host_name:
                            prev.main_guest_id !== null
                              ? mainGuests.find(
                                  (g) => g.id === prev.main_guest_id,
                                )?.host_name ?? null
                              : prev.host_name,
                        }
                      : {}),
                  }))
                }
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                <option value="MAIN_GUEST">Invitado principal</option>
                <option value="PLUS_ONE">Acompañante</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Género
              <select
                value={form.gender}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    gender: event.target.value as Gender,
                  }))
                }
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                <option value="FEMALE">Femenino</option>
                <option value="MALE">Masculino</option>
              </select>
            </label>
            {form.guest_type === "PLUS_ONE" && (
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Invitado principal
                <select
                  required
                  value={form.main_guest_id ?? ""}
                  onChange={(event) =>
                    setForm((prev) => {
                      const nextMainGuestId = event.target.value
                        ? Number(event.target.value)
                        : null;
                      const nextHostName =
                        nextMainGuestId !== null
                          ? mainGuests.find((g) => g.id === nextMainGuestId)
                              ?.host_name ?? null
                          : prev.host_name;
                      return {
                        ...prev,
                        main_guest_id: nextMainGuestId,
                        host_name: nextHostName,
                      };
                    })
                  }
                  className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
                >
                  <option value="">Seleccionar</option>
                  {mainGuests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.full_name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Rango de edad
              <select
                value={form.age_range}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    age_range: event.target.value as AgeRange,
                  }))
                }
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                <option value="ADULT">Adulto</option>
                <option value="CHILD">Niño</option>
                <option value="BABY">Bebé</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Estado
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as GuestStatus,
                  }))
                }
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                <option value="INVITED">Invitado</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="DECLINED">Declinado</option>
              </select>
            </label>
          </div>
          <div className="grid gap-2 text-sm font-medium text-zinc-700">
            Avatar
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, avatar_key: null }))}
                className={`h-12 rounded-full border px-4 text-sm font-semibold transition ${
                  form.avatar_key === null
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
                }`}
              >
                Automático
              </button>
              {filteredAvatarKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, avatar_key: key }))}
                  className={`flex h-12 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition ${
                    form.avatar_key === key
                      ? "border-2 border-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
                  }`}
                  aria-label={key}
                >
                  <img
                    src={getAvatarUrl(key)}
                    alt={key}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-normal text-zinc-500">
              Si eliges Automático, se asigna según género y rango de edad.
            </p>
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
