import { Column as JetpackColumn } from "@expo/ui/jetpack-compose";
import {
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { PropsWithChildren } from "react";

interface IColumnProps extends PropsWithChildren {
  fill?: boolean;
  flex?: boolean;
  verticalAlignment?: "top" | "center" | "bottom";
  horizontalAlignment?: "start" | "center" | "end";
  padding?: number;
  gap?: number;
}

export function Column(props: IColumnProps) {
  return (
    <JetpackColumn
      modifiers={[
        ...(props.flex
          ? [weight(1), fillMaxWidth()]
          : [props.fill ? fillMaxSize() : fillMaxWidth()]),
        props.padding ? paddingAll(props.padding) : null,
      ].filter((i) => !!i)}
      verticalAlignment={props.verticalAlignment}
      horizontalAlignment={props.horizontalAlignment}
      verticalArrangement={props.gap ? { spacedBy: props.gap } : undefined}
    >
      {props.children}
    </JetpackColumn>
  );
}
