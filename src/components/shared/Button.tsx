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
        css,
        {
          "&": {
            "--button-background-color": "#842bdd !important",
          },
        },
      ]}
    >
      {props.children}
    </TdsButton>
  );
}
