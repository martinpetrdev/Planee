"use client";

import { CheckIcon } from "@phosphor-icons/react";
import {
	AppWindowIcon,
	BuildingOfficeIcon,
	FlagIcon,
	GraphIcon,
	HeartbeatIcon,
	HouseIcon,
	LineSegmentIcon,
	LockIcon,
	SignInIcon,
	UsersIcon,
} from "@phosphor-icons/react/ssr";
import { useAuthentication } from "@repo/web-oidc/client";
import { ManagementShell } from "@repo/web-ui/components/management-shell/management-shell";
import {
	Sidebar,
	SidebarHeader,
	SidebarLink,
	SidebarLinkGroup,
	SidebarProfile,
} from "@repo/web-ui/components/management-shell/sidebar";
import type { PropsWithChildren } from "react";
import { WebConfig } from "@/config";
import { useConfig } from "@/providers/ConfigProvider";

export function AppShell(props: PropsWithChildren) {
	const auth = useAuthentication();
	const config = useConfig();

	if (config.isLoading) return;

	return (
		<ManagementShell
			sidebar={
				<Sidebar>
					<SidebarHeader title="Planee" />
					<SidebarLinkGroup title={"Planning"}>
						<SidebarLink href={"/"} workInProgress>
							<HouseIcon size={18} /> Home
						</SidebarLink>
						<SidebarLink href={"/tasks"} workInProgress>
							<CheckIcon size={18} /> Tasks
						</SidebarLink>
					</SidebarLinkGroup>
					<SidebarProfile
						name={auth.profile?.name ?? ""}
						email={auth.profile?.email ?? ""}
						signOut={auth.signOut}
					/>
				</Sidebar>
			}
		>
			{props.children}
		</ManagementShell>
	);
}
