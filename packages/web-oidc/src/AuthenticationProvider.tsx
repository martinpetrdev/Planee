import { type PropsWithChildren, useMemo } from "react";
import { AuthenticationContextProvider } from "./AuthenticationContext";
import { OIDC } from "./OIDC";
import type { OIDCProvider } from "./OIDCProvider";

interface IAuthenticationProviderProps extends PropsWithChildren {
	provider: OIDCProvider;
}

export async function AuthenticationProvider(
	props: IAuthenticationProviderProps,
) {
	const oidc = useMemo(() => new OIDC(props.provider), [props.provider]);

	const state = await oidc.getSessionStateSSR();
	const profile = await oidc.getProfile();
	const accessToken = await oidc.getAccessToken();

	return (
		<AuthenticationContextProvider
			initialIsAuthenticated={state.authenticated}
			initialProfile={profile}
			initialAccessToken={accessToken ?? ""}
		>
			{props.children}
		</AuthenticationContextProvider>
	);
}
