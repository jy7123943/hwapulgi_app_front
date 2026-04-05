import { colors } from '@toss/tds-colors';
import { Button, Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import type { HomeSnapshot } from '../../../types';

interface HomeStatusCardProps {
  snapshot: HomeSnapshot;
  onStart: () => void;
}

export function HomeStatusCard({ snapshot, onStart }: HomeStatusCardProps) {
  return (
    <SectionCard css={{ background: '#ffffff' }}>
      <Text as="h3" typography="t6" fontWeight="bold" css={{ color: colors.grey900 }}>
        오늘도 참느라 고생했어요.
      </Text>
      <Text as="p" typography="t7" css={{ color: colors.grey700, marginTop: 8 }}>
        이번 주에는 {snapshot.primaryTarget} 때문에 가장 힘들었어요.
      </Text>
      <Text as="p" typography="t7" css={{ color: colors.grey700, marginTop: 4 }}>
        그래도 {snapshot.weeklySessions}번 기록했고 평균 {snapshot.weeklyAverageRelease}%나 잘 풀어냈어요.
      </Text>
      <Text as="p" typography="t7" css={{ color: colors.grey700, marginTop: 4 }}>
        오늘 분노 기록은 {snapshot.todayCount}회예요.
      </Text>

      <Button
        color="primary"
        display="block"
        onClick={onStart}
        size="large"
        css={{ marginTop: 16 }}
      >
        오늘 화 풀러 가기
      </Button>
    </SectionCard>
  );
}
