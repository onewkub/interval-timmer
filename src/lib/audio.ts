import { Howl, Howler } from "howler";

import url1 from "@/assets/sound/1.mp3";
import url2 from "@/assets/sound/2.mp3";
import url3 from "@/assets/sound/3.mp3";
import urlFinish from "@/assets/sound/Finish.mp3";
import urlRest from "@/assets/sound/Rest.mp3";
import urlWork from "@/assets/sound/Work.mp3";

export type SoundLanguage = "th" | "en";

let currentLanguage: SoundLanguage = "en";
let currentVolume = 0.8;
let currentMuted = false;

const thSounds = {
  one: new Howl({ src: [url1], preload: true }),
  two: new Howl({ src: [url2], preload: true }),
  three: new Howl({ src: [url3], preload: true }),
  finish: new Howl({ src: [urlFinish], preload: true }),
  rest: new Howl({ src: [urlRest], preload: true }),
  work: new Howl({ src: [urlWork], preload: true }),
};

const EN_WORDS: Record<keyof typeof thSounds, string> = {
  one: "One",
  two: "Two",
  three: "Three",
  finish: "Finish",
  rest: "Rest",
  work: "Work",
};

function getFemaleEnVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  // Prefer a female en-US voice; fall back to any en voice
  return (
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        /female|woman|zira|samantha|victoria|susan|karen|moira|fiona|tessa/i.test(
          v.name,
        ),
    ) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

function speakEn(word: string) {
  if (currentMuted) return;
  const utt = new SpeechSynthesisUtterance(word);
  utt.volume = currentVolume;
  utt.lang = "en-US";
  const voice = getFemaleEnVoice();
  if (voice) utt.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

function playSound(key: keyof typeof thSounds) {
  if (currentLanguage === "en") {
    speakEn(EN_WORDS[key]);
  } else {
    thSounds[key].play();
  }
}

/** Play the countdown sound for the given remaining seconds (1, 2, or 3) */
export function playCountdown(remaining: 1 | 2 | 3) {
  if (remaining === 3) playSound("three");
  else if (remaining === 2) playSound("two");
  else playSound("one");
}

export function playWork() {
  playSound("work");
}
export function playRest() {
  playSound("rest");
}
export function playFinish() {
  playSound("finish");
}

/** Set global volume (0.0 – 1.0) */
export function setAudioVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol));
  Howler.volume(currentVolume);
}

/** Mute or unmute all sounds globally */
export function setAudioMuted(muted: boolean) {
  currentMuted = muted;
  Howler.mute(muted);
}

/** Switch audio language between Thai (MP3s) and English (Web Speech API) */
export function setAudioLanguage(lang: SoundLanguage) {
  currentLanguage = lang;
}
