"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BulkActions from "@/components/BulkActions";
import HostsSetupModal from "@/components/HostsSetupModal";
import GuestFiltersModal from "@/components/GuestFiltersModal";
import GuestSearch from "@/components/GuestSearch";
import GuestModal from "@/components/GuestModal";
import GuestTable from "@/components/GuestTable";
import AddToGroupModal from "@/components/AddToGroupModal";
import type { GuestFiltersValue } from "@/components/GuestFilters";
import { hostsService } from "@/lib/hosts/service";
import { guestService } from "@/lib/guests/service";
import type { Guest, GuestCreateInput, GuestStatus } from "@/lib/guests/types";

const defaultFilters: GuestFiltersValue = {
  host: "all",
  type: "all",
  status: "all",
  plusOne: "all",
  order: "name",
};

export default function GuestsClient() {
  const searchParams = useSearchParams();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filters, setFilters] = useState<GuestFiltersValue>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [hosts, setHosts] = useState<string[] | null>(null);
  const [isHostsModalOpen, setIsHostsModalOpen] = useState(false);
  const [isHostsLoading, setIsHostsLoading] = useState(true);
  const [isAddToGroupModalOpen, setIsAddToGroupModalOpen] = useState(false);

  useEffect(() => {
    const loadGuests = async () => {
      const params = {
        search: searchQuery || undefined,
        hostName: filters.host !== "all" ? filters.host : undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        plusOne: filters.plusOne,
        order: filters.order,
      };
      const data = await guestService.list(params);
      setGuests(data);
    };
    loadGuests();
  }, [filters, searchQuery]);

  useEffect(() => {
    const shouldSetup = searchParams.get("setup") === "hosts";

    hostsService
      .get()
      .then((storedHosts) => {
        setHosts(storedHosts);
        const empty = storedHosts.length === 0;
        setIsHostsModalOpen(shouldSetup || empty);
      })
      .catch(() => {
        setHosts(null);
        setIsHostsModalOpen(true);
      })
      .finally(() => setIsHostsLoading(false));
  }, [searchParams]);

  // Guests already come filtered and sorted from backend
  const filteredGuests = guests;

  const mainGuests = useMemo(
    () => guests.filter((guest) => guest.guest_type === "MAIN_GUEST"),
    [guests],
  );

  const mainGuestNameById = useMemo(
    () =>
      mainGuests.reduce<Record<number, string>>((acc, guest) => {
        acc[guest.id] = guest.full_name;
        return acc;
      }, {}),
    [mainGuests],
  );

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleAll = (selectAll: boolean) => {
    setSelectedIds(selectAll ? filteredGuests.map((guest) => guest.id) : []);
  };

  const openCreate = () => {
    setEditingGuest(null);
    setModalOpen(true);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setModalOpen(true);
  };

  const handleAddPlusOne = (mainGuest: Guest) => {
    // Crear un nuevo invitado +1 asociado al invitado principal
    // Usamos un objeto Guest temporal con id 0 para que el modal lo trate como nuevo
    const plusOneGuest: Guest = {
      id: 0,
      full_name: "",
      guest_type: "PLUS_ONE",
      main_guest_id: mainGuest.id,
      host_name: mainGuest.host_name,
      gender: "FEMALE", // Valor por defecto, el usuario puede cambiarlo en el modal
      age_range: "ADULT",
      notes: null,
      status: "INVITED",
    };
    setEditingGuest(plusOneGuest);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Borrar ${selectedIds.length} invitado(s)? Esta accion no se puede deshacer.`,
    );
    if (!confirmDelete) return;
    await guestService.delete(selectedIds);
    // Recargar la lista desde el backend
    const params = {
      search: searchQuery || undefined,
      hostName: filters.host !== "all" ? filters.host : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      plusOne: filters.plusOne,
      order: filters.order,
    };
    const data = await guestService.list(params);
    setGuests(data);
    setSelectedIds([]);
  };

  const handleStatusChange = async (status: GuestStatus) => {
    if (selectedIds.length === 0) return;
    await guestService.updateStatus(selectedIds, status);
    // Recargar la lista desde el backend
    const params = {
      search: searchQuery || undefined,
      hostName: filters.host !== "all" ? filters.host : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      plusOne: filters.plusOne,
      order: filters.order,
    };
    const data = await guestService.list(params);
    setGuests(data);
  };

  const handleSubmit = async (input: GuestCreateInput) => {
    // id 0 = new guest (e.g. +1 from button); only update if it has a real id
    if (editingGuest && editingGuest.id !== 0) {
      await guestService.update({
        id: editingGuest.id,
        ...input,
      });
    } else {
      await guestService.create(input);
    }
    // Recargar la lista desde el backend
    const params = {
      search: searchQuery || undefined,
      hostName: filters.host !== "all" ? filters.host : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      plusOne: filters.plusOne,
      order: filters.order,
    };
    const data = await guestService.list(params);
    setGuests(data);
    setModalOpen(false);
    setSelectedIds([]);
  };

  const handleHostsSave = (nextHosts: string[]) => {
    setIsHostsLoading(true);
    hostsService
      .upsert(nextHosts)
      .then((savedHosts) => {
        setHosts(savedHosts);
        setIsHostsModalOpen(false);
      })
      .finally(() => setIsHostsLoading(false));
  };

  const handleHostsClose = () => {
    setIsHostsModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.host !== "all" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.plusOne !== "all" ||
    filters.order !== "name";

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Invitados</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Administra invitados, filtra por host y tipo, y usa acciones
            masivas para confirmar o declinar asistencia.
          </p>
          {hosts && hosts.length > 0 && (
            <div className="text-sm font-semibold text-zinc-700">
              Hosts: {hosts.join(" & ")}
            </div>
          )}
        </header>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
            <GuestSearch value={searchQuery} onChange={setSearchQuery} />
            <button
              type="button"
              onClick={() => setIsFiltersModalOpen(true)}
              className={`h-10 rounded-lg border px-4 text-sm font-semibold transition ${
                hasActiveFilters
                  ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                  : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400"
              }`}
            >
              Filtrar
              {hasActiveFilters && (
                <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                  {[
                    filters.host !== "all",
                    filters.type !== "all",
                    filters.status !== "all",
                    filters.plusOne !== "all",
                    filters.order !== "name",
                  ].filter(Boolean).length}
                </span>
              )}
            </button>
            <div className="lg:ml-auto">
              <BulkActions
                selectedCount={selectedIds.length}
                onCreate={openCreate}
                onAddToGroup={() => setIsAddToGroupModalOpen(true)}
                onConfirm={() => handleStatusChange("CONFIRMED")}
                onDecline={() => handleStatusChange("DECLINED")}
                onDelete={handleDelete}
              />
            </div>
          </div>
          <div className="text-xs text-zinc-500">
            {filteredGuests.length} invitados con los filtros actuales ·{" "}
            {selectedIds.length} seleccionados
          </div>
        </div>

        <GuestTable
          guests={filteredGuests}
          mainGuestNameById={mainGuestNameById}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          onEdit={handleEdit}
          onAddPlusOne={handleAddPlusOne}
        />
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          type="button"
          onClick={() => setIsHostsModalOpen(true)}
          disabled={isHostsLoading}
          className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-zinc-900 shadow-md ring-1 ring-zinc-200 transition hover:bg-zinc-50"
        >
          {isHostsLoading ? "Cargando..." : "Editar hosts"}
        </button>
      </div>

      <GuestFiltersModal
        open={isFiltersModalOpen}
        filters={filters}
        hosts={hosts ?? []}
        onClose={() => setIsFiltersModalOpen(false)}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      <HostsSetupModal
        open={isHostsModalOpen}
        initialHosts={hosts}
        onClose={handleHostsClose}
        onSubmit={handleHostsSave}
      />

      <GuestModal
        open={modalOpen}
        mode={editingGuest && editingGuest.id !== 0 ? "edit" : "create"}
        initialGuest={editingGuest}
        mainGuests={mainGuests}
        hosts={hosts ?? []}
        onClose={() => {
          setModalOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={handleSubmit}
      />

      <AddToGroupModal
        open={isAddToGroupModalOpen}
        guestIds={selectedIds}
        onClose={() => setIsAddToGroupModalOpen(false)}
        onSuccess={() => {
          setIsAddToGroupModalOpen(false);
          setSelectedIds([]);
        }}
      />
    </div>
  );
}

