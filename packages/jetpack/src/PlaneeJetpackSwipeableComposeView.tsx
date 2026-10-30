// Created by AI (Claude Opus 5.5)

import type { PrimitiveBaseProps } from "@expo/ui/jetpack-compose";
import { createViewModifierEventListener } from "@expo/ui/jetpack-compose/modifiers";
import { requireNativeView } from "expo";
import type { ReactNode } from "react";

export interface SwipeableProps extends PrimitiveBaseProps {
	children: ReactNode;
	onSwipeStartToEnd?: () => void;
	onSwipeEndToStart?: () => void;
}

const NativeSwipeable = requireNativeView<SwipeableProps>(
	"PlaneeJetpackSwipeable",
	"PlaneeJetpackSwipeableComposeView",
);

// @expo/ui doesn't export its Slot, but the native SlotView is registered globally
const Slot = requireNativeView<{ slotName: string; children: ReactNode }>(
	"ExpoUI",
	"SlotView",
);

export function Swipeable({ modifiers, ...rest }: SwipeableProps) {
	return (
		<NativeSwipeable
			modifiers={modifiers}
			{...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
			{...rest}
		/>
	);
}

Swipeable.StartToEndBackground = ({ children }: { children: ReactNode }) => (
	<Slot slotName="startToEnd">{children}</Slot>
);
Swipeable.EndToStartBackground = ({ children }: { children: ReactNode }) => (
	<Slot slotName="endToStart">{children}</Slot>
);
