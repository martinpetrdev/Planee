"use client";

import { useAuthentication } from "@repo/web-oidc/client";

export default function Page() {
	const auth = useAuthentication();

	return (
		<div>
			<p>{auth.isAuthenticated ? "Authenticated" : "not"}</p>

			<p>{auth.profile?.name}</p>
			<p>{auth.profile?.email}</p>
		</div>
	);
}
