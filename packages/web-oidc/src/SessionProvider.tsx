"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect } from "react";

/**
 * Refresh token is marked as expired or revoked, go through keycloak again.
 * Silent if keycloack SSO is still active.
 */
function RefreshErrorRedirect() {
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.error === "RefreshTokenError") void signIn("keycloak");
	}, [session?.error]);

	return null;
}

export function AuthProvider(props: PropsWithChildren) {
	return (
		<SessionProvider basePath="/oidc">
			<RefreshErrorRedirect />
			{props.children}
		</SessionProvider>
	);
}
