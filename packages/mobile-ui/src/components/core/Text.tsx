import { PropsWithChildren } from "react";
import {
  Text as JetpackText,
  useMaterialColors,
  type TextProps,
} from "@expo/ui/jetpack-compose";
import {
  clickable,
  padding,
  paddingAll,
} from "@expo/ui/jetpack-compose/modifiers";

type TypographyStyle = NonNullable<TextProps["style"]>["typography"];

interface ITextProps extends PropsWithChildren {
  typography?: TypographyStyle;
  color?: string;
  padding?: number | [number, number, number, number];
  onClick?: () => void;
  default?: boolean;
  bold?: boolean;
  align?: NonNullable<TextProps["style"]>["textAlign"];
}

export function Text(props: ITextProps) {
  const materialColors = useMaterialColors();

  return (
    <JetpackText
      color={
        props.default ? undefined : (props.color ?? materialColors.onBackground)
      }
      style={
        props.default
          ? undefined
          : {
              typography: props.typography ?? "bodyMedium",
              fontWeight: props.bold ? "bold" : "normal",
              textAlign: props.align,
            }
      }
      modifiers={[
        props.padding
          ? Array.isArray(props.padding)
            ? padding(...props.padding)
            : paddingAll(props.padding)
          : null,
        props.onClick ? clickable(props.onClick) : null,
      ].filter((i) => !!i)}
    >
      {props.children}
    </JetpackText>
  );
}
