import { AuthenticationGuard } from "@repo/web-oidc";
import type { PropsWithChildren } from "react";
import { AppShell } from "@/components/shell";

export default function Layout(props: PropsWithChildren) {
	return (
		<AuthenticationGuard>
			<AppShell>{props.children}</AppShell>
		</AuthenticationGuard>
	);
}
