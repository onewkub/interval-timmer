const RING_RADIUS = 120;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface ProgressRingProps {
  progress: number; // 0 → 1 (1 = full)
  color: string;
}

export function ProgressRing({ progress, color }: ProgressRingProps) {
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  return (
    <svg
      width="280"
      height="280"
      viewBox="0 0 280 280"
      className="-rotate-90"
      aria-hidden
    >
      {/* Track */}
      <circle
        cx="140"
        cy="140"
        r={RING_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="12"
      />
      {/* Progress arc */}
      <circle
        cx="140"
        cy="140"
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s linear" }}
      />
    </svg>
  );
}
