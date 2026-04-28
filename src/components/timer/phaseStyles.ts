export interface PhaseStyle {
  label: string;
  color: string;
  ringColor: string;
  bg: string;
}

export const PHASE_STYLES: Record<string, PhaseStyle> = {
  work: {
    label: "WORK",
    color: "text-orange-400",
    ringColor: "#fb923c",
    bg: "from-zinc-950 via-orange-950/40 to-zinc-950",
  },
  rest: {
    label: "REST",
    color: "text-teal-400",
    ringColor: "#2dd4bf",
    bg: "from-zinc-950 via-teal-950/40 to-zinc-950",
  },
  done: {
    label: "DONE!",
    color: "text-purple-400",
    ringColor: "#c084fc",
    bg: "from-zinc-950 via-purple-950/40 to-zinc-950",
  },
  idle: {
    label: "",
    color: "text-white",
    ringColor: "#ffffff22",
    bg: "from-zinc-950 to-zinc-950",
  },
};
