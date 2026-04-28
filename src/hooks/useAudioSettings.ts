import { useCallback, useEffect, useState } from "react";
import { setAudioMuted, setAudioVolume } from "@/lib/audio";

const STORAGE_KEY = "audio-settings";

function loadSettings(): { volume: number; muted: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { volume: number; muted: boolean };
  } catch {}
  return { volume: 0.8, muted: false };
}

export function useAudioSettings() {
  const [volume, setVolume] = useState(() => loadSettings().volume);
  const [muted, setMuted] = useState(() => loadSettings().muted);

  // Apply persisted settings on mount
  useEffect(() => {
    const s = loadSettings();
    setAudioVolume(s.volume);
    setAudioMuted(s.muted);
  }, []);

  const changeVolume = useCallback(
    (vol: number) => {
      setVolume(vol);
      setAudioVolume(vol);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: vol, muted }));
    },
    [muted],
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted: next }));
  }, [muted, volume]);

  return { volume, muted, changeVolume, toggleMute };
}
