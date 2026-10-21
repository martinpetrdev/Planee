import {
	Box,
	CircularProgressIndicator,
	Button as JetpackButton,
	ElevatedButton as JetpackElevatedButton,
	IconButton as JetpackIconButton,
	OutlinedButton as JetpackOutlinedButton,
	TextButton as JetpackTextButton,
	Row,
	Text,
	useMaterialColors,
} from "@expo/ui/jetpack-compose";
import { alpha, fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren, ReactNode } from "react";

type ButtonVariant = "filled" | "elevated" | "outlined" | "icon" | "text";
type ButtonColorVariant = "primary" | "secondary" | "tertiary" | "danger";

interface IButtonProps extends PropsWithChildren {
	onClick: () => void;
	fullWidth?: boolean;
	variant?: ButtonVariant;
	loading?: boolean;
	disabled?: boolean;
	colorVariant?: ButtonColorVariant;
	icon?: (color: string) => ReactNode;
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
	const contentColor = variant === "filled" ? onColor : color;
	const colors =
		variant === "filled"
			? { containerColor: color, contentColor }
			: { contentColor };

	const Component = {
		filled: JetpackButton,
		elevated: JetpackElevatedButton,
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
					<Row
						modifiers={[alpha(props.loading ? 0 : 1)]}
						horizontalArrangement={{ spacedBy: 8 }}
						verticalAlignment="center"
					>
						{props.icon?.(contentColor)}
						<Text>{props.children}</Text>
					</Row>
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
