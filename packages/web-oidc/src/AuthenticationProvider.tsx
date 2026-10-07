import { type PropsWithChildren, useMemo } from "react";
import { OIDC } from "./OIDC";
import type { OIDCProvider } from "./OIDCProvider";

interface IAuthenticationProviderProps extends PropsWithChildren {
	provider: OIDCProvider;
}

export async function AuthenticationProvider(
	props: IAuthenticationProviderProps,
) {
	const oidc = useMemo(() => new OIDC(props.provider), [props.provider]);

	return <>{props.children}</>;
}
