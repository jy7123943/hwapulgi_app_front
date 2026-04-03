import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';

interface GameMetricsProps {
  currentAnger: number;
  hits: number;
  releasePercent: number;
}

export function GameMetrics({ currentAnger, hits, releasePercent }: GameMetricsProps) {
  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        '@media (max-width: 560px)': {
          gridTemplateColumns: '1fr',
        },
      }}
    >
      <div
        css={{
          borderRadius: 22,
          padding: 18,
          background: 'linear-gradient(135deg, #8f1fff, #d74cff 78%)',
          color: colors.background,
          boxShadow: '0 18px 28px rgba(143, 31, 255, 0.2)',
        }}
      >
        <Text as="span" css={{ color: colors.background, opacity: 0.8 }}>
          타격 {hits}
        </Text>
        <strong css={{ fontSize: 32 }}>{currentAnger}</strong>
      </div>
      <div
        css={{
          borderRadius: 22,
          padding: 18,
          background: 'linear-gradient(135deg, #ffb400, #ff6a4e 78%)',
          color: colors.background,
          boxShadow: '0 18px 28px rgba(255, 106, 78, 0.18)',
        }}
      >
        <Text as="span" css={{ color: colors.background, opacity: 0.8 }}>
          배출률
        </Text>
        <strong css={{ fontSize: 32 }}>{releasePercent}%</strong>
      </div>
    </div>
  );
}
