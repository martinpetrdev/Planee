import { oidcAuth } from "@/auth";

export const proxy = oidcAuth.proxy;

// Everything, except for: oidc, configuration.json, signed-out, _next, favicon.ico paths
export const config = {
  matcher: ["/((?!oidc|configuration.json|signed-out|_next|favicon.ico).*)"],
};
