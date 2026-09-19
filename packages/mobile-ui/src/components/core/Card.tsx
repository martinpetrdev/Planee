import { Card as JetpackCard } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import { fillMaxWidth, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { Box } from "./Box";

interface ICardProps extends PropsWithChildren {
  padding?: number;
  fillWidth?: boolean;
}

export function Card(props: ICardProps) {
  return (
    <JetpackCard
      modifiers={[props.fillWidth ? fillMaxWidth() : null].filter((m) => !!m)}
    >
      <Box padding={props.padding}>{props.children}</Box>
    </JetpackCard>
  );
}
