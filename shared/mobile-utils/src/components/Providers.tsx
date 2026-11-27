import type { Children } from "../types/Children.ts";

interface IProviderProps {
	children: Children;
}
type IProvider = (props: IProviderProps) => Children;

interface IProvidersProps {
	providers: IProvider[];
	children: Children;
}

export function Providers(props: IProvidersProps) {
	const reversed = props.providers.toReversed();

	let output = props.children;
	for (const Provider of reversed) {
		output = <Provider>{output}</Provider>;
	}

	return output;
}
