import { Column as JetpackColumn } from "@expo/ui/jetpack-compose";
import { fillMaxSize, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { PropsWithChildren } from "react";

interface IColumnProps extends PropsWithChildren {
  verticalAlignment?: "top" | "center" | "bottom";
  horizontalAlignment?: "start" | "center" | "end";
  padding?: number;
}

export function Column(props: IColumnProps) {
  return (
    <JetpackColumn
      modifiers={[
        fillMaxSize(),
        props.padding ? paddingAll(props.padding) : null,
      ].filter((i) => !!i)}
      verticalAlignment={props.verticalAlignment}
      horizontalAlignment={props.horizontalAlignment}
    >
      {props.children}
    </JetpackColumn>
  );
}
