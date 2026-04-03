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
      <StatCard>
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          이번 주 세션
        </Text>
        <strong>{weeklySummary.totalSessions}</strong>
      </StatCard>
      <StatCard>
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          총 타격 수
        </Text>
        <strong>{weeklySummary.totalHits}</strong>
      </StatCard>
      <StatCard>
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          시작 평균
        </Text>
        <strong>{weeklySummary.averageBefore}</strong>
      </StatCard>
      <StatCard>
        <Text as="span" typography="t7" css={{ display: 'block', color: colors.grey600 }}>
          종료 평균
        </Text>
        <strong>{weeklySummary.averageAfter}</strong>
      </StatCard>
    </StatsGrid>
  );
}
