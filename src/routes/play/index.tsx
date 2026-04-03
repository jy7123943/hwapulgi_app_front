import { Suspense, lazy } from 'react';
import { colors } from '@toss/tds-colors';
import { Top } from '@toss/tds-mobile';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppShell, BodyStack, FooterDock, FooterInner, ScreenPanel, TopCard } from '../../components/shared/Surface';
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
    currentAnger,
    handleGameHit,
    hits,
    releasePercent,
    sessionKey,
    skillShots,
    taunt,
    setGameController,
    triggerPrimaryHit,
    triggerSkillShot,
  } = useGameSession({ angerBefore: draft.angerBefore });

  if (!draft.nickname.trim()) {
    return <Navigate replace to="/start/name" />;
  }

  function finishGame() {
    completeSession({
      hits,
      skillShots,
      angerAfter: Math.min(currentAnger, draft.angerBefore),
    });
    void safeHaptic('success');
    navigate('/result');
  }

  return (
    <AppShell>
      <ScreenPanel>
        <TopCard>
          <Top
            subtitleBottom={
              <Top.SubtitleParagraph
                css={{
                  color: colors.grey600,
                  fontSize: 14,
                }}
              >
                {taunt}
              </Top.SubtitleParagraph>
            }
            title={
              <Top.TitleParagraph
                css={{
                  color: colors.grey900,
                  fontSize: 34,
                  fontWeight: 800,
                }}
              >
                {draft.nickname}
              </Top.TitleParagraph>
            }
          />
        </TopCard>

        <BodyStack>
          <GameMetrics currentAnger={currentAnger} hits={hits} releasePercent={releasePercent} />

          <Suspense
            fallback={
              <div
                css={{
                  display: 'grid',
                  placeItems: 'center',
                  height: 360,
                  margin: '16px 0',
                  borderRadius: 24,
                  color: colors.red700,
                  background: 'linear-gradient(180deg, #ffe5db 0%, #f6d1c7 100%)',
                }}
              >
                게임 준비 중...
              </div>
            }
          >
            <GameArena
              initialAnger={draft.angerBefore}
              onHit={handleGameHit}
              onReady={(controller) => setGameController(controller)}
              sessionKey={sessionKey}
            />
          </Suspense>
        </BodyStack>
      </ScreenPanel>

      <FooterDock>
        <FooterInner>
          <GameActions
            onFinish={finishGame}
            onPrimaryHit={triggerPrimaryHit}
            onSkillShot={triggerSkillShot}
          />
        </FooterInner>
      </FooterDock>
    </AppShell>
  );
}
