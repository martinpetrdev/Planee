import { Card as JetpackCard } from "@expo/ui/jetpack-compose";
import { PropsWithChildren } from "react";
import {
  clickable,
  fillMaxWidth,
  paddingAll,
} from "@expo/ui/jetpack-compose/modifiers";
import { Box } from "./Box";

interface ICardProps extends PropsWithChildren {
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  fillWidth?: boolean;
  onClick?: () => void;
}

export function Card(props: ICardProps) {
  return (
    <JetpackCard
      modifiers={[
        props.fillWidth ? fillMaxWidth() : null,
        props.onClick ? clickable(props.onClick) : null,
      ].filter((m) => !!m)}
    >
      <Box
        padding={props.padding}
        paddingLeft={props.paddingLeft}
        paddingRight={props.paddingRight}
        paddingTop={props.paddingTop}
        paddingBottom={props.paddingBottom}
      >
        {props.children}
      </Box>
    </JetpackCard>
  );
}
