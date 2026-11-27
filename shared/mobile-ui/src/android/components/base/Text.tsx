import { Text as JText, type TextProps } from "@expo/ui/jetpack-compose";

type Typography = NonNullable<TextProps["style"]>["typography"];

interface ITextProps {
	children: string | string[];
	typography?: Typography;
	secondaryFont?: boolean;
}

// @ai/assisted(Claude Opus 5.5): Typed the typography prop from TextProps and passed it to the Compose Text style.
export function Text(props: ITextProps) {
	return (
		<JText
			style={{
				typography: props.typography as any,
				fontFamily: props.secondaryFont ? "BricolageGrotesque" : "default",
			}}
		>
			{props.children}
		</JText>
	);
}
