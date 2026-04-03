import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import { formatSessionLabel } from '../../../lib/storage';
import type { SessionResult } from '../../../types';

interface RecentHeroProps {
  hero?: SessionResult;
}

export function RecentHero({ hero }: RecentHeroProps) {
  return (
    <SectionCard>
      <Text as="div" typography="t6" fontWeight="bold" css={{ marginBottom: 12 }}>
        가장 최근 기록
      </Text>
      {hero ? (
        <div
          css={{
            borderRadius: 20,
            padding: 18,
            background: 'linear-gradient(135deg, #fff1eb, #ffe1d3)',
          }}
        >
          <strong css={{ display: 'block', marginBottom: 4, color: colors.red700, fontSize: 24 }}>
            {hero.releasedPercent}% 배출
          </strong>
          <p css={{ margin: 0, color: colors.grey600 }}>
            {formatSessionLabel(hero)} · 시작 {hero.angerBefore} → 종료 {hero.angerAfter}
          </p>
        </div>
      ) : (
        <Text as="div" typography="t6" css={{ margin: 0, color: colors.grey600 }}>
          아직 저장된 기록이 없어요.
        </Text>
      )}
    </SectionCard>
  );
}
