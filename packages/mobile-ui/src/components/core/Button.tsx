import { PropsWithChildren } from "react";
import {
  Box,
  CircularProgressIndicator,
  Button as JetpackButton,
  OutlinedButton as JetpackOutlinedButton,
  IconButton as JetpackIconButton,
  TextButton as JetpackTextButton,
  Text,
  useMaterialColors,
} from "@expo/ui/jetpack-compose";
import { alpha, fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";

type ButtonVariant = "filled" | "outlined" | "icon" | "text";
type ButtonColorVariant = "primary" | "secondary" | "tertiary" | "danger";

interface IButtonProps extends PropsWithChildren {
  onClick: () => void;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  colorVariant?: ButtonColorVariant;
}

export function Button(props: IButtonProps) {
  const materialColors = useMaterialColors();

  const variant = props.variant ?? "filled";
  const role = props.colorVariant ?? "primary";
  const [color, onColor] = {
    primary: [materialColors.primary, materialColors.onPrimary],
    secondary: [materialColors.secondary, materialColors.onSecondary],
    tertiary: [materialColors.tertiary, materialColors.onTertiary],
    danger: [materialColors.error, materialColors.onError],
  }[role];

  // Filled buttons have a bg color, outlined/icon only content color.
  const colors =
    variant === "filled"
      ? { containerColor: color, contentColor: onColor }
      : { contentColor: color };

  const Component = {
    filled: JetpackButton,
    outlined: JetpackOutlinedButton,
    icon: JetpackIconButton,
    text: JetpackTextButton,
  }[variant];

  return (
    <Component
      onClick={props.onClick}
      colors={colors}
      modifiers={[props.fullWidth ? fillMaxWidth() : null].filter((i) => !!i)}
      enabled={!props.loading && !props.disabled}
    >
      <Box contentAlignment="center">
        {props.variant === "icon" ? (
          <Box modifiers={[alpha(props.loading ? 0 : 1)]}>{props.children}</Box>
        ) : (
          <Text modifiers={[alpha(props.loading ? 0 : 1)]}>
            {props.children}
          </Text>
        )}
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
