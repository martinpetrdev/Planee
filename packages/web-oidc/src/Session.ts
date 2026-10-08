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

export function sessionCookieNames(cookiePrefix: string) {
	return {
		session: `oidc.${cookiePrefix}_session`,
		profile: `oidc.${cookiePrefix}_profile`,
		idToken: `oidc.${cookiePrefix}_idtoken`,
	} as const;
}

export interface SealedSessionCookie {
	name: string;
	value: string;
	options: {
		path: string;
		httpOnly: boolean;
		secure: boolean;
		maxAge: number;
		sameSite: "lax";
	};
}

export async function sealSessionCookies(
	cookiePrefix: string,
	session: Session,
	encKey: string,
	secure: boolean,
): Promise<SealedSessionCookie[]> {
	const cookieNames = sessionCookieNames(cookiePrefix);
	const options = {
		path: "/",
		httpOnly: true,
		secure,
		maxAge: 30 * 24 * 3600,
		sameSite: "lax" as const,
	};

	return [
		{
			name: cookieNames.session,
			value: await seal(
				{
					accessToken: session.accessToken,
					refreshToken: session.refreshToken,
					expiresAt: session.expiresAt,
				},
				encKey,
			),
			options,
		},
		// Separate to fit in the max cookie size
		{
			name: cookieNames.profile,
			value: await seal(session.userInfo, encKey),
			options,
		},
		{
			name: cookieNames.idToken,
			value: await seal({ idToken: session.idToken }, encKey),
			options,
		},
	];
}

export async function unsealSessionCookies(
	values: {
		session?: string;
		profile?: string;
		idToken?: string;
	},
	encKey: string,
): Promise<Session | null> {
	if (!values.session || !values.profile || !values.idToken) return null;

	const session = await unseal(values.session, encKey);
	const profile = await unseal(values.profile, encKey);
	const idToken = await unseal(values.idToken, encKey);
	if (!session) return null;

	return {
		...(session as Omit<Omit<Session, "userInfo">, "idToken">),
		idToken: idToken?.idToken as string,
		userInfo: {
			name: (profile?.name as string) ?? "",
			email: (profile?.email as string) ?? "",
		},
	};
}

export class SessionStore {
	constructor(
		private readonly cookiePrefix: string,
		private readonly cookieEncKey: string,
		private readonly cookieSecure: boolean,
	) {}

	async set(session: Session) {
		const nextCookies = await cookies();
		const sealed = await sealSessionCookies(
			this.cookiePrefix,
			session,
			this.cookieEncKey,
			this.cookieSecure,
		);

		for (const cookie of sealed)
			nextCookies.set(cookie.name, cookie.value, cookie.options);

		// Delete code verifier cookie
		nextCookies.delete("codeVerifier");
	}

	async get(): Promise<Session | null> {
		const nextCookies = await cookies();
		const names = sessionCookieNames(this.cookiePrefix);

		return await unsealSessionCookies(
			{
				session: nextCookies.get(names.session)?.value,
				profile: nextCookies.get(names.profile)?.value,
				idToken: nextCookies.get(names.idToken)?.value,
			},
			this.cookieEncKey,
		);
	}

	async clear() {
		const nextCookies = await cookies();
		const names = sessionCookieNames(this.cookiePrefix);

		nextCookies.delete(names.session);
		nextCookies.delete(names.profile);
		nextCookies.delete(names.idToken);
	}
}
