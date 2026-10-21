import {
	Box,
	CircularProgressIndicator,
	CircularWavyProgressIndicator,
	LinearProgressIndicator,
	LinearWavyProgressIndicator,
	useMaterialColors,
} from "@expo/ui/jetpack-compose";
import { align, fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";
import { Text } from "./Text";

interface IProgressbarProps {
	max: number;
	min: number;
	current: number;
	variant: "circular" | "linear" | "circular-wavy" | "linear-wavy";
	label?: string;
	size?: number;
	color?: string;
	trackColor?: string;
}

export function Progressbar(props: IProgressbarProps) {
	const colors = useMaterialColors();
	const range = props.max - props.min;
	const diameter = props.size ?? 50;

	const Elem = {
		linear: LinearProgressIndicator,
		circular: CircularProgressIndicator,
		"circular-wavy": CircularWavyProgressIndicator,
		"linear-wavy": LinearWavyProgressIndicator,
	}[props.variant];

	return (
		<Box>
			<Elem
				progress={range > 0 ? (props.current - props.min) / range : 0}
				strokeWidth={6}
				color={props.color}
				trackColor={props.trackColor ?? colors.secondaryContainer}
				modifiers={[
					["circular", "circular-wavy"].includes(props.variant)
						? size(diameter, diameter)
						: fillMaxWidth(),
				].filter((m) => !!m)}
			/>
			{props.label && (
				<Box modifiers={[align("center")]}>
					<Text typography="labelLarge" bold color={colors.onSurface}>
						{props.label}
					</Text>
				</Box>
			)}
		</Box>
	);
}
