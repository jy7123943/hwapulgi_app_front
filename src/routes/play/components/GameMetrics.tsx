import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';

interface GameMetricsProps {
  angerGaugePercent: number;
  hits: number;
}

function getGaugeColor(angerGaugePercent: number) {
  if (angerGaugePercent <= 20) {
    return colors.blue400;
  }

  if (angerGaugePercent <= 50) {
    return colors.yellow400;
  }

  if (angerGaugePercent <= 80) {
    return '#ff9a6d';
  }

  return '#ff5a54';
}

export function GameMetrics({ angerGaugePercent, hits }: GameMetricsProps) {
  const gaugeColor = getGaugeColor(angerGaugePercent);

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 14,
        borderRadius: 22,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.08)',
        border: 'none',
        backdropFilter: 'blur(10px)',
        color: colors.background,
        boxShadow: 'none',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 88,
          flexShrink: 0,
        }}
      >
        <Text as="span" typography="t6" fontWeight="medium" css={{ color: colors.grey300 }}>
          타격
        </Text>
        <strong
          css={{
            display: 'inline-block',
            minWidth: 48,
            fontSize: 28,
            color: colors.background,
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {hits}
        </strong>
      </div>
      <div
        css={{
          width: 1,
          height: 22,
          background: 'rgba(255,255,255,0.12)',
          flexShrink: 0,
        }}
      />
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text as="span" typography="t6" fontWeight="medium" css={{ color: colors.grey300 }}>
            분노 게이지
          </Text>
          <strong
            css={{
              minWidth: 56,
              fontSize: 24,
              color: colors.background,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {angerGaugePercent}%
          </strong>
        </div>
        <div
          css={{
            height: 10,
            overflow: 'hidden',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          <div
            css={{
              width: `${angerGaugePercent}%`,
              height: '100%',
              borderRadius: 999,
              background: gaugeColor,
              transition: 'width 160ms ease-out, background-color 180ms ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}
