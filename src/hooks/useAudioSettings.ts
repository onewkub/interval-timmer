import { useCallback, useEffect, useState } from "react";
import {
  setAudioLanguage,
  setAudioMuted,
  setAudioVolume,
  type SoundLanguage,
} from "@/lib/audio";

const STORAGE_KEY = "audio-settings";

interface AudioSettings {
  volume: number;
  muted: boolean;
  language: SoundLanguage;
}

function loadSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AudioSettings>;
      return {
        volume: parsed.volume ?? 0.8,
        muted: parsed.muted ?? false,
        language: parsed.language ?? "en",
      };
    }
  } catch {
    // ignore malformed stored settings
  }
  return { volume: 0.8, muted: false, language: "en" };
}

export function useAudioSettings() {
  const [volume, setVolume] = useState(() => loadSettings().volume);
  const [muted, setMuted] = useState(() => loadSettings().muted);
  const [language, setLanguage] = useState<SoundLanguage>(
    () => loadSettings().language,
  );

  // Apply persisted settings on mount
  useEffect(() => {
    const s = loadSettings();
    setAudioVolume(s.volume);
    setAudioMuted(s.muted);
    setAudioLanguage(s.language);
  }, []);

  const persist = useCallback(
    (vol: number, mut: boolean, lang: SoundLanguage) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ volume: vol, muted: mut, language: lang }),
      );
    },
    [],
  );

  const changeVolume = useCallback(
    (vol: number) => {
      setVolume(vol);
      setAudioVolume(vol);
      persist(vol, muted, language);
    },
    [muted, language, persist],
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    persist(volume, next, language);
  }, [muted, volume, language, persist]);

  const changeLanguage = useCallback(
    (lang: SoundLanguage) => {
      setLanguage(lang);
      setAudioLanguage(lang);
      persist(volume, muted, lang);
    },
    [volume, muted, persist],
  );

  return { volume, muted, language, changeVolume, toggleMute, changeLanguage };
}
