import {
  Box as JetpackBox,
  type BoxProps,
} from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import {
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";

interface IBoxProps extends PropsWithChildren {
  padding?: number;
  flex?: boolean;
  align?: BoxProps["contentAlignment"];
}

export function Box(props: IBoxProps) {
  return (
    <JetpackBox
      contentAlignment={props.align}
      modifiers={[
        ...(props.flex ? [weight(1), fillMaxWidth()] : [fillMaxSize()]),
        props.padding ? paddingAll(props.padding) : null,
      ].filter((i) => !!i)}
    >
      {props.children}
    </JetpackBox>
  );
}
