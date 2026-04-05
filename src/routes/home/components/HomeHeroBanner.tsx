import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import type { HomeSnapshot } from "../../../types";
import { Button } from "../../../components/shared/Button";

interface HomeHeroBannerProps {
  onStart: () => void;
  snapshot: HomeSnapshot;
}

export function HomeHeroBanner({ onStart, snapshot }: HomeHeroBannerProps) {
  return (
    <section
      css={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 32,
        padding: "20px 20px 18px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,250,246,0.96) 100%)",
      }}
    >
      <div
        css={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(178, 140, 255, 0.16), transparent 32%), radial-gradient(circle at bottom left, rgba(255, 196, 96, 0.16), transparent 26%)",
        }}
      />

      <div
        css={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <img
          alt="행복한 마스코트"
          src="/happyface.png"
          css={{
            width: 72,
            height: 72,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        <div css={{ minWidth: 0 }}>
          <div>
            <Text
              as="h2"
              typography="t2"
              fontWeight="bold"
              css={{ color: colors.grey900, whiteSpace: "pre-wrap" }}
            >
              {"오늘도 참느라\n고생했어요."}
            </Text>
          </div>
          <div css={{ marginTop: 8 }}>
            <Text
              as="p"
              typography="t7"
              css={{ color: colors.grey700 }}
            >
              오늘 {snapshot.todayCount}번 꺼내봤고, 최근엔{" "}
              <b>{snapshot.latestTarget}</b> 때문에 기록했어요.
            </Text>
          </div>
          <div css={{ marginTop: 4 }}>
            <Text
              as="p"
              typography="t7"
              css={{ color: colors.grey700 }}
            >
              이번 주엔 <b>{snapshot.primaryTarget}</b> 때문에 가장 자주 화가 났어요.
            </Text>
          </div>
        </div>
      </div>

      <Button
        display="block"
        onClick={onStart}
        size="large"
        css={{
          marginTop: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        오늘 화 풀러 가기
      </Button>
    </section>
  );
}
