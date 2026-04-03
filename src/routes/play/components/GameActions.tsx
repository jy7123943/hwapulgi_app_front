import { colors } from '@toss/tds-colors';

interface GameActionsProps {
  onHit: () => void;
  onFinish: () => void;
}

export function GameActions({ onHit, onFinish }: GameActionsProps) {
  return (
    <div
      css={{
        position: 'absolute',
        left: '50%',
        bottom: 18,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 3,
      }}
    >
      <button
        type="button"
        onClick={onHit}
        css={{
          width: 108,
          height: 108,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 28%, #ff8d87 0%, #ff564c 42%, #d72525 100%)',
          boxShadow:
            '0 20px 40px rgba(114, 10, 19, 0.42), inset 0 6px 14px rgba(255,255,255,0.18), inset 0 -10px 22px rgba(96, 8, 8, 0.3)',
          color: colors.background,
          display: 'grid',
          placeItems: 'center',
          border: '4px solid rgba(255,255,255,0.12)',
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          ':active': {
            transform: 'translateY(2px) scale(0.98)',
            boxShadow:
              '0 12px 22px rgba(114, 10, 19, 0.34), inset 0 4px 12px rgba(255,255,255,0.14), inset 0 -8px 18px rgba(96, 8, 8, 0.24)',
          },
        }}
      >
        타격
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
        여기까지
      </button>
    </div>
  );
}
