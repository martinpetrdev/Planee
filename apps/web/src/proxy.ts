import {
	OIDC,
	sealSessionCookies,
	sessionCookieNames,
	unsealSessionCookies,
} from "@repo/web-oidc";
import { type NextRequest, NextResponse } from "next/server";
import { oidcProvider } from "@/auth";

// Refresh session before render, refreshing tokens if needed
const oidc = new OIDC(oidcProvider);
const names = sessionCookieNames(oidcProvider.cookiePrefix);

export async function proxy(request: NextRequest) {
	const session = await unsealSessionCookies(
		{
			session: request.cookies.get(names.session)?.value,
			profile: request.cookies.get(names.profile)?.value,
			idToken: request.cookies.get(names.idToken)?.value,
		},
		oidcProvider.cookieEncryptionKey,
	);
	if (!session) return NextResponse.next();

	const isExpired = session.expiresAt - oidcProvider.gracePeriod <= Date.now();
	if (!isExpired) return NextResponse.next();

	const refreshed = await oidc.refreshSession(session);

	if (!refreshed) {
		// Refresh token used/expired - drop the dead session
		// Written by AI (Kimi K3)
		for (const name of Object.values(names)) request.cookies.delete(name);

		const response = NextResponse.next({
			request: { headers: request.headers },
		});

		for (const name of Object.values(names)) response.cookies.delete(name);

		return response;
	}

	const sealed = await sealSessionCookies(
		oidcProvider.cookiePrefix,
		refreshed,
		oidcProvider.cookieEncryptionKey,
		oidcProvider.cookieSecure,
	);

	// Forward the cookies to client
	// Written by AI (Kimi K3)
	for (const cookie of sealed) request.cookies.set(cookie.name, cookie.value);

	const response = NextResponse.next({
		request: { headers: request.headers },
	});

	for (const cookie of sealed)
		response.cookies.set(cookie.name, cookie.value, cookie.options);

	return response;
}

export const config = {
	matcher: ["/((?!auth|_next/static|_next/image|favicon.ico).*)"],
};
