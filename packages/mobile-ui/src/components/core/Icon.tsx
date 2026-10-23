import { Icon as JetpackIcon } from "@expo/ui/jetpack-compose";
import {
	animated,
	graphicsLayer,
	spring,
	tween,
} from "@expo/ui/jetpack-compose/modifiers";
import { Icons, type IconType } from "../../icons/icons";

interface IIconProps {
	name: IconType;
	size?: number;
	color?: string;
	styles?: {
		rotation?: number;
		scale?: number;
		alpha?: number;
		// Duration of a scale/alpha change; e.g. one half of a pulse
		// Added by Claude Code (Claude Opus 5.5)
		fadeMillis?: number;
	};
}

export function Icon(props: IIconProps) {
	// Added by Claude Code (Claude Opus 5.5)
	const fade = tween({
		durationMillis: props.styles?.fadeMillis ?? 200,
		easing: "ease",
	});

	return (
		<JetpackIcon
			modifiers={[
				graphicsLayer({
					rotationZ: animated(props.styles?.rotation ?? 0, spring()),
					scaleX: animated(props.styles?.scale ?? 1, fade),
					scaleY: animated(props.styles?.scale ?? 1, fade),
					alpha: animated(props.styles?.alpha ?? 1, fade),
				}),
			]}
			source={Icons[props.name]}
			size={props.size}
			tint={props.color}
		/>
	);
}
