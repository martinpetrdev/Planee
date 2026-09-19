import { PropsWithChildren } from "react";
import {
  Box,
  CircularProgressIndicator,
  Button as JetpackButton,
  OutlinedButton as JetpackOutlinedButton,
  Text,
} from "@expo/ui/jetpack-compose";
import { alpha, fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";

type ButtonVariant = "filled" | "outlined";

interface IButtonProps extends PropsWithChildren {
  onClick: () => void;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export function Button(props: IButtonProps) {
  const Component = {
    filled: JetpackButton,
    outlined: JetpackOutlinedButton,
  }[props.variant ?? "filled"];

  return (
    <Component
      onClick={props.onClick}
      modifiers={[props.fullWidth ? fillMaxWidth() : null].filter((i) => !!i)}
      enabled={!props.loading && !props.disabled}
    >
      <Box contentAlignment="center">
        <Text modifiers={[alpha(props.loading ? 0 : 1)]}>{props.children}</Text>
        {props.loading && (
          <CircularProgressIndicator
            modifiers={[size(18, 18)]}
            strokeWidth={2}
          />
        )}
      </Box>
    </Component>
  );
}
