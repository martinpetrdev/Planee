import { OidcAuth } from "@repo/web-oidc";
import { WebConfig } from "@/config";

export const oidcAuth = new OidcAuth(
	WebConfig.oidc.clientId,
	WebConfig.oidc.clientSecret,
	WebConfig.oidc.issuer,
	WebConfig.oidc.scopes,
	WebConfig.oidc.gracePeriod,
	WebConfig.baseUrl,
);

export const authHandler = oidcAuth.authHandler;
