export interface PhaseStyle {
  label: string;
  color: string;
  ringColor: string;
  /** Ring color used when the phase is near its end */
  urgencyRingColor: string;
  /** Background gradient class used when the phase is near its end */
  urgencyBg: string;
  /** Ring colors cycled every 10 seconds during the phase (empty = no cycling) */
  colorPalette: string[];
  bg: string;
}

export const PHASE_STYLES: Record<string, PhaseStyle> = {
  countdown: {
    label: "GET READY",
    color: "text-sky-400",
    ringColor: "#38bdf8",
    urgencyRingColor: "#38bdf8",
    urgencyBg: "from-zinc-950 via-sky-950/30 to-zinc-950",
    colorPalette: [],
    bg: "from-zinc-950 via-sky-950/30 to-zinc-950",
  },
  work: {
    label: "WORK",
    color: "text-orange-400",
    ringColor: "#fb923c",
    urgencyRingColor: "#f87171",
    urgencyBg: "from-zinc-950 via-red-900/60 to-zinc-950",
    colorPalette: ["#fb923c", "#f59e0b", "#f97316", "#fbbf24"],
    bg: "from-zinc-950 via-orange-950/40 to-zinc-950",
  },
  rest: {
    label: "REST",
    color: "text-teal-400",
    ringColor: "#2dd4bf",
    urgencyRingColor: "#4ade80",
    urgencyBg: "from-zinc-950 via-green-900/50 to-zinc-950",
    colorPalette: ["#2dd4bf", "#34d399", "#06b6d4", "#67e8f9"],
    bg: "from-zinc-950 via-teal-950/40 to-zinc-950",
  },
  done: {
    label: "DONE!",
    color: "text-purple-400",
    ringColor: "#c084fc",
    urgencyRingColor: "#c084fc",
    urgencyBg: "from-zinc-950 via-purple-950/40 to-zinc-950",
    colorPalette: [],
    bg: "from-zinc-950 via-purple-950/40 to-zinc-950",
  },
  idle: {
    label: "",
    color: "text-white",
    ringColor: "#ffffff22",
    urgencyRingColor: "#ffffff22",
    urgencyBg: "from-zinc-950 to-zinc-950",
    colorPalette: [],
    bg: "from-zinc-950 to-zinc-950",
  },
};
