import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import type { MaterialIconType } from "../../icons/icons";

export interface IApplicationTab {
	label: string;
	icon: MaterialIconType;
	id: string;
}

interface IApplicationShellProps {
	tabs: IApplicationTab[];
}

export function ApplicationShell(props: IApplicationShellProps) {
	const colorScheme = useColorScheme();

	const tabs = useMemo(
		() =>
			props.tabs.map((tab) => {
				return (
					<NativeTabs.Trigger key={tab.id} name={tab.id}>
						<NativeTabs.Trigger.Icon md={tab.icon} />
						<NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
					</NativeTabs.Trigger>
				);
			}),
		[props.tabs],
	);

	return (
		<>
			<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<NativeTabs>{tabs}</NativeTabs>
			</ThemeProvider>
		</>
	);
}
