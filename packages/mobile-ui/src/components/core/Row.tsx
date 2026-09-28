import { Row as JetpackRow, Spacer } from "@expo/ui/jetpack-compose";
import {
	clickable,
	fillMaxSize,
	fillMaxWidth,
	padding,
	paddingAll,
	weight,
} from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren } from "react";

interface IRowProps extends PropsWithChildren {
	fill?: boolean;
	fit?: boolean;
	verticalAlignment?: "top" | "center" | "bottom";
	horizontalAlignment?: "start" | "center" | "end";
	padding?: number;
	paddingTop?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	paddingRight?: number;
	gap?: number;
	onClick?: () => void;
}

export function Row(props: IRowProps) {
	const align = props.horizontalAlignment;
	const spaced = !!props.gap && !!align && align !== "start";

	return (
		<JetpackRow
			modifiers={[
				props.onClick ? clickable(props.onClick) : null,
				props.fill ? fillMaxSize() : props.fit ? null : fillMaxWidth(),
				padding(
					props.paddingLeft ?? props.padding ?? 0,
					props.paddingTop ?? props.padding ?? 0,
					props.paddingRight ?? props.padding ?? 0,
					props.paddingBottom ?? props.paddingBottom ?? 0,
				),
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
