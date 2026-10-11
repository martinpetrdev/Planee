import {
	Text as JetpackText,
	type TextProps,
	useMaterialColors,
} from "@expo/ui/jetpack-compose";
import {
	clickable,
	padding,
	paddingAll,
} from "@expo/ui/jetpack-compose/modifiers";
import type { PropsWithChildren } from "react";

type TypographyStyle = NonNullable<TextProps["style"]>["typography"];

interface ITextProps extends PropsWithChildren {
	typography?: TypographyStyle;
	color?: string;
	padding?: number | [number, number, number, number];
	onClick?: () => void;
	default?: boolean;
	bold?: boolean;
	align?: NonNullable<TextProps["style"]>["textAlign"];
	lineHeight?: number;
}

const brandFont = "BricolageGrotesque";

export function Text(props: ITextProps) {
	const materialColors = useMaterialColors();

	// Added by Claude Code (Claude Opus 5.5)
	const typography = props.typography ?? "bodyMedium";
	const isBrand = /^(display|headline)/.test(typography);

	return (
		<JetpackText
			color={
				props.default ? undefined : (props.color ?? materialColors.onBackground)
			}
			style={
				props.default
					? undefined
					: {
							typography,
							...(isBrand
								? { fontFamily: brandFont }
								: { fontWeight: props.bold ? "bold" : "normal" }),
							textAlign: props.align,
							lineHeight: props.lineHeight,
						}
			}
			modifiers={[
				props.padding
					? Array.isArray(props.padding)
						? padding(...props.padding)
						: paddingAll(props.padding)
					: null,
				props.onClick ? clickable(props.onClick) : null,
			].filter((i) => !!i)}
		>
			{props.children}
		</JetpackText>
	);
}
