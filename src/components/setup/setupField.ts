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
