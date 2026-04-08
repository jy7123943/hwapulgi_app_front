import { useEffect } from "react";
import { keyframes } from "@emotion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Text } from "@toss/tds-mobile";
import { useAppState } from "../../state/AppState";

const gloveBounce = keyframes({
  "0%, 100%": {
    transform: "translateX(-50%) rotate(-10deg) translateY(0)",
  },
  "50%": {
    transform: "translateX(-50%) rotate(-10deg) translateY(-18px)",
  },
});

export function IntroRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasHistory, introSeen, isHydrated, markIntroSeen } = useAppState();
  const isDevPreview = searchParams.get("dev") === "true";

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isDevPreview) {
      return;
    }

    if (hasHistory) {
      navigate("/home", { replace: true });
      return;
    }

    if (introSeen) {
      navigate("/start/target", { replace: true });
      return;
    }

    const timeout = window.setTimeout(() => {
      markIntroSeen();
      navigate("/start/target", { replace: true });
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [hasHistory, introSeen, isDevPreview, isHydrated, markIntroSeen, navigate]);

  if (!isHydrated) {
    return null;
  }

  return (
    <main
      css={{
        minHeight: "100vh",
        background: "#3b245f",
        position: "relative",
        overflow: "hidden",
        padding: 0,
        "--hero-center-x": "50%",
        "--hero-center-y": "54%",
      }}
    >
      {[
        { size: "clamp(180px, 34vw, 280px)", top: "-8%", left: "-14%", color: "rgba(165, 255, 215, 0.82)" },
        { size: "clamp(150px, 28vw, 220px)", top: "18%", right: "-12%", color: "rgba(170, 255, 220, 0.66)" },
        { size: "clamp(120px, 24vw, 180px)", bottom: "8%", left: "-6%", color: "rgba(201, 167, 255, 0.42)" },
        { size: "clamp(118px, 24vw, 180px)", bottom: "20%", right: "4%", color: "rgba(196, 255, 226, 0.36)" },
      ].map((glow, index) => (
        <span
          key={index}
          css={{
            position: "absolute",
            width: glow.size,
            height: glow.size,
            borderRadius: "999px",
            filter: "blur(18px)",
            background: glow.color,
            opacity: 0.82,
            ...("top" in glow ? { top: glow.top } : {}),
            ...("bottom" in glow ? { bottom: glow.bottom } : {}),
            ...("left" in glow ? { left: glow.left } : {}),
            ...("right" in glow ? { right: glow.right } : {}),
          }}
        />
      ))}

      <section
        css={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <div
          css={{
            position: "absolute",
            left: "50%",
            top: "clamp(42px, 8vh, 72px)",
            transform: "translateX(-50%)",
            width: "min(100vw - 48px, 420px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(10px, 1.8vh, 18px)",
            textAlign: "center",
          }}
        >
          <img
            alt="Punch Pang"
            src="/punch_pang.png"
            css={{
              width: "clamp(220px, 58vw, 332px)",
              maxWidth: "92%",
              objectFit: "contain",
            }}
          />

          <Text
            as="p"
            typography="t3"
            fontWeight="bold"
            css={{
              color: "#fff4df",
              textShadow:
                "-1.5px -1.5px 0 #4e356d, 1.5px -1.5px 0 #4e356d, -1.5px 1.5px 0 #4e356d, 1.5px 1.5px 0 #4e356d",
            }}
          >
            오늘 쌓인 <span css={{ color: "#ff9ca5" }}>화</span>, 날려버릴까요?
          </Text>
        </div>

        <div
          css={{
            position: "absolute",
            inset: 0,
          }}
        >
          <img
            alt=""
            src="/icon_mint_glove.png"
            css={{
              position: "fixed",
              left: "calc(var(--hero-center-x) - min(37vw, 147px))",
              top: "calc(var(--hero-center-y) - min(6vh, 58px))",
              width: "clamp(44px, 10vw, 62px)",
              transform: "rotate(-18deg)",
            }}
          />
          <img
            alt=""
            src="/icon_thumbs_up.png"
            css={{
              position: "fixed",
              left: "calc(var(--hero-center-x) + min(18vw, 102px))",
              top: "26vh",
              width: "clamp(52px, 11vw, 70px)",
              transform: "rotate(12deg)",
            }}
          />
          <img
            alt=""
            src="/icon_mint_smile.png"
            css={{
              position: "fixed",
              left: "calc(var(--hero-center-x) + min(24vw, 104px))",
              top: "calc(var(--hero-center-y) + min(5vh, 44px))",
              width: "clamp(58px, 12vw, 76px)",
            }}
          />
          <img
            alt=""
            src="/icon_purple_smile.png"
            css={{
              position: "fixed",
              left: "calc(var(--hero-center-x) + min(-27vw, 84px))",
              top: "calc(var(--hero-center-y) + min(11vh, 146px))",
              width: "clamp(42px, 9vw, 58px)",
            }}
          />

          <img
            alt="불꽃 캐릭터"
            src="/icon_character_fire.png"
            css={{
              position: "fixed",
              left: "var(--hero-center-x)",
              top: "var(--hero-center-y)",
              transform: "translate(-50%, -50%)",
              width: "clamp(224px, 50vw, 292px)",
              objectFit: "contain",
              filter: "drop-shadow(0 18px 34px rgba(31, 17, 54, 0.28))",
            }}
          />

          <span
            css={{
              position: "fixed",
              left: "var(--hero-center-x)",
              bottom: "12%",
              transform: "translateX(-50%)",
              width: "clamp(154px, 36vw, 194px)",
              height: "clamp(34px, 6vh, 44px)",
              borderRadius: "999px",
              background: "rgba(53, 33, 86, 0.55)",
              filter: "blur(8px)",
            }}
          />

          <img
            alt="글러브"
            src="/icon_glove.png"
            css={{
              position: "fixed",
              left: "50%",
              bottom: "1.8%",
              transform: "translateX(-50%) rotate(-10deg)",
              width: "clamp(96px, 24vw, 132px)",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 30px rgba(31, 17, 54, 0.26))",
              animation: `${gloveBounce} 1.65s ease-in-out infinite`,
            }}
          />
        </div>
      </section>
    </main>
  );
}
