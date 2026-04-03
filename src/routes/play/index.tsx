import { Suspense, lazy } from 'react';
import { colors } from '@toss/tds-colors';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppState } from '../../state/AppState';
import { safeHaptic } from '../../lib/haptics';
import { GameActions } from './components/GameActions';
import { GameMetrics } from './components/GameMetrics';
import { useGameSession } from './useGameSession';

const GameArena = lazy(() =>
  import('../../components/GameArena').then((module) => ({ default: module.GameArena })),
);

export function GameRoute() {
  const navigate = useNavigate();
  const { draft, completeSession } = useAppState();
  const {
    angerGaugePercent,
    currentAnger,
    handleGameHit,
    hits,
    muted,
    sessionKey,
    taunt,
    setGameController,
    setMuted,
  } = useGameSession({ angerBefore: draft.angerBefore });

  if (!draft.nickname.trim()) {
    return <Navigate replace to="/start/name" />;
  }

  function finishGame() {
    completeSession({
      hits,
      skillShots: 0,
      angerAfter: Math.min(currentAnger, draft.angerBefore),
    });
    void safeHaptic('success');
    navigate('/result');
  }

  return (
    <div
      css={{
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(circle at top, rgba(177, 122, 255, 0.22), transparent 30%), linear-gradient(180deg, #2a2148 0%, #392b61 62%, #2d224f 100%)',
        padding: '14px 14px 18px',
        gap: 10,
        overflow: 'hidden',
      }}
    >
      <GameMetrics angerGaugePercent={angerGaugePercent} hits={hits} />

      <div
        css={{
          borderRadius: 22,
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.94)',
          boxShadow: '0 10px 26px rgba(4, 10, 22, 0.22)',
        }}
      >
        <div
          css={{
            color: colors.grey600,
            fontSize: 15,
          }}
        >
          {taunt}
        </div>
      </div>

      <div
        css={{
          position: 'relative',
          flex: 1,
          minHeight: 420,
          width: '100%',
        }}
      >
        <Suspense
          fallback={
            <div
              css={{
                display: 'grid',
                placeItems: 'center',
                position: 'absolute',
                inset: 0,
                borderRadius: 28,
                color: colors.background,
                background: '#392b61',
              }}
            >
              게임 준비 중...
            </div>
          }
        >
          <GameArena
            initialAnger={draft.angerBefore}
            nickname={draft.nickname}
            onHit={handleGameHit}
            onReady={(controller) => setGameController(controller)}
            sessionKey={sessionKey}
          />
        </Suspense>

        <GameActions
          muted={muted}
          onFinish={finishGame}
          onToggleMute={() => setMuted((prev) => !prev)}
        />
      </div>
    </div>
  );
}
