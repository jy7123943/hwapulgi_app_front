import { Text } from "@toss/tds-mobile";
import type { HomeSnapshot } from "../../../types";
import { Button } from "../../../components/shared/Button";
import { ScreenHeading } from "../../../components/shared/ScreenHeading";

interface HomeHeroBannerProps {
  onStart: () => void;
  snapshot: HomeSnapshot;
}

export function HomeHeroBanner({ onStart, snapshot }: HomeHeroBannerProps) {
  return (
    <section css={{ padding: "6px 2px 4px" }}>
      <ScreenHeading
        eyebrow="PUNCH PANG!"
        subtitle={"오늘은 어떻게 풀어낼까요?"}
        title={"오늘도 참느라\n고생했어요."}
      />

      <Button
        display="block"
        onClick={onStart}
        size="large"
        css={{
          marginTop: 14,
          maxWidth: 260,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        오늘 화 풀러 가기
      </Button>

      <div css={{ marginTop: 14, paddingLeft: 4 }}>
        <Text as="p" typography="t7" css={{ color: "#f6ebff" }}>
          오늘 {snapshot.todayCount}번 꺼내봤고, 최근엔 <b>{snapshot.latestTarget}</b>{" "}
          때문에 기록했어요.
        </Text>
        <Text as="p" typography="t7" css={{ color: "#f6ebff", marginTop: 4 }}>
          이번 주엔 <b>{snapshot.primaryTarget}</b> 때문에 가장 자주 화가 났어요.
        </Text>
      </div>
    </section>
  );
}
