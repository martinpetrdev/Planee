/**
 * Proxy for guarding pages against unauthorized access. Uses
 * nest-auth middleware to redirect to sign in
 */

import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
	pages: { signIn: "/oidc/signin", error: "/oidc/error" },
});
