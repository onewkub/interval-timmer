import type { TimerConfig } from "@/hooks/useIntervalTimer";

export interface FieldConfig {
  key: keyof TimerConfig;
  label: string;
  description: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
  color: string;
  icon: string;
}

export const FIELDS: FieldConfig[] = [
  {
    key: "workSeconds",
    label: "Work",
    description: "Time per work interval",
    min: 5,
    max: 3600,
    defaultValue: 40,
    unit: "sec",
    color: "text-orange-400",
    icon: "🔥",
  },
  {
    key: "restSeconds",
    label: "Rest",
    description: "Time per rest interval",
    min: 5,
    max: 3600,
    defaultValue: 20,
    unit: "sec",
    color: "text-teal-400",
    icon: "💤",
  },
  {
    key: "sets",
    label: "Sets",
    description: "Number of rounds",
    min: 1,
    max: 99,
    defaultValue: 5,
    unit: "rounds",
    color: "text-purple-400",
    icon: "🔁",
  },
];

export function formatSeconds(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

interface NumberInputProps {
  field: FieldConfig;
  value: number;
  onChange: (v: number) => void;
}

export function NumberInput({ field, value, onChange }: NumberInputProps) {
  const decrement = () => onChange(Math.max(field.min, value - 1));
  const increment = () => onChange(Math.min(field.max, value + 1));

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">{field.icon}</span>
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-widest ${field.color}`}
          >
            {field.label}
          </p>
          <p className="text-xs text-white/40">{field.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={decrement}
          disabled={value <= field.min}
          aria-label={`Decrease ${field.label}`}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-white transition active:scale-95 disabled:opacity-30"
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums text-white">
            {field.key === "sets" ? value : formatSeconds(value)}
          </span>
          {field.key !== "sets" && (
            <span className="text-xs text-white/40">{value} seconds</span>
          )}
        </div>

        <button
          onClick={increment}
          disabled={value >= field.max}
          aria-label={`Increase ${field.label}`}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-white transition active:scale-95 disabled:opacity-30"
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={field.min}
        max={field.key === "sets" ? field.max : Math.min(300, field.max)}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-current"
        aria-label={`${field.label} slider`}
      />
    </div>
  );
}
