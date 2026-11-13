"use client";

import type { GuestRelationDTO } from "@/lib/relations/types";
import { KIND_BADGE_CLASSES, KIND_LABELS } from "@/lib/relations/types";

type RelationTableProps = {
  relations: GuestRelationDTO[];
  onEdit: (relation: GuestRelationDTO) => void;
  onDelete: (relation: GuestRelationDTO) => void;
};

export default function RelationTable({
  relations,
  onEdit,
  onDelete,
}: RelationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Invitado A</th>
            <th className="px-4 py-3">Invitado B</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Intensidad</th>
            <th className="px-4 py-3">Notas</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-zinc-700">
          {relations.map((relation) => (
            <tr key={relation.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">
                {relation.guest_a.full_name}
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900">
                {relation.guest_b.full_name}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${KIND_BADGE_CLASSES[relation.kind]}`}
                >
                  {KIND_LABELS[relation.kind]}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-600">
                {relation.strength}/5
              </td>
              <td className="px-4 py-3 text-zinc-600">
                {relation.notes || <span className="text-zinc-400">—</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(relation)}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(relation)}
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
      {relations.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-zinc-500">
          No hay relaciones. Crea la primera con &quot;Crear relación&quot;.
        </div>
      )}
    </div>
  );
}
