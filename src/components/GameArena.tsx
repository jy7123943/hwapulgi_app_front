import { useEffect, useRef } from 'react';
import { createAngerGame, type AngerGameController } from '../game/createAngerGame';

interface GameArenaProps {
  initialAnger: number;
  nickname: string;
  sessionKey: string;
  onHit: (remaining: number, hits: number, impactStrength: number) => void;
  onReady?: (controller: AngerGameController) => void;
}

export function GameArena({
  initialAnger,
  nickname,
  sessionKey,
  onHit,
  onReady,
}: GameArenaProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const onHitRef = useRef(onHit);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onHitRef.current = onHit;
  }, [onHit]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    const controller = createAngerGame(hostRef.current, initialAnger, nickname, {
      onHit: (remaining, hits, impactStrength) => {
        onHitRef.current(remaining, hits, impactStrength);
      },
    });
    onReadyRef.current?.(controller);

    const resizeObserver = new ResizeObserver(() => {
      controller.resize();
    });

    resizeObserver.observe(hostRef.current);

    return () => {
      resizeObserver.disconnect();
      controller.destroy();
    };
  }, [initialAnger, nickname, sessionKey]);

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
