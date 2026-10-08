import { base64url, EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

export interface Session {
	accessToken: string;
	refreshToken: string;
	idToken: string;
	expiresAt: number; // ms format
	userInfo: {
		name: string;
		email: string;
	};
}

function decodeKey(encKey: string) {
	return base64url.decode(encKey);
}

function seal(session: Record<string, string | number>, encKey: string) {
	return new EncryptJWT({ ...session })
		.setProtectedHeader({
			alg: "dir",
			enc: "A256GCM",
		})
		.setIssuedAt()
		.setExpirationTime("30d")
		.encrypt(decodeKey(encKey));
}

async function unseal(val: string | undefined, encKey: string) {
	if (!val) return null;

	try {
		const { payload } = await jwtDecrypt(val, decodeKey(encKey));
		return payload as unknown as Record<string, string | number>;
	} catch {
		return null;
	}
}

export class SessionStore {
	constructor(
		private readonly cookiePrefix: string,
		private readonly cookieEncKey: string,
		private readonly cookieSecure: boolean,
	) {}

	async set(session: Session) {
		const nextCookies = await cookies();
		nextCookies.set(
			`oidc.${this.cookiePrefix}_session`,
			await seal(
				{
					accessToken: session.accessToken,
					refreshToken: session.refreshToken,
					expiresAt: session.expiresAt,
				},
				this.cookieEncKey,
			),
			{
				httpOnly: true,
				secure: this.cookieSecure,
				sameSite: "lax",
				path: "/",
				maxAge: 30 * 24 * 3600,
			},
		);

		// Separate to fit in the max cookie size
		nextCookies.set(
			`oidc.${this.cookiePrefix}_profile`,
			await seal(session.userInfo, this.cookieEncKey),
			{
				httpOnly: true,
				secure: this.cookieSecure,
				sameSite: "lax",
				path: "/",
				maxAge: 30 * 24 * 3600,
			},
		);

		nextCookies.set(
			`oidc.${this.cookiePrefix}_idtoken`,
			await seal(
				{
					idToken: session.idToken,
				},
				this.cookieEncKey,
			),
			{
				httpOnly: true,
				secure: this.cookieSecure,
				sameSite: "lax",
				path: "/",
				maxAge: 30 * 24 * 3600,
			},
		);

		// Delete code verifier cookie
		nextCookies.delete("codeVerifier");
	}

	async get(): Promise<Session | null> {
		const nextCookies = await cookies();

		const sessionCookie = nextCookies.get(
			`oidc.${this.cookiePrefix}_session`,
		)?.value;
		const profileCookie = nextCookies.get(
			`oidc.${this.cookiePrefix}_profile`,
		)?.value;
		const idTokenCookie = nextCookies.get(
			`oidc.${this.cookiePrefix}_idtoken`,
		)?.value;
		if (!sessionCookie || !profileCookie || !idTokenCookie) return null;

		const session = await unseal(sessionCookie, this.cookieEncKey);
		const profile = await unseal(profileCookie, this.cookieEncKey);
		const idToken = await unseal(idTokenCookie, this.cookieEncKey);

		return {
			...(session as Omit<Omit<Session, "userInfo">, "idToken">),
			idToken: idToken?.idToken as string,
			userInfo: {
				name: (profile?.name as string) ?? "",
				email: (profile?.email as string) ?? "",
			},
		};
	}

	async clear() {
		const nextCookies = await cookies();

		nextCookies.delete(`oidc.${this.cookiePrefix}_session`);
		nextCookies.delete(`oidc.${this.cookiePrefix}_profile`);
		nextCookies.delete(`oidc.${this.cookiePrefix}_idtoken`);
	}
}
