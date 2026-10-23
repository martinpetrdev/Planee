import { Box, Row, useMaterialColors } from "@expo/ui/jetpack-compose";
import {
	background,
	clip,
	padding,
	Shapes,
} from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import type { IconType } from "../../icons/icons";
import { Icon } from "./Icon";
import { Text } from "./Text";

// [light mode, dark mode] content color; the container is the same color at 20% alpha.
const BADGE_COLORS = {
	red: ["#b91c1c", "#f87171"],
	orange: ["#c2410c", "#fb923c"],
	amber: ["#b45309", "#fbbf24"],
	yellow: ["#a16207", "#facc15"],
	lime: ["#4d7c0f", "#a3e635"],
	green: ["#15803d", "#4ade80"],
	emerald: ["#047857", "#34d399"],
	teal: ["#0f766e", "#2dd4bf"],
	cyan: ["#0e7490", "#22d3ee"],
	blue: ["#1d4ed8", "#60a5fa"],
	indigo: ["#4338ca", "#818cf8"],
	violet: ["#6d28d9", "#a78bfa"],
	purple: ["#7e22ce", "#c084fc"],
	fuchsia: ["#a21caf", "#e879f9"],
	pink: ["#be185d", "#f472b6"],
	slate: ["#334155", "#94a3b8"],
} as const;

// Material You roles, tinted from the device theme.
const MATERIAL_ROLES = {
	primary: ["primaryContainer", "onPrimaryContainer"],
	secondary: ["secondaryContainer", "onSecondaryContainer"],
	tertiary: ["tertiaryContainer", "onTertiaryContainer"],
	error: ["errorContainer", "onErrorContainer"],
} as const;

export type BadgeColor =
	| keyof typeof BADGE_COLORS
	| keyof typeof MATERIAL_ROLES;

interface IBadgeProps {
	label: string;
	color?: BadgeColor;
	icon?: IconType;
	// Pulsating icon for pending states
	pulse?: boolean;
}

const PULSE_HALF_MS = 700;

export function Badge(props: IBadgeProps) {
	const [dim, setDim] = useState(false);

	const isDark = useColorScheme() === "dark";
	const materialColors = useMaterialColors();

	const name = props.color ?? "primary";
	const role = MATERIAL_ROLES[name as keyof typeof MATERIAL_ROLES];
	const hex = BADGE_COLORS[name as keyof typeof BADGE_COLORS]?.[isDark ? 1 : 0];

	const container = role ? materialColors[role[0]] : `${hex}33`;
	const content = role ? materialColors[role[1]] : hex;

	// Written by Claude Code (Claude Opus 5.5)
	useEffect(() => {
		if (!props.pulse) return setDim(false);
		const id = setInterval(() => setDim((d) => !d), PULSE_HALF_MS);

		return () => clearInterval(id);
	}, [props.pulse]);

	return (
		<Box
			modifiers={[
				clip(Shapes.RoundedCorner(8)),
				background(container),
				padding(props.icon ? 6 : 8, 2, 8, 2),
			]}
		>
			<Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}>
				{props.icon && (
					<Icon
						name={props.icon}
						size={12}
						color={content}
						styles={{
							// Written by Claude Code (Claude Opus 5.5)
							scale: dim ? 0.8 : 1,
							alpha: dim ? 0.45 : 1,
							fadeMillis: PULSE_HALF_MS,
						}}
					/>
				)}
				<Text typography="labelSmall" color={content}>
					{props.label}
				</Text>
			</Row>
		</Box>
	);
}
