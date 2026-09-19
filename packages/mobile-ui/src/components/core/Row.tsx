import { Row as JetpackRow, Spacer } from "@expo/ui/jetpack-compose";
import {
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { PropsWithChildren } from "react";

interface IRowProps extends PropsWithChildren {
  fill?: boolean;
  verticalAlignment?: "top" | "center" | "bottom";
  horizontalAlignment?: "start" | "center" | "end";
  padding?: number;
  gap?: number;
}

export function Row(props: IRowProps) {
  const align = props.horizontalAlignment;
  const spaced = !!props.gap && !!align && align !== "start";

  return (
    <JetpackRow
      modifiers={[
        props.fill ? fillMaxSize() : fillMaxWidth(),
        props.padding ? paddingAll(props.padding) : null,
      ].filter((i) => !!i)}
      verticalAlignment={props.verticalAlignment}
      horizontalArrangement={props.gap ? { spacedBy: props.gap } : align}
    >
      {spaced ? <Spacer modifiers={[weight(1)]} /> : null}
      {props.children}
      {spaced && align === "center" ? <Spacer modifiers={[weight(1)]} /> : null}
    </JetpackRow>
  );
}
