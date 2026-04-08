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
        "--bottom-cta-background": "#3a235d !important",
        "--bottom-cta-gradient":
          "linear-gradient(to top, #3a235d 24%, rgba(58,35,93,0)) !important",
        "& button": {
          "--button-background-color": "#bff4d5 !important",
          background: "#bff4d5 !important",
          color: "#4a316a !important",
          boxShadow: "0 6px 0 rgba(78, 53, 109, 0.24) !important",
          border: "4px solid #4e356d !important",
          borderRadius: "999px !important",
          textShadow:
            "-1px -1px 0 rgba(255,255,255,0.32), 1px 1px 0 rgba(255,255,255,0.18)",
          fontWeight: "800 !important",
          minHeight: "64px !important",
        },
        ...css,
      }}
      {...props}
    />
  );
}
