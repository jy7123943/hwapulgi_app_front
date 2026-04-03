import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';

interface GameMetricsProps {
  hits: number;
  releasePercent: number;
}

export function GameMetrics({ hits, releasePercent }: GameMetricsProps) {
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        borderRadius: 22,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        color: colors.background,
        boxShadow: '0 14px 30px rgba(5, 12, 24, 0.3)',
      }}
    >
      <div css={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Text as="span" typography="t6" fontWeight="medium" css={{ color: colors.grey300 }}>
          타격
        </Text>
        <strong css={{ fontSize: 28, color: colors.background }}>{hits}</strong>
      </div>
      <div
        css={{
          width: 1,
          height: 22,
          background: 'rgba(255,255,255,0.12)',
          flexShrink: 0,
        }}
      />
      <div css={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Text as="span" typography="t6" fontWeight="medium" css={{ color: colors.grey300 }}>
          배출률
        </Text>
        <strong css={{ fontSize: 28, color: colors.background }}>{releasePercent}%</strong>
      </div>
    </div>
  );
}
