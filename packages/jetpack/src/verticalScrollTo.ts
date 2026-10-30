// Created by AI (Claude Opus 5.5)

import { createModifier } from "@expo/ui/jetpack-compose/modifiers";

/**
 * Drop-in for expo-ui's `verticalScroll()` that animates `offset` (dp) to the
 * viewport center whenever `request` changes. `request = 0` never scrolls.
 */
export const verticalScrollTo = (offset: number, request: number) =>
	createModifier("planeeVerticalScrollTo", { offset, request });
