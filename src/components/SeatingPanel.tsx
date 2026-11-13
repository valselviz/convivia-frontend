"use client";

import type { HostMode, SeatingAlert, SeatingWeights, WeightLevel } from "@/lib/seating/types";
import { HOST_MODE_LABELS, WEIGHT_LABELS, WEIGHT_LEVELS } from "@/lib/seating/types";
import { SEATING_PRESETS } from "@/lib/seating/presets";

type SeatingPanelProps = {
  weights: SeatingWeights;
  onWeightsChange: (weights: SeatingWeights) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  alerts: SeatingAlert[];
};

const WeightSelect = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: WeightLevel;
  onChange: (value: WeightLevel) => void;
}) => (
  <label className="grid gap-1 text-xs font-medium text-zinc-600">
    {label}
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as WeightLevel)}
      className="h-9 rounded-lg border border-zinc-300 px-2 text-sm text-zinc-900"
    >
      {WEIGHT_LEVELS.map((level) => (
        <option key={level} value={level}>
          {WEIGHT_LABELS[level]}
        </option>
      ))}
    </select>
  </label>
);

export default function SeatingPanel({
  weights,
  onWeightsChange,
  onGenerate,
  isGenerating,
  alerts,
}: SeatingPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">
          Asignación automática
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(SEATING_PRESETS).map((presetName) => (
            <button
              key={presetName}
              type="button"
              onClick={() => onWeightsChange(SEATING_PRESETS[presetName])}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400"
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <label className="grid gap-1 text-xs font-medium text-zinc-600">
          Host
          <select
            value={weights.host.mode}
            onChange={(e) =>
              onWeightsChange({
                ...weights,
                host: { ...weights.host, mode: e.target.value as HostMode },
              })
            }
            className="h-9 rounded-lg border border-zinc-300 px-2 text-sm text-zinc-900"
          >
            {(Object.keys(HOST_MODE_LABELS) as HostMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {HOST_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </label>
        <WeightSelect
          label="Intensidad host"
          value={weights.host.weight}
          onChange={(weight) =>
            onWeightsChange({ ...weights, host: { ...weights.host, weight } })
          }
        />
        <WeightSelect
          label="Familias unidas"
          value={weights.family}
          onChange={(family) => onWeightsChange({ ...weights, family })}
        />
        <WeightSelect
          label="Afinidad"
          value={weights.affinity}
          onChange={(affinity) => onWeightsChange({ ...weights, affinity })}
        />
        <WeightSelect
          label="Grupos"
          value={weights.groups}
          onChange={(groups) => onWeightsChange({ ...weights, groups })}
        />
        <WeightSelect
          label="Edad similar"
          value={weights.age}
          onChange={(age) => onWeightsChange({ ...weights, age })}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {isGenerating ? "Generando..." : "Generar asignación automática"}
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3">
          {alerts.map((alert, i) => (
            <p key={i} className="text-xs text-amber-800">
              {alert.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
