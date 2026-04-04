import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';
import { StatCard, StatsGrid } from '../../../components/shared/Surface';
import type { WeeklySummary } from '../../../types';

interface HomeStatsProps {
  weeklySummary: WeeklySummary;
}

export function HomeStats({ weeklySummary }: HomeStatsProps) {
  return (
    <StatsGrid>
      <StatCard
        css={{
          background: '#ffffff',
        }}
      >
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          이번 주 세션
        </Text>
        <strong css={{ color: '#6f48c9' }}>{weeklySummary.totalSessions}</strong>
      </StatCard>
      <StatCard
        css={{
          background: '#ffffff',
        }}
      >
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          총 배출량
        </Text>
        <strong css={{ color: '#c97d1d' }}>{weeklySummary.totalReleased}</strong>
      </StatCard>
      <StatCard
        css={{
          background: '#ffffff',
        }}
      >
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          가장 힘들었던 요일
        </Text>
        <strong css={{ color: '#d65280' }}>{weeklySummary.hardestWeekday}</strong>
      </StatCard>
      <StatCard
        css={{
          background: '#ffffff',
        }}
      >
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          연속 기록
        </Text>
        <strong css={{ color: '#b36b13' }}>{weeklySummary.streakDays}일</strong>
      </StatCard>
    </StatsGrid>
  );
}
