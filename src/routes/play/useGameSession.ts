import { useEffect, useState } from 'react';
import { TAUNT_LINES } from '../../constants';
import { safeHaptic } from '../../lib/haptics';

interface UseGameSessionParams {
  angerBefore: number;
}

export function useGameSession({ angerBefore }: UseGameSessionParams) {
  const [currentAnger, setCurrentAnger] = useState(angerBefore);
  const [hits, setHits] = useState(0);
  const [skillShots, setSkillShots] = useState(0);
  const [taunt, setTaunt] = useState(TAUNT_LINES[0]);
  const [sessionKey] = useState(() => crypto.randomUUID());
  const [gameController, setGameController] = useState<{ hit: () => void } | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTaunt((prev) => {
        const index = TAUNT_LINES.indexOf(prev);
        return TAUNT_LINES[(index + 1) % TAUNT_LINES.length];
      });
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  const releasePercent = Math.max(
    0,
    Math.round(((angerBefore - currentAnger) / Math.max(angerBefore, 1)) * 100),
  );

  function handleGameHit(remaining: number, nextHits: number) {
    setCurrentAnger(remaining);
    setHits(nextHits);

    if (nextHits % 5 === 0) {
      setSkillShots((prev) => prev + 1);
      void safeHaptic('wiggle');
    } else {
      void safeHaptic(nextHits % 2 === 0 ? 'tickMedium' : 'tickWeak');
    }
  }

  function triggerPrimaryHit() {
    gameController?.hit();
  }

  function triggerSkillShot() {
    setSkillShots((prev) => prev + 1);
    setCurrentAnger((prev) => Math.max(0, prev - 8));
    void safeHaptic('basicMedium');
  }

  return {
    currentAnger,
    gameController,
    hits,
    releasePercent,
    sessionKey,
    skillShots,
    taunt,
    setGameController,
    handleGameHit,
    triggerPrimaryHit,
    triggerSkillShot,
  };
}
