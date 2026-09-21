import { Box as JetpackBox, type BoxProps } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import {
  fillMaxSize,
  fillMaxWidth,
  padding,
  paddingAll,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";

interface IBoxProps extends PropsWithChildren {
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  flex?: boolean;
  align?: BoxProps["contentAlignment"];
}

export function Box(props: IBoxProps) {
  return (
    <JetpackBox
      contentAlignment={props.align}
      modifiers={[
        ...(props.flex ? [weight(1), fillMaxWidth()] : [fillMaxSize()]),
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
