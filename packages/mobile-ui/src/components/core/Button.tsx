import { PropsWithChildren } from "react";
import { Button as JetpackButton, Text } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

interface IButtonProps extends PropsWithChildren {
  onClick: () => void;
  fullWidth?: boolean;
}

export function Button(props: IButtonProps) {
  return (
    <JetpackButton
      onClick={props.onClick}
      modifiers={[props.fullWidth ? fillMaxWidth() : null].filter((i) => !!i)}
    >
      <Text>{props.children}</Text>
    </JetpackButton>
  );
}
