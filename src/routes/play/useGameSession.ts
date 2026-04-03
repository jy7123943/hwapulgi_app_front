import { useEffect, useRef, useState } from "react";
import { TAUNT_LINES } from "../../constants";
import { safeHaptic } from "../../lib/haptics";

interface UseGameSessionParams {
  angerBefore: number;
}

export function useGameSession({ angerBefore }: UseGameSessionParams) {
  const [currentAnger, setCurrentAnger] = useState(angerBefore);
  const [hits, setHits] = useState(0);
  const [muted, setMuted] = useState(false);
  const [taunt, setTaunt] = useState(TAUNT_LINES[0]);
  const [sessionKey] = useState(() => crypto.randomUUID());
  const tauntIntervalRef = useRef<number | null>(null);
  const [gameController, setGameController] = useState<{
    hit: () => void;
  } | null>(null);

  useEffect(() => {
    tauntIntervalRef.current = window.setInterval(() => {
      setTaunt((prev) => {
        const index = TAUNT_LINES.indexOf(prev);
        return TAUNT_LINES[(index + 1) % TAUNT_LINES.length];
      });
    }, 5200);

    return () => {
      if (tauntIntervalRef.current !== null) {
        window.clearInterval(tauntIntervalRef.current);
        tauntIntervalRef.current = null;
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

    if (impactStrength >= 1.15) {
      if (!muted) {
        void safeHaptic('basicMedium');
      }
      return;
    }

    if (impactStrength >= 0.82) {
      if (!muted) {
        void safeHaptic('tickMedium');
      }
      return;
    }

    if (!muted) {
      void safeHaptic('tickWeak');
    }
  }

  return {
    currentAnger,
    angerGaugePercent,
    gameController,
    hits,
    muted,
    sessionKey,
    taunt,
    setGameController,
    setMuted,
    handleGameHit,
    stopTauntRotation: () => {
      if (tauntIntervalRef.current !== null) {
        window.clearInterval(tauntIntervalRef.current);
        tauntIntervalRef.current = null;
      }
    },
  };
}
