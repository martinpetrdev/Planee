import { AuthenticationGuard } from "@repo/web-oidc";
import type { PropsWithChildren } from "react";
import { AdminShell } from "@/components/shell";
import { ServerSideAccessGuard } from "@/providers/AccessGuard";

export default function Layout(props: PropsWithChildren) {
	return (
		<AuthenticationGuard>
			<ServerSideAccessGuard>
				<AdminShell>{props.children}</AdminShell>
			</ServerSideAccessGuard>
		</AuthenticationGuard>
	);
}
