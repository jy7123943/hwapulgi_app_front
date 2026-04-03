import { Asset } from '@toss/tds-mobile';
import { colors } from '@toss/tds-colors';

interface GameActionsProps {
  onFinish: () => void;
  onToggleMute: () => void;
  muted: boolean;
}

export function GameActions({
  onFinish,
  onToggleMute,
  muted,
}: GameActionsProps) {
  return (
    <div
      css={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        zIndex: 3,
      }}
    >
      <div css={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? '음소거 해제' : '음소거'}
          css={{
            borderRadius: 999,
            width: 44,
            height: 44,
            background: muted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
            color: colors.background,
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 10px 20px rgba(8, 17, 32, 0.28)',
            display: 'grid',
            placeItems: 'center',
            backdropFilter: 'blur(10px)',
            ':active': {
              transform: 'translateY(1px)',
              background: 'rgba(255,255,255,0.18)',
            },
          }}
        >
          <Asset.Icon
            aria-hidden={true}
            color={colors.background}
            frameShape={Asset.frameShape.CleanWFull}
            name={muted ? 'icon-sound-off-mono' : 'icon-sound-on-mono'}
          />
        </button>

        <button
          type="button"
          onClick={onFinish}
          css={{
            borderRadius: 999,
            padding: '12px 14px',
            minHeight: 44,
            background: 'rgba(255,255,255,0.12)',
            color: colors.background,
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 10px 20px rgba(8, 17, 32, 0.28)',
            fontSize: 13,
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            ':active': {
              transform: 'translateY(1px)',
              background: 'rgba(255,255,255,0.18)',
            },
          }}
        >
          그만하기
        </button>
      </div>
    </div>
  );
}
