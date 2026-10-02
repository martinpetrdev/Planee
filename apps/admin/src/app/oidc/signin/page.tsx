"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

/**
 * Selects Keycloak method instead of allowing the user to select
 */
export default function SignIn() {
	useEffect(() => {
		const callback =
			new URLSearchParams(location.search).get("callbackUrl") ?? "/";

		signIn("keycloak", { callbackUrl: callback });
	}, []);

	return <></>;
}
