"use client";

import { useEffect, useState } from "react";
import type { GuestGroup } from "@/lib/groups/types";
import { CATEGORY_LABELS } from "@/lib/groups/types";
import { groupService } from "@/lib/groups/service";

type AddToGroupModalProps = {
  eventId: number;
  open: boolean;
  guestIds: number[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddToGroupModal({
  eventId,
  open,
  guestIds,
  onClose,
  onSuccess,
}: AddToGroupModalProps) {
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadGroups();
      setSelectedGroupId(null);
    }
  }, [open, eventId]);

  const loadGroups = async () => {
    try {
      const data = await groupService.list(eventId);
      setGroups(data);
    } catch (error) {
      console.error("Error loading groups:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedGroupId) return;

    setIsLoading(true);
    try {
      await groupService.addMembers(eventId, selectedGroupId, guestIds);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding to group:", error);
      alert("Error al agregar invitados al grupo");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            Agregar a grupo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-700"
          >
            Cerrar
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-600 mb-4">
            Selecciona un grupo para agregar {guestIds.length} invitado(s)
            seleccionado(s).
          </p>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Grupo
            <select
              value={selectedGroupId || ""}
              onChange={(e) =>
                setSelectedGroupId(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
            >
              <option value="">Selecciona un grupo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                  {group.category &&
                    ` (${CATEGORY_LABELS[group.category as keyof typeof CATEGORY_LABELS] ?? group.category})`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedGroupId || isLoading}
            className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
