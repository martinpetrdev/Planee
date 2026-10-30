import {
	type BoxProps,
	Box as JetpackBox,
	Shape,
} from "@expo/ui/jetpack-compose";
import {
	background,
	clickable,
	clip,
	fillMaxSize,
	fillMaxWidth,
	height,
	offset,
	padding,
	Shapes,
	weight,
	width,
} from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren } from "react";

interface IBoxProps extends PropsWithChildren {
	padding?: number;
	paddingLeft?: number;
	paddingRight?: number;
	paddingTop?: number;
	paddingBottom?: number;
	flex?: boolean;
	align?: BoxProps["contentAlignment"];
	width?: number | "fill";
	height?: number;
	backgroundColor?: string;
	borderRadius?: number;
	borderRadiusTL?: number;
	borderRadiusTR?: number;
	borderRadiusBL?: number;
	borderRadiusBR?: number;
	top?: number;
	left?: number;
	onClick?: () => void;
}

export function Box(props: IBoxProps) {
	return (
		<JetpackBox
			contentAlignment={props.align}
			modifiers={[
				props.top || props.left
					? offset(props.left ?? 0, props.top ?? 0)
					: null,
				props.onClick ? clickable(props.onClick) : null,
				clip(
					Shapes.RoundedCorner({
						topStart: props.borderRadiusTL ?? props.borderRadius ?? 0,
						topEnd: props.borderRadiusTR ?? props.borderRadius ?? 0,
						bottomStart: props.borderRadiusBL ?? props.borderRadius ?? 0,
						bottomEnd: props.borderRadiusBR ?? props.borderRadius ?? 0,
					}),
				),
				props.backgroundColor ? background(props.backgroundColor) : null,
				...(props.width || props.height
					? [
							props.width
								? props.width === "fill"
									? fillMaxWidth()
									: width(props.width)
								: null,
							props.height ? height(props.height) : null,
						]
					: props.flex
						? [weight(1), fillMaxWidth()]
						: [fillMaxSize()]),
				props.padding ||
				props.paddingLeft ||
				props.paddingRight ||
				props.paddingTop ||
				props.paddingBottom
					? padding(
							props.paddingLeft ?? props.padding ?? 0,
							props.paddingTop ?? props.padding ?? 0,
							props.paddingRight ?? props.padding ?? 0,
							props.paddingBottom ?? props.padding ?? 0,
						)
					: null,
			].filter((i) => !!i)}
		>
			{props.children}
		</JetpackBox>
	);
}
