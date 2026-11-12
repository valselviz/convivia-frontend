"use client";

import { useEffect, useState } from "react";
import { setLastEventId } from "@/lib/events/storage";
import GroupTable from "@/components/GroupTable";
import GroupModal from "@/components/GroupModal";
import AddMembersModal from "@/components/AddMembersModal";
import type {
  GuestGroup,
  GuestGroupCreateInput,
  GuestGroupWithMembers,
} from "@/lib/groups/types";
import { groupService } from "@/lib/groups/service";
import { guestService } from "@/lib/guests/service";
import type { Guest } from "@/lib/guests/types";

type GroupsClientProps = {
  eventId: number;
};

export default function GroupsClient({ eventId }: GroupsClientProps) {
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GuestGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GuestGroup | null>(null);
  const [groupWithMembers, setGroupWithMembers] =
    useState<GuestGroupWithMembers | null>(null);
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
      const [groupsData, guestsData] = await Promise.all([
        groupService.list(eventId),
        guestService.list(eventId),
      ]);
      setGroups(groupsData);
      setAllGuests(guestsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const handleEdit = (group: GuestGroup) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleDelete = async (group: GuestGroup) => {
    const confirmDelete = window.confirm(
      `¿Borrar el grupo "${group.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmDelete) return;

    try {
      await groupService.delete(eventId, group.id);
      await loadData();
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Error al borrar el grupo");
    }
  };

  const handleAddMembers = async (group: GuestGroup) => {
    try {
      const groupData = await groupService.getById(eventId, group.id);
      setGroupWithMembers(groupData);
      setSelectedGroup(group);
      setMembersModalOpen(true);
    } catch (error) {
      console.error("Error loading group:", error);
      alert("Error al cargar el grupo");
    }
  };

  const handleSubmit = async (input: GuestGroupCreateInput) => {
    try {
      if (editingGroup) {
        await groupService.update(eventId, {
          id: editingGroup.id,
          ...input,
        });
      } else {
        await groupService.create(eventId, input);
      }
      await loadData();
      setModalOpen(false);
      setEditingGroup(null);
    } catch (error) {
      console.error("Error saving group:", error);
      alert("Error al guardar el grupo");
    }
  };

  const handleAddMembersSubmit = async (guestIds: number[]) => {
    if (!selectedGroup) return;
    try {
      await groupService.addMembers(eventId, selectedGroup.id, guestIds);
      const updatedGroup = await groupService.getById(
        eventId,
        selectedGroup.id,
      );
      setGroupWithMembers(updatedGroup);
      await loadData();
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Error al agregar miembros");
    }
  };

  const handleRemoveMember = async (guestId: number) => {
    if (!selectedGroup) return;
    try {
      await groupService.removeMember(eventId, selectedGroup.id, guestId);
      const updatedGroup = await groupService.getById(
        eventId,
        selectedGroup.id,
      );
      setGroupWithMembers(updatedGroup);
      await loadData();
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error al quitar miembro");
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
          <h1 className="text-3xl font-semibold">Grupos</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Organiza invitados en grupos para facilitar la asignación de mesas.
            Los grupos ayudan a identificar relaciones y proximidad entre invitados.
          </p>
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {groups.length} grupo(s) creado(s)
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Crear grupo
            </button>
          </div>
        </div>

        <GroupTable
          groups={groups}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddMembers={handleAddMembers}
        />
      </div>

      <GroupModal
        open={modalOpen}
        mode={editingGroup ? "edit" : "create"}
        initialGroup={editingGroup}
        onClose={() => {
          setModalOpen(false);
          setEditingGroup(null);
        }}
        onSubmit={handleSubmit}
      />

      <AddMembersModal
        open={membersModalOpen}
        group={groupWithMembers}
        allGuests={allGuests}
        onClose={() => {
          setMembersModalOpen(false);
          setSelectedGroup(null);
          setGroupWithMembers(null);
        }}
        onAddMembers={handleAddMembersSubmit}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
}
