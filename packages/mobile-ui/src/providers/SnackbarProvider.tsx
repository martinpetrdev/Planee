import {
	Host,
	Snackbar,
	SnackbarHost,
	type SnackbarHostRef,
	useMaterialColors,
} from "@expo/ui/jetpack-compose";
import {
	createContext,
	type PropsWithChildren,
	type RefObject,
	useContext,
	useMemo,
	useRef,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ISnackbarContextValue {
	ref: RefObject<SnackbarHostRef | null>;
}

const SnackbarContext = createContext<ISnackbarContextValue | null>(null);

interface ISnackbarProviderProps extends PropsWithChildren {}

export function SnackbarProvider(props: ISnackbarProviderProps) {
	const ref = useRef<SnackbarHostRef>(null);
	const insets = useSafeAreaInsets();
	const materialColors = useMaterialColors();

	return (
		<SnackbarContext.Provider value={{ ref }}>
			{props.children}
			<Host
				matchContents={{ vertical: true }}
				style={{
					position: "absolute",
					bottom: insets.bottom,
					left: insets.left,
					right: insets.right,
				}}
			>
				<SnackbarHost ref={ref}>
					<Snackbar
						containerColor={materialColors.surfaceContainerHigh}
						contentColor={materialColors.onSurface}
						actionContentColor={materialColors.primary}
						dismissActionContentColor={materialColors.onSurfaceVariant}
					/>
				</SnackbarHost>
			</Host>
		</SnackbarContext.Provider>
	);
}

export function useSnackbar() {
	const ctx = useContext(SnackbarContext);
	if (!ctx)
		throw new Error("useSnackbar must be used within a SnackbarProvider");

	return useMemo(
		() => ({
			show: async (props: {
				message: string;
				actionLabel?: string;
				withDismissAction?: boolean;
				duration: "short" | "long" | "indefinite";
				onAction?: () => void;
			}) => {
				const result = await ctx.ref.current?.showSnackbar({
					message: props.message,
					actionLabel: props.actionLabel,
					withDismissAction: props.withDismissAction,
					duration: props.duration,
				});

				if (result === "actionPerformed") props.onAction?.();
			},
		}),
		[ctx],
	);
}
