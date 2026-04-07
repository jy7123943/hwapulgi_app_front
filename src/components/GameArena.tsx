import { useEffect, useRef } from 'react';
import { createAngerGame } from '../game/createAngerGame';

interface GameArenaProps {
  gender: "girl" | "boy";
  initialAnger: number;
  muted: boolean;
  nickname: string;
  sessionKey: string;
  onHit: (remaining: number, hits: number, impactStrength: number) => void;
}

export function GameArena({
  gender,
  initialAnger,
  muted,
  nickname,
  sessionKey,
  onHit,
}: GameArenaProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const onHitRef = useRef(onHit);
  const mutedRef = useRef(muted);

  useEffect(() => {
    onHitRef.current = onHit;
  }, [onHit]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    const controller = createAngerGame(hostRef.current, initialAnger, nickname, gender, {
      onHit: (remaining, hits, impactStrength) => {
        onHitRef.current(remaining, hits, impactStrength);
      },
      isMuted: () => mutedRef.current,
    });

    const resizeObserver = new ResizeObserver(() => {
      controller.resize();
    });

    resizeObserver.observe(hostRef.current);

    return () => {
      resizeObserver.disconnect();
      controller.destroy();
    };
  }, [gender, initialAnger, nickname, sessionKey]);

  return (
    <div
      css={{
        position: 'absolute',
        inset: 0,
        borderRadius: 28,
        overflow: 'hidden',
        background: '#392b61',
        '& canvas': {
          display: 'block',
        },
      }}
    >
      <div
        ref={hostRef}
        css={{
          position: 'absolute',
          inset: 0,
        }}
      />
    </div>
  );
}
