import type { PropsWithChildren } from "react";
import type { Sidebar } from "@/components/management-shell/sidebar";

interface IManagementShellProps extends PropsWithChildren {
	sidebar: ReturnType<typeof Sidebar>;
}

export function ManagementShell(props: IManagementShellProps) {
	return (
		<div className="w-screen h-screen overflow-hidden p-2 bg-secondary flex">
			{props.sidebar}
			<div className="flex flex-1 bg-background rounded-md">
				{props.children}
			</div>
		</div>
	);
}
