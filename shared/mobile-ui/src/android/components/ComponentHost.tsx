import { Box, Host } from "@expo/ui/jetpack-compose";
import { fillMaxSize } from "@expo/ui/jetpack-compose/modifiers";
import type { Children } from "@repo-shared/mobile-utils";
import { useColorTheme } from "../hooks/useColorTheme.ts";

interface IComponentHostProps {
	children: Children;
}

export function ComponentHost(props: IComponentHostProps) {
	const theme = useColorTheme();

	return (
		<Host
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				backgroundColor: theme.background,
			}}
		>
			<Box modifiers={[fillMaxSize()]}>{props.children}</Box>
		</Host>
	);
}
