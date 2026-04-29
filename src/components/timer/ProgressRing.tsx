const RING_RADIUS = 120;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface ProgressRingProps {
  progress: number; // 0 → 1 (1 = full)
  color: string;
  /** When provided, a gradient ramps from `color` toward `urgentColor` as progress decreases */
  urgentColor?: string;
  /** Unique ID for the SVG gradient element — prevents conflicts when multiple rings are on screen */
  gradientId?: string;
}

export function ProgressRing({ progress, color, urgentColor, gradientId = "ring-grad" }: ProgressRingProps) {
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const useGradient = !!urgentColor;
  // The urgency color bleeds in from the leading edge as progress decreases.
  // At progress=1 the gradient is almost entirely `color`; at progress=0 it is `urgentColor`.
  const urgentStopOffset = `${Math.round((1 - progress) * 100)}%`;

  return (
    <svg
      width="280"
      height="280"
      viewBox="0 0 280 280"
      className="-rotate-90"
      aria-hidden
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset={urgentStopOffset} stopColor={urgentColor} />
            <stop offset="100%" stopColor={urgentColor} />
          </linearGradient>
        </defs>
      )}
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
        stroke={useGradient ? `url(#${gradientId})` : color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.7s ease" }}
      />
    </svg>
  );
}
