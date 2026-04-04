import { Asset } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";

interface GameActionsProps {
  hapticsMuted: boolean;
  onFinish: () => void;
  onToggleHaptics: () => void;
  onToggleMute: () => void;
  muted: boolean;
}

export function GameActions({
  hapticsMuted,
  onFinish,
  onToggleHaptics,
  onToggleMute,
  muted,
}: GameActionsProps) {
  return (
    <>
      <div
        css={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 3,
        }}
      >
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? "음소거 해제" : "음소거"}
          css={{
            borderRadius: 999,
            width: 44,
            height: 44,
            background: muted
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.12)",
            color: colors.background,
            border: "none",
            boxShadow: "none",
            display: "grid",
            placeItems: "center",
            backdropFilter: "blur(10px)",
            ":active": {
              transform: "translateY(1px)",
              background: "rgba(255,255,255,0.18)",
            },
          }}
        >
          <Asset.Icon
            aria-hidden={true}
            color={colors.background}
            frameShape={Asset.frameShape.CleanWFull}
            name={muted ? "icon-sound-off-mono" : "icon-sound-on-mono"}
          />
        </button>

        <button
          type="button"
          onClick={onToggleHaptics}
          aria-label={hapticsMuted ? "진동 켜기" : "진동 끄기"}
          css={{
            borderRadius: 999,
            minWidth: 52,
            height: 44,
            padding: "0 14px",
            background: hapticsMuted
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.12)",
            color: colors.background,
            border: "none",
            boxShadow: "none",
            display: "grid",
            placeItems: "center",
            backdropFilter: "blur(10px)",
            ":active": {
              transform: "translateY(1px)",
              background: "rgba(255,255,255,0.18)",
            },
          }}
        >
          <span css={{ fontSize: 13, fontWeight: 700 }}>
            {hapticsMuted ? "진동 OFF" : "진동 ON"}
          </span>
        </button>
      </div>

      <div
        css={{
          position: "absolute",
          right: 16,
          bottom: 18,
          zIndex: 3,
        }}
      >
        <button
          type="button"
          onClick={onFinish}
          css={{
            borderRadius: 999,
            padding: "12px 14px",
            minHeight: 44,
            background: "rgba(255,255,255,0.12)",
            color: colors.background,
            border: "none",
            boxShadow: "none",
            fontSize: 13,
            fontWeight: 700,
            backdropFilter: "blur(10px)",
            ":active": {
              transform: "translateY(1px)",
              background: "rgba(255,255,255,0.18)",
            },
          }}
        >
          그만하기
        </button>
      </div>
    </>
  );
}
