"use client";

import { useAuthentication } from "@repo/web-oidc/client";

// TODO: Remove/secure later
export default function Page() {
	const auth = useAuthentication();

	return <p>{auth.accessToken}</p>;
}
