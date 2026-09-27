import { Column as JetpackColumn } from "@expo/ui/jetpack-compose";
import {
	fillMaxSize,
	fillMaxWidth,
	padding,
	weight,
} from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren } from "react";

interface IColumnProps extends PropsWithChildren {
	fill?: boolean;
	flex?: boolean;
	verticalAlignment?: "top" | "center" | "bottom";
	horizontalAlignment?: "start" | "center" | "end";
	padding?: number;
	paddingTop?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	paddingRight?: number;
	gap?: number;
}

export function Column(props: IColumnProps) {
	return (
		<JetpackColumn
			modifiers={[
				...(props.flex
					? [weight(1), fillMaxWidth()]
					: [props.fill ? fillMaxSize() : fillMaxWidth()]),
				padding(
					props.paddingLeft ?? props.padding ?? 0,
					props.paddingTop ?? props.padding ?? 0,
					props.paddingRight ?? props.padding ?? 0,
					props.paddingBottom ?? props.padding ?? 0,
				),
			].filter((i) => !!i)}
			verticalAlignment={props.verticalAlignment}
			horizontalAlignment={props.horizontalAlignment}
			verticalArrangement={props.gap ? { spacedBy: props.gap } : undefined}
		>
			{props.children}
		</JetpackColumn>
	);
}
