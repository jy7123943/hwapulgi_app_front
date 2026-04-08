import { Text } from "@toss/tds-mobile";

interface ScreenHeadingProps {
  align?: "left" | "center";
  eyebrow?: string;
  subtitle?: string;
  title: string;
}

export function ScreenHeading({
  align = "center",
  eyebrow,
  subtitle,
  title,
}: ScreenHeadingProps) {
  return (
    <section
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 8,
        padding: "12px 4px 4px",
        width: "100%",
      }}
    >
      {eyebrow ? (
        <Text
          as="div"
          typography="t6"
          fontWeight="bold"
          css={{
            color: "#c8ffdf",
            letterSpacing: "0.04em",
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text
        as="h1"
        typography="t1"
        fontWeight="bold"
        css={{
          color: "#fff4df",
          whiteSpace: "pre-wrap",
          textShadow:
            "-1.5px -1.5px 0 #4e356d, 1.5px -1.5px 0 #4e356d, -1.5px 1.5px 0 #4e356d, 1.5px 1.5px 0 #4e356d",
          letterSpacing: "-0.05em",
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          as="p"
          typography="t5"
          fontWeight="medium"
          css={{
            color: "#effff7",
            whiteSpace: "pre-wrap",
            opacity: 0.96,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </section>
  );
}
