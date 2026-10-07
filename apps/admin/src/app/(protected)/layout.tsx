import { AuthenticationGuard } from "@repo/web-oidc";
import type { PropsWithChildren } from "react";
import { ServerSideAccessGuard } from "@/providers/AccessGuard";

export default function Layout(props: PropsWithChildren) {
	return (
		<AuthenticationGuard>
			<p>You are logged in</p>
		</AuthenticationGuard>
	);
}
