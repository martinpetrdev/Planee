import { Box as JetpackBox, type BoxProps } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import {
  fillMaxSize,
  fillMaxWidth,
  height,
  padding,
  weight,
  width,
} from "@expo/ui/jetpack-compose/modifiers";

interface IBoxProps extends PropsWithChildren {
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  flex?: boolean;
  align?: BoxProps["contentAlignment"];
  width?: number;
  height?: number;
}

export function Box(props: IBoxProps) {
  return (
    <JetpackBox
      contentAlignment={props.align}
      modifiers={[
        ...(props.width || props.height
          ? [
              props.width ? width(props.width) : null,
              props.height ? height(props.height) : null,
            ]
          : props.flex
            ? [weight(1), fillMaxWidth()]
            : [fillMaxSize()]),
        props.padding ||
        props.paddingLeft ||
        props.paddingRight ||
        props.paddingTop ||
        props.paddingBottom
          ? padding(
              props.paddingLeft ?? props.padding ?? 0,
              props.paddingTop ?? props.padding ?? 0,
              props.paddingRight ?? props.padding ?? 0,
              props.paddingBottom ?? props.padding ?? 0,
            )
          : null,
      ].filter((i) => !!i)}
    >
      {props.children}
    </JetpackBox>
  );
}
