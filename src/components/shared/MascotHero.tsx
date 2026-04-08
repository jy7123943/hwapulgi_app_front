import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import styled from "@emotion/styled";

const HeroCard = styled.section<{
  backgroundGradient: string;
  compact?: boolean;
}>(({ backgroundGradient, compact }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 34,
  padding: compact ? "14px 16px 14px" : "16px 18px 18px",
  background: backgroundGradient,
  minHeight: compact ? 178 : 260,
  boxShadow: "0 12px 0 rgba(28, 14, 47, 0.22)",
  border: "3px solid #4f356f",
}));

const Sky = styled.div<{
  backgroundGradient: string;
}>(({ backgroundGradient }) => ({
  position: "absolute",
  inset: 0,
  background: backgroundGradient,
}));

const Blob = styled.div<{
  blobImage: string;
  compact?: boolean;
}>(({ blobImage, compact }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: compact ? 116 : 140,
  backgroundImage: blobImage,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "100% 100%",
  opacity: 0.98,
}));

const HeroImage = styled.img<{ compact?: boolean }>(({ compact }) => ({
  position: "relative",
  zIndex: 1,
  width: compact ? 78 : 124,
  height: compact ? 78 : 124,
  objectFit: "contain",
  display: "block",
  margin: compact ? "0 auto 4px" : "8px auto 12px",
  filter: "drop-shadow(0 16px 24px rgba(79, 19, 4, 0.18))",
}));

interface MascotHeroProps {
  eyebrow?: string;
  compact?: boolean;
  tone?: "default" | "lavender";
  type?: "angry" | "happy";
  title: string;
  subtitle: string;
}

const HERO_THEME = {
  angry: {
    blobImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 220' preserveAspectRatio='none'%3E%3Cpath fill='%23ff313d' d='M0 92 C48 68 104 74 146 98 C190 50 270 42 328 94 C390 20 520 8 608 92 C676 30 804 26 874 94 C918 70 964 72 1000 92 L1000 220 L0 220 Z'/%3E%3C/svg%3E\")",
    cardBackground: "linear-gradient(180deg, #3f2566 0%, #39225c 100%)",
    imageSrc: "/angryface.png",
    shadowColor: "0 20px 42px rgba(255, 106, 78, 0.22)",
    skyBackground:
      "radial-gradient(circle at 14% 18%, rgba(179, 255, 223, 0.3), transparent 16%), radial-gradient(circle at 86% 22%, rgba(191, 162, 255, 0.24), transparent 12%), linear-gradient(180deg, rgba(98, 54, 157, 0.48) 0%, rgba(61, 36, 98, 0.18) 54%, transparent 100%)",
  },
  happy: {
    blobImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 220' preserveAspectRatio='none'%3E%3Cpath fill='%23f5a65b' d='M0 92 C48 68 104 74 146 98 C190 50 270 42 328 94 C390 20 520 8 608 92 C676 30 804 26 874 94 C918 70 964 72 1000 92 L1000 220 L0 220 Z'/%3E%3C/svg%3E\")",
    cardBackground: "linear-gradient(180deg, #3f2566 0%, #39225c 100%)",
    imageSrc: "/happyface.png",
    shadowColor: "0 20px 42px rgba(209, 137, 63, 0.22)",
    skyBackground:
      "radial-gradient(circle at 18% 18%, rgba(184, 255, 228, 0.28), transparent 14%), radial-gradient(circle at 84% 18%, rgba(253, 198, 255, 0.22), transparent 12%), linear-gradient(180deg, rgba(102, 62, 158, 0.42) 0%, rgba(61, 36, 98, 0.16) 54%, transparent 100%)",
  },
} as const;

export function MascotHero({
  eyebrow,
  compact = false,
  tone = "default",
  type = "angry",
  title,
  subtitle,
}: MascotHeroProps) {
  const baseTheme = HERO_THEME[type];
  const theme =
    type === "happy" && tone === "lavender"
      ? {
          ...baseTheme,
          blobImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 220' preserveAspectRatio='none'%3E%3Cpath fill='%239d86df' d='M0 92 C48 68 104 74 146 98 C190 50 270 42 328 94 C390 20 520 8 608 92 C676 30 804 26 874 94 C918 70 964 72 1000 92 L1000 220 L0 220 Z'/%3E%3C/svg%3E\")",
          cardBackground: "linear-gradient(180deg, #ebe2ff 0%, #cbb7ff 100%)",
          shadowColor: "0 18px 36px rgba(112, 85, 186, 0.16)",
          skyBackground:
            "linear-gradient(180deg, #f8f4ff 0%, rgba(248, 244, 255, 0.48) 20%, transparent 28%)",
        }
      : baseTheme;

  return (
    <HeroCard
      backgroundGradient={theme.cardBackground}
      compact={compact}
    >
      <Sky backgroundGradient={theme.skyBackground} />
      <Blob blobImage={theme.blobImage} compact={compact} />
      <HeroImage
        alt="화풀기 메인 캐릭터"
        compact={compact}
        src={theme.imageSrc}
      />
      <div
        css={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: colors.background,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {eyebrow ? (
          <Text
            as="div"
            typography="t7"
            fontWeight="bold"
            css={{
              marginBottom: compact ? 6 : 10,
              opacity: 0.95,
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text
          as="div"
            typography={compact ? "t3" : "t1"}
            fontWeight="bold"
            css={{
            whiteSpace: "pre-wrap",
            minHeight: compact ? 36 : 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
              color: "#fbe9d9",
              textShadow:
                "0 4px 0 rgba(58, 32, 93, 0.72), 0 0 12px rgba(255,255,255,0.08)",
              letterSpacing: "-0.03em",
            }}
        >
          {title}
        </Text>
        <Text
          as="div"
          typography={compact ? "t7" : "t6"}
          fontWeight="medium"
          css={{
            marginTop: compact ? 4 : 6,
            opacity: 0.98,
            minHeight: compact ? 24 : 32,
            whiteSpace: "pre-wrap",
            color: "#fff8ef",
          }}
        >
          {subtitle}
        </Text>
      </div>
    </HeroCard>
  );
}
