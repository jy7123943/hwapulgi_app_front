import { useEffect, useRef } from 'react';
import { createAngerGame, type AngerGameController } from '../game/createAngerGame';

interface GameArenaProps {
  initialAnger: number;
  sessionKey: string;
  onHit: (remaining: number, hits: number) => void;
  onReady?: (controller: AngerGameController) => void;
}

export function GameArena({ initialAnger, sessionKey, onHit, onReady }: GameArenaProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    const controller = createAngerGame(hostRef.current, initialAnger, { onHit });
    onReady?.(controller);

    const resizeObserver = new ResizeObserver(() => {
      controller.resize();
    });

    resizeObserver.observe(hostRef.current);

    return () => {
      resizeObserver.disconnect();
      controller.destroy();
    };
  }, [initialAnger, onHit, onReady, sessionKey]);

  return (
    <div
      css={{
        height: 360,
        margin: '16px 0',
        borderRadius: 24,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #ffe5db 0%, #f6d1c7 100%)',
      }}
      ref={hostRef}
    />
  );
}
