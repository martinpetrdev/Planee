import type { Children } from "@repo-shared/mobile-utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComponentHost, useColorTheme } from "../android/index.ts";

interface IScreenShellProps {
	children?: Children;
}

export function ScreenShell(props: IScreenShellProps) {
	const theme = useColorTheme();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
			<ComponentHost>{props.children}</ComponentHost>
		</SafeAreaView>
	);
}
