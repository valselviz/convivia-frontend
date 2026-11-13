"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { setLastEventId } from "@/lib/events/storage";
import { eventsService, type EventDTO } from "@/lib/events/service";
import { tablesService } from "@/lib/tables/service";
import type { TableDTO } from "@/lib/tables/types";
import { SHAPE_LABELS } from "@/lib/tables/types";
import { guestService } from "@/lib/guests/service";
import TableModal, { type TableFormInput } from "@/components/TableModal";

const VenueCanvas = dynamic(() => import("@/components/VenueCanvas"), {
  ssr: false,
});

type TablesClientProps = {
  eventId: number;
};

export default function TablesClient({ eventId }: TablesClientProps) {
  const [tables, setTables] = useState<TableDTO[]>([]);
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableDTO | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [roomWidthInput, setRoomWidthInput] = useState("15");
  const [roomHeightInput, setRoomHeightInput] = useState("10");
  const [confirmedGuestCount, setConfirmedGuestCount] = useState(0);

  useEffect(() => {
    setLastEventId(eventId);
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tablesData, eventData, confirmedGuests] = await Promise.all([
        tablesService.list(eventId),
        eventsService.getById(eventId),
        guestService.list(eventId, { status: "CONFIRMED" }),
      ]);
      setTables(tablesData);
      setEvent(eventData);
      setRoomWidthInput(String(eventData.room_width_m));
      setRoomHeightInput(String(eventData.room_height_m));
      setConfirmedGuestCount(confirmedGuests.length);
    } catch (error) {
      console.error("Error loading tables:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingTable(null);
    setModalOpen(true);
  };

  const handleEdit = (table: TableDTO) => {
    setEditingTable(table);
    setModalOpen(true);
  };

  const handleDelete = async (table: TableDTO) => {
    const confirmDelete = window.confirm(`¿Borrar la mesa "${table.name}"?`);
    if (!confirmDelete) return;

    try {
      await tablesService.delete(eventId, table.id);
      if (selectedTableId === table.id) setSelectedTableId(null);
      await loadData();
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("Error al borrar la mesa");
    }
  };

  const handleSubmit = async (input: TableFormInput) => {
    try {
      if (editingTable) {
        await tablesService.update(eventId, { id: editingTable.id, ...input });
      } else {
        await tablesService.create(eventId, input);
      }
      await loadData();
      setModalOpen(false);
      setEditingTable(null);
    } catch (error) {
      console.error("Error saving table:", error);
      alert(
        error instanceof Error ? error.message : "Error al guardar la mesa",
      );
    }
  };

  const handlePlace = async (table: TableDTO) => {
    if (!event) return;
    const stepM = Math.max(table.width, table.height) + 1;
    const margin = Math.max(table.width, table.height) / 2 + 0.2;

    for (let y = margin; y <= event.room_height_m - margin; y += stepM) {
      for (let x = margin; x <= event.room_width_m - margin; x += stepM) {
        try {
          await tablesService.update(eventId, {
            id: table.id,
            pos_x: x,
            pos_y: y,
          });
          await loadData();
          return;
        } catch {
          // ese lugar no sirve, probamos el siguiente
        }
      }
    }
    alert(
      "No encontré un lugar libre para esta mesa. Movés alguna otra para hacer espacio, o agrandá el salón.",
    );
  };

  const handleTableMove = async (
    table: TableDTO,
    posXM: number,
    posYM: number,
  ) => {
    const previous = tables;
    setTables((prev) =>
      prev.map((t) =>
        t.id === table.id ? { ...t, pos_x: posXM, pos_y: posYM } : t,
      ),
    );
    try {
      await tablesService.update(eventId, {
        id: table.id,
        pos_x: posXM,
        pos_y: posYM,
      });
    } catch (error) {
      setTables(previous);
      alert(
        error instanceof Error ? error.message : "No se pudo mover la mesa",
      );
    }
  };

  const handleRoomSizeSave = async () => {
    const width = Number(roomWidthInput);
    const height = Number(roomHeightInput);
    if (!width || !height || width <= 0 || height <= 0) return;
    try {
      const updated = await eventsService.updateRoomSize(
        eventId,
        width,
        height,
      );
      setEvent(updated);
    } catch (error) {
      console.error("Error saving room size:", error);
      alert("Error al guardar el tamaño del espacio");
    }
  };

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <p className="text-zinc-500">Cargando...</p>
        </div>
      </div>
    );
  }

  const unplacedTables = tables.filter((t) => t.pos_x === null);
  const placedTables = tables.filter((t) => t.pos_x !== null);
  const totalCapacity = tables.reduce((sum, t) => sum + t.seats, 0);
  const capacityShortfall = confirmedGuestCount - totalCapacity;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Mesas</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Ubicá las mesas en el espacio arrastrándolas. No se pueden
            superponer ni quedar a menos de 1 metro una de otra.
          </p>
        </header>

        {capacityShortfall > 0 && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            La capacidad total de las mesas ({totalCapacity} puestos) es menor
            que la cantidad de invitados confirmados ({confirmedGuestCount}) —
            faltan {capacityShortfall} puestos.
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              {tables.length} mesa(s) creada(s) · {placedTables.length}{" "}
              ubicada(s) · {totalCapacity} puestos totales ·{" "}
              {confirmedGuestCount} confirmados
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                Espacio (m)
                <input
                  type="number"
                  step={0.5}
                  min={1}
                  value={roomWidthInput}
                  onChange={(e) => setRoomWidthInput(e.target.value)}
                  className="h-9 w-16 rounded-lg border border-zinc-300 px-2 text-sm"
                />
                ×
                <input
                  type="number"
                  step={0.5}
                  min={1}
                  value={roomHeightInput}
                  onChange={(e) => setRoomHeightInput(e.target.value)}
                  className="h-9 w-16 rounded-lg border border-zinc-300 px-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleRoomSizeSave}
                  className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400"
                >
                  Guardar
                </button>
              </label>
              <button
                type="button"
                onClick={openCreate}
                className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Crear mesa
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <VenueCanvas
            tables={placedTables}
            roomWidthM={event.room_width_m}
            roomHeightM={event.room_height_m}
            onTableMove={handleTableMove}
            selectedTableId={selectedTableId}
            onSelectTable={setSelectedTableId}
          />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-zinc-700">
              Mesas sin ubicar
            </h3>
            {unplacedTables.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Todas las mesas están ubicadas en el canvas.
              </p>
            ) : (
              unplacedTables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {table.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {SHAPE_LABELS[table.shape]} · {table.seats} puestos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlace(table)}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                  >
                    Ubicar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Forma</th>
                <th className="px-4 py-3">Puestos</th>
                <th className="px-4 py-3">Tamaño</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {table.name}
                  </td>
                  <td className="px-4 py-3">{SHAPE_LABELS[table.shape]}</td>
                  <td className="px-4 py-3">
                    {table.min_seats != null
                      ? `${table.min_seats}–${table.seats}`
                      : table.seats}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {table.width}m × {table.height}m
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(table)}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(table)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tables.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">
              No hay mesas. Creá la primera con &quot;Crear mesa&quot;.
            </div>
          )}
        </div>
      </div>

      <TableModal
        open={modalOpen}
        mode={editingTable ? "edit" : "create"}
        initialTable={editingTable}
        onClose={() => {
          setModalOpen(false);
          setEditingTable(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
