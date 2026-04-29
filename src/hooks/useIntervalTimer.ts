import { useCallback, useEffect, useRef, useState } from "react";
import { playCountdown, playFinish, playRest, playWork } from "@/lib/audio";

export type Phase = "idle" | "countdown" | "work" | "rest" | "done";

export interface TimerConfig {
  workSeconds: number;
  restSeconds: number;
  sets: number;
}

export interface TimerState {
  phase: Phase;
  timeRemaining: number;
  currentSet: number;
  totalSets: number;
  isPaused: boolean;
}

interface TimerActions {
  start: (config: TimerConfig) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useIntervalTimer(): TimerState & TimerActions {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs to avoid stale closure issues inside setInterval
  const configRef = useRef<TimerConfig | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const timeRef = useRef(0);
  const currentSetRef = useRef(0);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const transitionTo = useCallback(
    (newPhase: Phase, duration: number) => {
      clearTick();

      phaseRef.current = newPhase;
      timeRef.current = duration;
      setPhase(newPhase);
      setTimeRemaining(duration);

      if (newPhase === "countdown") playCountdown(3);
      else if (newPhase === "work") playWork();
      else if (newPhase === "rest") playRest();
      else if (newPhase === "done") playFinish();
    },
    [clearTick],
  );

  const tick = useCallback(() => {
    if (isPausedRef.current) return;

    timeRef.current -= 1;
    setTimeRemaining(timeRef.current);

    const cfg = configRef.current!;
    const t = timeRef.current;

    // Play 3-2-1 sounds during countdown phase (3 is played at entry)
    if (phaseRef.current === "countdown" && (t === 2 || t === 1)) {
      playCountdown(t as 1 | 2);
    }

    // Play 3-2-1 sounds during the last 3 seconds of work/rest phases
    if (
      (phaseRef.current === "work" || phaseRef.current === "rest") &&
      (t === 3 || t === 2 || t === 1)
    ) {
      playCountdown(t as 1 | 2 | 3);
    }

    if (timeRef.current <= 0) {
      clearTick();

      const phase = phaseRef.current;

      if (phase === "countdown") {
        // After countdown → start first work set
        currentSetRef.current = 1;
        setCurrentSet(1);
        transitionTo("work", cfg.workSeconds);
      } else if (phase === "work") {
        // After work → rest
        transitionTo("rest", cfg.restSeconds);
      } else if (phase === "rest") {
        // After rest → next work set or done
        const nextSet = currentSetRef.current + 1;
        if (nextSet > cfg.sets) {
          transitionTo("done", 0);
        } else {
          currentSetRef.current = nextSet;
          setCurrentSet(nextSet);
          transitionTo("work", cfg.workSeconds);
        }
      }
    }
  }, [clearTick, transitionTo]);

  // Start/restart the setInterval when phase changes (and not paused/idle/done)
  useEffect(() => {
    if (phase === "idle" || phase === "done" || isPaused) return;

    intervalRef.current = setInterval(tick, 1000);
    return clearTick;
  }, [phase, isPaused, tick, clearTick]);

  const start = useCallback(
    (config: TimerConfig) => {
      clearTick();
      configRef.current = config;
      currentSetRef.current = 0;
      isPausedRef.current = false;

      setCurrentSet(0);
      setTotalSets(config.sets);
      setIsPaused(false);

      // Begin with a 3-2-1 countdown before the first work phase
      transitionTo("countdown", 3);
    },
    [clearTick, transitionTo],
  );

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    clearTick();
    configRef.current = null;
    phaseRef.current = "idle";
    timeRef.current = 0;
    currentSetRef.current = 0;
    isPausedRef.current = false;

    setPhase("idle");
    setTimeRemaining(0);
    setCurrentSet(0);
    setTotalSets(0);
    setIsPaused(false);
  }, [clearTick]);

  return {
    phase,
    timeRemaining,
    currentSet,
    totalSets,
    isPaused,
    start,
    pause,
    resume,
    stop,
  };
}
