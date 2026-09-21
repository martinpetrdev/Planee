import { Box, useMaterialColors } from "@expo/ui/jetpack-compose";
import {
  background,
  clip,
  padding,
  Shapes,
} from "@expo/ui/jetpack-compose/modifiers";
import { useColorScheme } from "react-native";
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

export type BadgeColor = keyof typeof BADGE_COLORS | keyof typeof MATERIAL_ROLES;

interface IBadgeProps {
  label: string;
  color?: BadgeColor;
}

export function Badge(props: IBadgeProps) {
  const isDark = useColorScheme() === "dark";
  const materialColors = useMaterialColors();

  const name = props.color ?? "primary";
  const role = MATERIAL_ROLES[name as keyof typeof MATERIAL_ROLES];
  const hex = BADGE_COLORS[name as keyof typeof BADGE_COLORS]?.[isDark ? 1 : 0];

  const container = role ? materialColors[role[0]] : `${hex}33`;
  const content = role ? materialColors[role[1]] : hex;

  return (
    <Box
      modifiers={[
        clip(Shapes.RoundedCorner(8)),
        background(container),
        padding(8, 2, 8, 2),
      ]}
    >
      <Text typography="labelSmall" color={content}>
        {props.label}
      </Text>
    </Box>
  );
}
