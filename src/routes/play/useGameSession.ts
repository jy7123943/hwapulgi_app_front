import { useEffect, useRef, useState } from "react";
import { GAME_START_LINE, HIT_SUPPORT_LINES } from "../../constants";
import { safeHaptic } from "../../lib/haptics";

interface UseGameSessionParams {
  angerBefore: number;
}

export function useGameSession({ angerBefore }: UseGameSessionParams) {
  const [currentAnger, setCurrentAnger] = useState(angerBefore);
  const [hits, setHits] = useState(0);
  const [muted, setMuted] = useState(false);
  const [hapticsMuted, setHapticsMuted] = useState(false);
  const [taunt, setTaunt] = useState(GAME_START_LINE);
  const [sessionKey] = useState(() => crypto.randomUUID());
  const pendingTauntTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pendingTauntTimeoutRef.current !== null) {
        window.clearTimeout(pendingTauntTimeoutRef.current);
        pendingTauntTimeoutRef.current = null;
      }
    };
  }, []);

  const angerGaugePercent = Math.max(
    0,
    Math.round((currentAnger / Math.max(angerBefore, 1)) * 100)
  );

  function handleGameHit(
    remaining: number,
    nextHits: number,
    impactStrength: number,
  ) {
    setCurrentAnger(remaining);
    setHits(nextHits);

    if (pendingTauntTimeoutRef.current !== null) {
      window.clearTimeout(pendingTauntTimeoutRef.current);
    }

    pendingTauntTimeoutRef.current = window.setTimeout(() => {
      setTaunt((prev: string) => {
        const remainingRatio = remaining / Math.max(angerBefore, 1);
        const pool =
          remainingRatio <= 0.05
            ? HIT_SUPPORT_LINES.finish
            : remainingRatio <= 0.35
              ? HIT_SUPPORT_LINES.late
              : remainingRatio <= 0.7
                ? HIT_SUPPORT_LINES.mid
                : HIT_SUPPORT_LINES.early;

        if (pool.length <= 1) {
          return pool[0] ?? prev;
        }

        const candidates = pool.filter((line) => line !== prev);
        return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
      });
      pendingTauntTimeoutRef.current = null;
    }, 240);

    if (impactStrength >= 1.15) {
      if (!hapticsMuted) {
        void safeHaptic('basicMedium');
      }
      return;
    }

    if (impactStrength >= 0.82) {
      if (!hapticsMuted) {
        void safeHaptic('tickMedium');
      }
      return;
    }

    if (!hapticsMuted) {
      void safeHaptic('tickWeak');
    }
  }

  return {
    currentAnger,
    angerGaugePercent,
    hapticsMuted,
    hits,
    muted,
    sessionKey,
    taunt,
    setHapticsMuted,
    setMuted,
    handleGameHit,
  };
}
