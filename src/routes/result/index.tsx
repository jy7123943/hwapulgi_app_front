import { colors } from '@toss/tds-colors';
import { Button, Text } from '@toss/tds-mobile';
import { Navigate, useNavigate } from 'react-router-dom';
import { MascotHero } from '../../components/shared/MascotHero';
import { AppShell, BodyStack, ButtonStack, FooterDock, FooterInner, ScreenPanel, SectionCard, StatCard, StatsGrid } from '../../components/shared/Surface';
import { formatSessionLabel } from '../../lib/storage';
import { useAppState } from '../../state/AppState';

export function ResultRoute() {
  const navigate = useNavigate();
  const { lastResult, resetDraft } = useAppState();

  if (!lastResult) {
    return <Navigate replace to="/" />;
  }

  return (
    <AppShell>
      <ScreenPanel>
        <BodyStack>
          <MascotHero
            subtitle={`${lastResult.angerBefore}에서 ${lastResult.angerAfter}까지 내려왔어요.`}
            title={'참느라\n고생했어요.'}
          />

          <StatsGrid>
            <StatCard>
              <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
                타격 수
              </Text>
              <strong css={{ fontSize: 30, color: colors.red500 }}>{lastResult.hits}</strong>
            </StatCard>
            <StatCard>
              <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
                특수 스킬
              </Text>
              <strong css={{ fontSize: 30, color: colors.purple600 }}>{lastResult.skillShots}</strong>
            </StatCard>
            <StatCard>
              <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
                배출률
              </Text>
              <strong css={{ fontSize: 30, color: colors.yellow700 }}>{lastResult.releasedPercent}%</strong>
            </StatCard>
            <StatCard>
              <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
                포인트
              </Text>
              <strong css={{ fontSize: 30, color: colors.blue500 }}>{lastResult.points}P</strong>
            </StatCard>
          </StatsGrid>

          <SectionCard>
            <Text as="div" typography="t6" fontWeight="bold" css={{ marginBottom: 12 }}>
              {formatSessionLabel(lastResult)}
            </Text>
            <Text as="div" typography="t6" css={{ margin: 0, color: colors.grey600 }}>
              {lastResult.memo || '이번 기록에는 별도 메모를 남기지 않았어요.'}
            </Text>
          </SectionCard>
        </BodyStack>
      </ScreenPanel>

      <FooterDock>
        <FooterInner>
          <ButtonStack>
            <Button
              color="primary"
              display="full"
              size="xlarge"
              onClick={() => {
                resetDraft();
                navigate('/home');
              }}
            >
              홈으로
            </Button>
            <Button
              color="light"
              display="full"
              onClick={() => {
                resetDraft();
                navigate('/start/target');
              }}
              variant="weak"
            >
              한 판 더
            </Button>
          </ButtonStack>
        </FooterInner>
      </FooterDock>
    </AppShell>
  );
}
