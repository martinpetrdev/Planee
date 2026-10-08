import Link from "next/link";
import type { PropsWithChildren } from "react";

export function Sidebar(props: PropsWithChildren) {
	return <div className="w-80 flex flex-col gap-4">{props.children}</div>;
}

interface ISidebarHeaderProps {
	title: string;
}

export function SidebarHeader(props: ISidebarHeaderProps) {
	return (
		<div className="w-full flex flex-row pl-4 pr-6 py-4">
			<p className="text-xl">{props.title}</p>
		</div>
	);
}

interface ISidebarGroupProps extends PropsWithChildren {
	title: string;
}

export function SidebarLinkGroup(props: ISidebarGroupProps) {
	return (
		<div className="flex flex-col gap-px pr-2">
			<p className="text-muted-foreground uppercase font-bold text-xs pl-4 mb-1">
				{props.title}
			</p>
			{props.children}
		</div>
	);
}

interface ISidebarLinkProps extends PropsWithChildren {
	href: string;
	workInProgress?: boolean;
}

export function SidebarLink(props: ISidebarLinkProps) {
	return (
		<Link
			href={props.href}
			className="px-4 py-1 flex gap-2 items-center hover:bg-white hover:text-background transition-colors duration-200 rounded-md"
		>
			{props.children}
			{props.workInProgress && (
				<p className="flex ml-auto text-background bg-white text-xs px-1 py-0.5 rounded-sm font-bold">
					<abbr title={"Work in progress"} className={"no-underline"}>
						WIP
					</abbr>
				</p>
			)}
		</Link>
	);
}
