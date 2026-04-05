import type { ComponentProps } from "react";
import type { CSSObject } from "@emotion/react";
import { FixedBottomCTA } from "@toss/tds-mobile";

interface BottomCTAProps extends ComponentProps<typeof FixedBottomCTA> {
  css?: CSSObject;
}

export function BottomCTA({ css, ...props }: BottomCTAProps) {
  return (
    <FixedBottomCTA
      css={{
        "--bottom-cta-gradient": "transparent !important",
        "& button": {
          "--button-background-color": "#842bdd !important",
          background: "#842bdd !important",
          color: "#ffffff !important",
          boxShadow: "none !important",
          border: "none",
        },
        ...css,
      }}
      {...props}
    />
  );
}
