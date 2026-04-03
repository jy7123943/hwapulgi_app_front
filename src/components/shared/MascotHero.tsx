import { Text } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import styled from "@emotion/styled";

const HeroCard = styled.section({
  position: "relative",
  overflow: "hidden",
  borderRadius: 34,
  padding: "4px 18px 14px",
  background: "linear-gradient(180deg, #ff7b74 0%, #ff5b4d 100%)",
  minHeight: 184,
  boxShadow: "0 20px 42px rgba(255, 106, 78, 0.22)",
});

const Sky = styled.div({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, #c56bff 0%, rgba(197, 107, 255, 0.35) 24%, transparent 28%)",
});

const Blob = styled.div({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 142,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 220' preserveAspectRatio='none'%3E%3Cpath fill='%23ff313d' d='M0 92 C48 68 104 74 146 98 C190 50 270 42 328 94 C390 20 520 8 608 92 C676 30 804 26 874 94 C918 70 964 72 1000 92 L1000 220 L0 220 Z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "100% 100%",
  opacity: 0.98,
});

const HeroImage = styled.img({
  position: "relative",
  zIndex: 1,
  width: 88,
  height: 88,
  objectFit: "contain",
  display: "block",
  margin: "0px auto 4px",
  filter: "drop-shadow(0 16px 24px rgba(79, 19, 4, 0.18))",
});

interface MascotHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
}

export function MascotHero({ eyebrow, title, subtitle }: MascotHeroProps) {
  return (
    <HeroCard>
      <Sky />
      <Blob />
      <HeroImage alt="화풀기 메인 캐릭터" src="/angryface.png" />
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
              marginBottom: 10,
              opacity: 0.95,
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text
          as="div"
          typography="t2"
          fontWeight="bold"
          css={{
            whiteSpace: "pre-wrap",
            minHeight: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </Text>
        <Text
          as="div"
          typography="t6"
          fontWeight="medium"
          css={{
            marginTop: 6,
            opacity: 0.9,
            minHeight: 32,
            whiteSpace: "pre-wrap",
          }}
        >
          {subtitle}
        </Text>
      </div>
    </HeroCard>
  );
}
