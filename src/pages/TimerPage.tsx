import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Volume2, VolumeX } from "lucide-react";
import { useIntervalTimer } from "@/hooks/useIntervalTimer";
import type { TimerConfig } from "@/hooks/useIntervalTimer";
import { useAudioSettings } from "@/hooks/useAudioSettings";
import { ProgressRing } from "@/components/timer/ProgressRing";
import { PHASE_STYLES } from "@/components/timer/phaseStyles";

// ─── Timer Page ───────────────────────────────────────────────────────────────
export function TimerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state as TimerConfig | null;

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
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

  // Wake Lock — keep screen on during workout
  useEffect(() => {
    if ("wakeLock" in navigator) {
      navigator.wakeLock
        .request("screen")
        .then((lock) => {
          wakeLockRef.current = lock;
        })
        .catch(() => {
          /* graceful degradation */
        });
    }
    return () => {
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

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

  return (
    <div
      className={`flex min-h-svh flex-col items-center justify-between bg-linear-to-b ${style.bg} px-4 py-safe-or-8 transition-all duration-700`}
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 2rem)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 2rem)",
      }}
    >
      {/* Top — set counter */}
      <div className="flex w-full max-w-sm items-center justify-between pt-2">
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
      <div className="flex flex-col items-center gap-4">
        {/* Phase label */}
        <span
          className={`text-sm font-bold uppercase tracking-[0.25em] ${style.color} transition-colors duration-500`}
        >
          {style.label}
        </span>

        {/* Ring with number inside */}
        <div className="relative flex items-center justify-center">
          <ProgressRing progress={progress} color={style.ringColor} />

          <div className="absolute flex flex-col items-center">
            {phase === "done" ? (
              <span className="text-6xl">🎉</span>
            ) : (
              <span
                className={`text-7xl font-bold tabular-nums text-white transition-all duration-300`}
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
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
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
