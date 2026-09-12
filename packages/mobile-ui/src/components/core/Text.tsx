import { PropsWithChildren } from "react";
import {
  Text as JetpackText,
  useMaterialColors,
  type TextProps,
} from "@expo/ui/jetpack-compose";
import { padding, paddingAll } from "@expo/ui/jetpack-compose/modifiers";

type TypographyStyle = NonNullable<TextProps["style"]>["typography"];

interface ITextProps extends PropsWithChildren {
  typography?: TypographyStyle;
  padding?: number | [number, number, number, number];
}

export function Text(props: ITextProps) {
  const materialColors = useMaterialColors();

  return (
    <JetpackText
      color={materialColors.onBackground}
      style={{ typography: props.typography ?? "bodyMedium" }}
      modifiers={[
        props.padding
          ? Array.isArray(props.padding)
            ? padding(...props.padding)
            : paddingAll(props.padding)
          : null,
      ].filter((i) => !!i)}
    >
      {props.children}
    </JetpackText>
  );
}
