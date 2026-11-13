"use client";

import { useEffect, useState } from "react";
import type { TableDTO, TableShape } from "@/lib/tables/types";
import { DEFAULT_SIZE_BY_SHAPE, SHAPE_LABELS } from "@/lib/tables/types";

export type TableFormInput = {
  name: string;
  shape: TableShape;
  seats: number;
  min_seats: number | null;
  width: number;
  height: number;
};

type TableModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialTable: TableDTO | null;
  onClose: () => void;
  onSubmit: (input: TableFormInput) => void;
};

export default function TableModal({
  open,
  mode,
  initialTable,
  onClose,
  onSubmit,
}: TableModalProps) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState<TableShape>("redonda");
  const [seats, setSeats] = useState(8);
  const [minSeatsInput, setMinSeatsInput] = useState("");
  const [width, setWidth] = useState(DEFAULT_SIZE_BY_SHAPE.redonda.width);
  const [height, setHeight] = useState(DEFAULT_SIZE_BY_SHAPE.redonda.height);

  useEffect(() => {
    if (!open) return;
    if (initialTable) {
      setName(initialTable.name);
      setShape(initialTable.shape);
      setSeats(initialTable.seats);
      setMinSeatsInput(
        initialTable.min_seats != null ? String(initialTable.min_seats) : "",
      );
      setWidth(initialTable.width);
      setHeight(initialTable.height);
    } else {
      setName("");
      setShape("redonda");
      setSeats(8);
      setMinSeatsInput("");
      setWidth(DEFAULT_SIZE_BY_SHAPE.redonda.width);
      setHeight(DEFAULT_SIZE_BY_SHAPE.redonda.height);
    }
  }, [open, initialTable]);

  if (!open) return null;

  const handleShapeChange = (next: TableShape) => {
    setShape(next);
    setWidth(DEFAULT_SIZE_BY_SHAPE[next].width);
    setHeight(DEFAULT_SIZE_BY_SHAPE[next].height);
  };

  const minSeats = minSeatsInput.trim() === "" ? null : Number(minSeatsInput);
  const minSeatsError = minSeats != null && minSeats > seats;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minSeatsError) return;
    onSubmit({
      name: name.trim(),
      shape,
      seats,
      min_seats: minSeats,
      width,
      height: shape === "redonda" ? width : height,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {mode === "create" ? "Crear mesa" : "Editar mesa"}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              placeholder="Ej. Mesa 1"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Forma
              <select
                value={shape}
                onChange={(e) => handleShapeChange(e.target.value as TableShape)}
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              >
                {(Object.keys(SHAPE_LABELS) as TableShape[]).map((s) => (
                  <option key={s} value={s}>
                    {SHAPE_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Puestos (máximo)
              <input
                required
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Capacidad mínima (opcional)
              <input
                type="number"
                min={1}
                value={minSeatsInput}
                onChange={(e) => setMinSeatsInput(e.target.value)}
                placeholder="Sin mínimo"
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              />
              {minSeatsError && (
                <span className="text-xs font-normal text-red-600">
                  No puede superar el máximo de puestos ({seats}).
                </span>
              )}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              {shape === "redonda" ? "Diámetro (m)" : "Ancho (m)"}
              <input
                required
                type="number"
                step={0.1}
                min={0.1}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
              />
            </label>
            {shape === "rectangular" && (
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Alto (m)
                <input
                  required
                  type="number"
                  step={0.1}
                  min={0.1}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="h-11 rounded-lg border border-zinc-300 px-3 text-sm"
                />
              </label>
            )}
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
              disabled={minSeatsError}
              className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
