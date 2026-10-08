import { OIDCProvider } from "@repo/web-oidc";
import { WebConfig } from "./config";

export const oidcProvider = new OIDCProvider({
	issuer: WebConfig.oidc.issuer,
	clientId: WebConfig.oidc.clientId,
	clientSecret: WebConfig.oidc.clientSecret,
	scope: WebConfig.oidc.scopes,
	gracePeriod: WebConfig.oidc.gracePeriod,
	baseURL: WebConfig.baseUrl,
	cookiePrefix: WebConfig.oidc.cookiePrefix,
	cookieEncryptionKey: WebConfig.oidc.cookieEncryptionKey,
});

console.log(WebConfig);
