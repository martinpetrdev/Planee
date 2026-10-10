"use client";

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

export function AdminShell(props: PropsWithChildren) {
	const auth = useAuthentication();
	const config = useConfig();

	if (config.isLoading) return;

	return (
		<ManagementShell
			sidebar={
				<Sidebar>
					<SidebarHeader title="Adminee" />
					<SidebarLinkGroup title={"General"}>
						<SidebarLink href={"/"} workInProgress>
							<HouseIcon size={18} /> Home
						</SidebarLink>
					</SidebarLinkGroup>
					<SidebarLinkGroup title={"Statistics"}>
						<SidebarLink href={"/statistics"} workInProgress>
							<GraphIcon size={18} /> General statistics
						</SidebarLink>
					</SidebarLinkGroup>
					<SidebarLinkGroup title={"Users & orgs"}>
						<SidebarLink href={"/users"} workInProgress>
							<UsersIcon size={18} /> Users
						</SidebarLink>
						<SidebarLink href={"/tenants"} workInProgress>
							<BuildingOfficeIcon size={18} /> Tenants
						</SidebarLink>
					</SidebarLinkGroup>
					<SidebarLinkGroup title={"Special"}>
						<SidebarLink href={"/programs/early-access"}>
							<LockIcon size={18} /> Early access program
						</SidebarLink>
					</SidebarLinkGroup>
					<SidebarLinkGroup title={"External"}>
						<SidebarLink href={config.config.app.baseUrl}>
							<AppWindowIcon size={18} /> Planee
						</SidebarLink>
						<SidebarLink
							href={
								"https://kc.cloud.martinpetr.dev/admin/master/console/#/dev.martinpetr.planee"
							}
						>
							<SignInIcon size={18} /> Keycloak
						</SidebarLink>
						<SidebarLink href={"https://flags.planee.martinpetr.dev"}>
							<FlagIcon size={18} /> Flag manager
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
