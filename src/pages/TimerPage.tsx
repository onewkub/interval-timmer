import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Volume2, VolumeX } from "lucide-react";
import { useIntervalTimer } from "@/hooks/useIntervalTimer";
import type { TimerConfig } from "@/hooks/useIntervalTimer";
import { useAudioSettings } from "@/hooks/useAudioSettings";
import { useWakeLock } from "@/hooks/useWakeLock";
import { ProgressRing } from "@/components/timer/ProgressRing";
import { PHASE_STYLES } from "@/components/timer/phaseStyles";

// ─── Timer Page ───────────────────────────────────────────────────────────────
export function TimerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state as TimerConfig | null;

  const { muted, toggleMute } = useAudioSettings();

  const {
    phase,
    timeRemaining,
    currentSet,
    totalSets,
    isPaused,
    start,
    pause,
    resume,
    stop,
  } = useIntervalTimer();

  // Redirect if no config was passed
  useEffect(() => {
    if (!config) {
      navigate("/", { replace: true });
      return;
    }
    start(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fullscreen
  useEffect(() => {
    const el = document.documentElement;
    el.requestFullscreen?.().catch(() => {
      /* ignore — desktop won't always grant */
    });
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, []);

  // Wake Lock — keep screen on while timer is actively running
  useWakeLock(phase !== "idle" && phase !== "done" && !isPaused);

  const handleStop = useCallback(() => {
    stop();
    navigate("/", { replace: true });
  }, [stop, navigate]);

  const handleDoneBack = useCallback(() => {
    stop();
    navigate("/", { replace: true });
  }, [stop, navigate]);

  const handleRestart = useCallback(() => {
    if (config) start(config);
  }, [config, start]);

  if (!config) return null;

  const style = PHASE_STYLES[phase] ?? PHASE_STYLES.idle;

  // Calculate ring progress (1 → 0 as time counts down)
  let phaseDuration = 1;
  if (phase === "countdown") phaseDuration = 3;
  else if (phase === "work") phaseDuration = config.workSeconds;
  else if (phase === "rest") phaseDuration = config.restSeconds;

  const progress = phase === "done" ? 1 : timeRemaining / phaseDuration;

  const isActive = phase !== "idle" && phase !== "done";

  // ── Feature 1: Urgency color shift ────────────────────────────────────────
  // Trigger when ≤ last 10 s or ≤ 20% of the phase, whichever is shorter.
  // Only applies to work / rest (not countdown).
  const urgencyThreshold = Math.min(10, Math.ceil(phaseDuration * 0.2));
  const isNearEnd =
    (phase === "work" || phase === "rest") &&
    timeRemaining > 0 &&
    timeRemaining <= urgencyThreshold;

  // ── Feature 2: Every-10-second palette cycling ────────────────────────────
  const elapsed = phaseDuration - timeRemaining;
  const paletteIndex =
    style.colorPalette.length > 0
      ? Math.floor(elapsed / 10) % style.colorPalette.length
      : 0;

  // Resolved ring color: urgency overrides palette, palette overrides default
  const activeRingColor = isNearEnd
    ? style.urgencyRingColor
    : style.colorPalette.length > 0 && (phase === "work" || phase === "rest")
      ? style.colorPalette[paletteIndex]
      : style.ringColor;

  // Resolved background gradient class
  const activeBg = isNearEnd ? style.urgencyBg : style.bg;

  // ── Feature 3: Last-3-second number bounce ────────────────────────────────
  const isLastThree =
    (phase === "work" || phase === "rest") &&
    timeRemaining > 0 &&
    timeRemaining <= 3;

  // ── Feature 5 & 6: Ring gradient ramp + background intensity ramp ─────────
  // urgentRingColor drives the SVG gradient in ProgressRing for work / rest.
  const urgentRingColor =
    phase === "work" || phase === "rest" ? style.urgencyRingColor : undefined;

  // Background intensity: a translucent color overlay that brightens as time runs out.
  const bgIntensityOpacity = (phase === "work" || phase === "rest") && !isNearEnd
    ? (1 - progress) * 0.18
    : 0;
  const bgOverlayColor =
    phase === "work"
      ? `rgba(234,88,12,${bgIntensityOpacity})`
      : phase === "rest"
        ? `rgba(20,184,166,${bgIntensityOpacity})`
        : "transparent";

  return (
    // `isolate` creates a stacking context so z-index values on children are
    // scoped to this container and overlays work as expected.
    <div
      className={`isolate relative flex min-h-svh flex-col items-center justify-between overflow-hidden bg-linear-to-b ${activeBg} px-4 transition-all duration-700`}
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 2rem)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 2rem)",
      }}
    >
      {/* Feature 6 — background intensity ramp (behind content, no z-index) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: bgOverlayColor,
          transition: "background-color 1s ease",
        }}
      />

      {/* Feature 4 — phase-transition flash overlay (above content, remounts on phase change) */}
      <div
        key={phase}
        className="animate-phase-flash pointer-events-none absolute inset-0 z-50"
        style={{ backgroundColor: style.ringColor }}
      />

      {/* Top — set counter */}
      <div className="relative z-10 flex w-full max-w-sm items-center justify-between pt-2">
        <button
          onClick={handleStop}
          aria-label="Stop and go back"
          className="rounded-xl px-3 py-2 text-sm font-medium text-white/40 transition hover:text-white/80 active:scale-95"
        >
          ✕ Stop
        </button>

        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="rounded-xl p-2 text-white/40 transition hover:text-white/80 active:scale-95"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {isActive && phase !== "countdown" && (
          <div className="flex flex-col items-end text-right">
            <span className="text-xs uppercase tracking-widest text-white/40">
              Set
            </span>
            <span className="text-lg font-bold text-white">
              {currentSet}
              <span className="text-sm font-normal text-white/40">
                /{totalSets}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Middle — ring + number + label */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Phase label */}
        <span
          className={`text-sm font-bold uppercase tracking-[0.25em] ${style.color} transition-colors duration-500`}
        >
          {style.label}
        </span>

        {/* Ring with number inside */}
        <div className="relative flex items-center justify-center">
          {/* Feature 5 — urgentColor drives the gradient ramp inside the ring */}
          <ProgressRing
            progress={progress}
            color={activeRingColor}
            urgentColor={urgentRingColor}
          />

          <div className="absolute flex flex-col items-center">
            {phase === "done" ? (
              <span className="text-6xl">🎉</span>
            ) : (
              // Feature 3 — last-3-second number pop: re-keyed every second so
              // the animation fires fresh each tick; bounces on 3-2-1.
              <span
                key={isLastThree ? timeRemaining : "normal"}
                className={`text-7xl font-bold tabular-nums text-white ${
                  isLastThree ? "animate-number-pop" : "transition-all duration-300"
                }`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {timeRemaining}
              </span>
            )}
          </div>
        </div>

        {phase === "done" ? (
          <div className="flex flex-col items-center gap-1">
            <p className="text-2xl font-bold text-white">Workout Complete!</p>
            <p className="text-sm text-white/50">
              {totalSets} set{totalSets !== 1 ? "s" : ""} finished
            </p>
          </div>
        ) : (
          <div className="h-6 text-sm text-white/40">
            {isPaused && (
              <span className="animate-pulse font-medium text-yellow-300/70">
                PAUSED
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom — controls */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-3">
        {phase === "done" ? (
          <>
            <button
              onClick={handleRestart}
              className="w-full rounded-2xl bg-orange-500 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 active:scale-[0.98]"
            >
              DO IT AGAIN
            </button>
            <button
              onClick={handleDoneBack}
              className="w-full rounded-2xl border border-white/15 py-3 text-sm font-medium text-white/60 transition hover:text-white/90 active:scale-[0.98]"
            >
              Back to Setup
            </button>
          </>
        ) : phase === "countdown" ? (
          <div className="w-full py-4" aria-hidden />
        ) : (
          <button
            onClick={isPaused ? resume : pause}
            className={`w-full rounded-2xl py-4 text-base font-bold tracking-wide text-white shadow-lg transition active:scale-[0.98] ${
              isPaused
                ? "bg-orange-500 shadow-orange-500/30 hover:bg-orange-400"
                : "border border-white/15 bg-white/10 hover:bg-white/15"
            }`}
          >
            {isPaused ? "▶  RESUME" : "⏸  PAUSE"}
          </button>
        )}
      </div>
    </div>
  );
}

