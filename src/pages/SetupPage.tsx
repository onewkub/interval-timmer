import { useState } from "react";
import { useNavigate } from "react-router";
import { Volume2, VolumeX } from "lucide-react";
import type { TimerConfig } from "@/hooks/useIntervalTimer";
import { useAudioSettings } from "@/hooks/useAudioSettings";
import { FIELDS, NumberInput } from "@/components/setup/NumberInput";

export function SetupPage() {
  const navigate = useNavigate();
  const { volume, muted, changeVolume, toggleMute } = useAudioSettings();

  const [config, setConfig] = useState<TimerConfig>({
    workSeconds: 40,
    restSeconds: 20,
    sets: 5,
  });

  const update = (key: keyof TimerConfig) => (value: number) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const totalSeconds = (config.workSeconds + config.restSeconds) * config.sets;

  const formatTotal = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return s === 0 ? `${m} min` : `${m} min ${s}s`;
  };

  const handleStart = () => {
    navigate("/timer", { state: config });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-1 text-center">
        <div className="mb-2 text-4xl">⏱</div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Interval Timer
        </h1>
        <p className="text-sm text-white/50">Set up your workout</p>

        {/* Volume control */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="text-white/50 transition hover:text-white active:scale-95"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            disabled={muted}
            className="w-28 accent-orange-400 disabled:opacity-30"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Inputs */}
      <div className="w-full max-w-sm space-y-3">
        {FIELDS.map((field) => (
          <NumberInput
            key={field.key}
            field={field}
            value={config[field.key]}
            onChange={update(field.key)}
          />
        ))}

        {/* Summary */}
        <div className="flex items-center justify-center gap-2 py-1 text-sm text-white/40">
          <span>Total workout ~</span>
          <span className="font-semibold text-white/70">
            {formatTotal(totalSeconds)}
          </span>
        </div>

        {/* Start */}
        <button
          onClick={handleStart}
          className="mt-2 w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold tracking-wide text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 active:scale-[0.98]"
        >
          START WORKOUT
        </button>
      </div>
    </div>
  );
}
