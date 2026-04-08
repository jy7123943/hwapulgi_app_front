import type { ComponentProps } from "react";
import type { CSSObject } from "@emotion/react";
import { Button as TdsButton } from "@toss/tds-mobile";

interface ButtonProps extends ComponentProps<typeof TdsButton> {
  css?: CSSObject;
}

export function Button({ css, ...props }: ButtonProps) {
  return (
    <TdsButton
      {...props}
      display="block"
      css={[
        {
          "&": {
            "--button-background-color": "#bff4d5 !important",
            borderRadius: "999px !important",
            color: "#4a316a !important",
            border: "4px solid #4e356d !important",
            boxShadow: "0 6px 0 rgba(78, 53, 109, 0.24) !important",
            textShadow:
              "-1px -1px 0 rgba(255,255,255,0.32), 1px 1px 0 rgba(255,255,255,0.18)",
            letterSpacing: "-0.02em",
            fontWeight: "800 !important",
            minHeight: "64px",
            paddingLeft: "24px !important",
            paddingRight: "24px !important",
          },
        },
        css,
      ]}
    >
      {props.children}
    </TdsButton>
  );
}
