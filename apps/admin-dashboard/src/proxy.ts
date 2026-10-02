import { OidcProxy } from "@repo/web-oidc";

export { OidcProxy as default };

// Everything, except for: oidc, configuration.json, signed-out, _next, favicon.ico paths
export const config = {
	matcher: ["/((?!oidc|configuration.json|signed-out|_next|favicon.ico).*)"],
};
