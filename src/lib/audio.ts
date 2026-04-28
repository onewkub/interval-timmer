import { Howl, Howler } from "howler";

import url1 from "@/assets/sound/1.mp3";
import url2 from "@/assets/sound/2.mp3";
import url3 from "@/assets/sound/3.mp3";
import urlFinish from "@/assets/sound/Finish.mp3";
import urlRest from "@/assets/sound/Rest.mp3";
import urlWork from "@/assets/sound/Work.mp3";

const sounds = {
  one: new Howl({ src: [url1], preload: true }),
  two: new Howl({ src: [url2], preload: true }),
  three: new Howl({ src: [url3], preload: true }),
  finish: new Howl({ src: [urlFinish], preload: true }),
  rest: new Howl({ src: [urlRest], preload: true }),
  work: new Howl({ src: [urlWork], preload: true }),
};

/** Play the countdown sound for the given remaining seconds (1, 2, or 3) */
export function playCountdown(remaining: 1 | 2 | 3) {
  if (remaining === 3) sounds.three.play();
  else if (remaining === 2) sounds.two.play();
  else sounds.one.play();
}

export function playWork() {
  sounds.work.play();
}
export function playRest() {
  sounds.rest.play();
}
export function playFinish() {
  sounds.finish.play();
}

/** Set global volume (0.0 – 1.0) */
export function setAudioVolume(vol: number) {
  Howler.volume(Math.max(0, Math.min(1, vol)));
}

/** Mute or unmute all sounds globally */
export function setAudioMuted(muted: boolean) {
  Howler.mute(muted);
}
