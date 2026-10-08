import type { PropsWithChildren } from "react";
import { OIDC } from "./OIDC";

export async function AuthenticationGuard(props: PropsWithChildren) {
	const state = await OIDC.instance.getSessionStateSSR();

	if (!state.authenticated) {
		await OIDC.instance.authenticate();

		return;
	}

	return props.children;
}
