import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import type { WeeklySummary } from '../../../types';

interface TopTargetsCardProps {
  weeklySummary: WeeklySummary;
}

export function TopTargetsCard({ weeklySummary }: TopTargetsCardProps) {
  return (
    <SectionCard
      css={{
        background: 'linear-gradient(180deg, rgba(255,246,222,0.98) 0%, rgba(255,239,209,0.94) 100%)',
      }}
    >
      <Text as="h3" typography="t5" fontWeight="bold" css={{ color: colors.grey900 }}>
        이번 주 나를 가장 화나게 한 대상
      </Text>

      <div css={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {weeklySummary.topTargets.length > 0 ? (
          weeklySummary.topTargets.map((target, index) => (
            <div
              key={target.label}
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.7)',
              }}
            >
              <div css={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Text
                  as="span"
                  typography="t6"
                  fontWeight="bold"
                  css={{ color: colors.red500, flexShrink: 0 }}
                >
                  {index + 1}위
                </Text>
                <Text
                  as="span"
                  typography="t6"
                  fontWeight="bold"
                  css={{
                    color: colors.grey900,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {target.label}
                </Text>
              </div>

              <Text
                as="span"
                typography="t7"
                fontWeight="medium"
                css={{ color: colors.grey600, flexShrink: 0 }}
              >
                {target.count}회
              </Text>
            </div>
          ))
        ) : (
          <Text as="p" typography="t7" css={{ color: colors.grey600 }}>
            아직 이번 주 기록이 없어요.
          </Text>
        )}
      </div>
    </SectionCard>
  );
}
