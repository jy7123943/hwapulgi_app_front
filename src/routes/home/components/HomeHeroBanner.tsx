import { Button } from "../../../components/shared/Button";
import { ScreenHeading } from "../../../components/shared/ScreenHeading";

interface HomeHeroBannerProps {
  onStart: () => void;
}

export function HomeHeroBanner({ onStart }: HomeHeroBannerProps) {
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
    </section>
  );
}
