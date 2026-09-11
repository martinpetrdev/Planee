import { PropsWithChildren } from "react";
import {
  Text as JetpackText,
  useMaterialColors,
  type TextProps,
} from "@expo/ui/jetpack-compose";

type TypographyStyle = NonNullable<TextProps["style"]>["typography"];

interface ITextProps extends PropsWithChildren {
  typography?: TypographyStyle;
}

export function Text(props: ITextProps) {
  const materialColors = useMaterialColors();

  return (
    <JetpackText
      color={materialColors.onBackground}
      style={{ typography: props.typography ?? "bodyMedium" }}
    >
      {props.children}
    </JetpackText>
  );
}
