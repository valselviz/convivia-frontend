"use client";

import { useEffect, useState } from "react";
import type {
  GuestGroup,
  GuestGroupCreateInput,
  GroupCategory,
} from "@/lib/groups/types";
import { GROUP_CATEGORIES, CATEGORY_LABELS } from "@/lib/groups/types";

type GroupModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialGroup: GuestGroup | null;
  onClose: () => void;
  onSubmit: (input: GuestGroupCreateInput) => void;
};

export default function GroupModal({
  open,
  mode,
  initialGroup,
  onClose,
  onSubmit,
}: GroupModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GroupCategory | "">("");

  useEffect(() => {
    if (open) {
      if (initialGroup) {
        setName(initialGroup.name);
        setCategory((initialGroup.category as GroupCategory) || "");
      } else {
        setName("");
        setCategory("");
      }
    }
  }, [open, initialGroup]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      category: category || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {mode === "create" ? "Crear grupo" : "Editar grupo"}
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
            Nombre del grupo
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              placeholder="Ej. Familia del host"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Categoría
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GroupCategory | "")}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
            >
              <option value="">Sin categoría</option>
              {GROUP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>
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
