/**
 * Proxy for guarding pages against unauthorized access. Uses
 * nest-auth middleware to redirect to sign in
 */

import { withAuth } from "next-auth/middleware";

export default withAuth({
	pages: { signIn: "/oidc/signin", error: "/oidc/error" },
});

// Everything, except for: oidc, configuration.json, signed-out, _next, favicon.ico paths
export const config = {
	matcher: ["/((?!oidc|configuration.json|signed-out|_next|favicon.ico).*)"],
};
