import { useEffect, useRef } from 'react';
import { createAngerGame, type AngerGameController } from '../game/createAngerGame';

interface GameArenaProps {
  initialAnger: number;
  sessionKey: string;
  onHit: (remaining: number, hits: number) => void;
  onReady?: (controller: AngerGameController) => void;
}

export function GameArena({
  initialAnger,
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

    const controller = createAngerGame(hostRef.current, initialAnger, {
      onHit: (remaining, hits) => {
        onHitRef.current(remaining, hits);
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
  }, [initialAnger, sessionKey]);

  return (
    <div
      css={{
        position: 'absolute',
        inset: 0,
        borderRadius: 28,
        overflow: 'hidden',
        background: '#081427',
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
