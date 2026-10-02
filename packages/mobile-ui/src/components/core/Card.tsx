import { Shape, Surface, useMaterialColors } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren } from "react";
import { Box } from "./Box";

interface ICardProps extends PropsWithChildren {
	padding?: number;
	paddingLeft?: number;
	paddingRight?: number;
	paddingTop?: number;
	paddingBottom?: number;
	borderRadius?: number;
	borderRadiusTL?: number;
	borderRadiusTR?: number;
	borderRadiusBL?: number;
	borderRadiusBR?: number;
	fillWidth?: boolean;
	onClick?: () => void;
}

export function Card(props: ICardProps) {
	const colors = useMaterialColors();

	return (
		<Surface
			color={colors.surfaceContainer}
			shape={Shape.RoundedCorner({
				cornerRadii: {
					topStart: props.borderRadiusTL ?? props.borderRadius,
					topEnd: props.borderRadiusTR ?? props.borderRadius,
					bottomStart: props.borderRadiusBL ?? props.borderRadius,
					bottomEnd: props.borderRadiusBR ?? props.borderRadius,
				},
			})}
			modifiers={props.fillWidth ? [fillMaxWidth()] : []}
			onClick={props.onClick}
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
		</Surface>
	);
}
