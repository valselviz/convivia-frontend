"use client";

import { useEffect, useState } from "react";
import { setLastEventId } from "@/lib/events/storage";
import RelationTable from "@/components/RelationTable";
import RelationModal, { type RelationFormInput } from "@/components/RelationModal";
import type { GuestRelationDTO } from "@/lib/relations/types";
import { relationsService } from "@/lib/relations/service";
import { guestService } from "@/lib/guests/service";
import type { Guest } from "@/lib/guests/types";

type RelationsClientProps = {
  eventId: number;
};

export default function RelationsClient({ eventId }: RelationsClientProps) {
  const [relations, setRelations] = useState<GuestRelationDTO[]>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState<GuestRelationDTO | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLastEventId(eventId);
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [relationsData, guestsData] = await Promise.all([
        relationsService.list(eventId),
        guestService.list(eventId),
      ]);
      setRelations(relationsData);
      setAllGuests(guestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingRelation(null);
    setModalOpen(true);
  };

  const handleEdit = (relation: GuestRelationDTO) => {
    setEditingRelation(relation);
    setModalOpen(true);
  };

  const handleDelete = async (relation: GuestRelationDTO) => {
    const confirmDelete = window.confirm(
      `¿Borrar la relación entre "${relation.guest_a.full_name}" y "${relation.guest_b.full_name}"?`,
    );
    if (!confirmDelete) return;

    try {
      await relationsService.delete(eventId, relation.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting relation:", error);
      alert("Error al borrar la relación");
    }
  };

  const handleSubmit = async (input: RelationFormInput) => {
    try {
      if (editingRelation) {
        await relationsService.update(eventId, {
          id: editingRelation.id,
          strength: input.strength,
          notes: input.notes,
        });
      } else {
        await relationsService.create(eventId, {
          guest_id_1: input.guest_id_1,
          guest_id_2: input.guest_id_2,
          kind: input.kind,
          strength: input.strength,
          notes: input.notes,
        });
      }
      await loadData();
      setModalOpen(false);
      setEditingRelation(null);
    } catch (error) {
      console.error("Error saving relation:", error);
      alert(
        error instanceof Error ? error.message : "Error al guardar la relación",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <p className="text-zinc-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Relaciones</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Marca afinidades, lazos familiares, vínculos sociales o conflictos
            entre invitados puntuales — esta información es la que después
            alimenta la asignación de mesas.
          </p>
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {relations.length} relación(es) creada(s)
            </div>
            <button
              type="button"
              onClick={openCreate}
              disabled={allGuests.length < 2}
              className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Crear relación
            </button>
          </div>
          {allGuests.length < 2 && (
            <p className="text-xs text-zinc-500">
              Necesitás al menos 2 invitados en este evento para crear una
              relación.
            </p>
          )}
        </div>

        <RelationTable
          relations={relations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <RelationModal
        open={modalOpen}
        mode={editingRelation ? "edit" : "create"}
        initialRelation={editingRelation}
        guests={allGuests}
        onClose={() => {
          setModalOpen(false);
          setEditingRelation(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
