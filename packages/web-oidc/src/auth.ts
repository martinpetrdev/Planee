import axios from "axios";
import NextAuth, {
	getServerSession,
	type NextAuthOptions,
	type Session,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";
import { signOut } from "next-auth/react";

declare module "next-auth" {
	interface Session {
		accessToken: string;
		idToken: string;
		error: unknown;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		idToken: string;
		refreshToken: string;
		expiresAt: number;
	}
}

export class OidcAuth {
	private readonly clientId: string;
	private readonly clientSecret: string;
	private readonly issuer: string;
	private readonly stringifiedScopes: string;
	private readonly gracePeriod: number;
	private readonly baseUrl: string;

	constructor(
		clientId: string,
		clientSecret: string,
		issuer: string,
		scopes: string[],
		gracePeriod: number,
		baseUrl: string,
	) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.issuer = issuer;
		this.gracePeriod = gracePeriod;
		this.stringifiedScopes = scopes.join(" "); // Provider requires space separated ._.
		this.baseUrl = baseUrl;
	}

	public async refreshOidcToken(token: JWT) {
		const url = `${this.issuer}/protocol/openid-connect/token`;

		const { data } = await axios
			.post(
				url,
				new URLSearchParams({
					client_id: this.clientId,
					client_secret: this.clientSecret,
					grant_type: "refresh_token",
					refresh_token: token.refreshToken,
				}),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			)
			.catch((e) => {
				console.error("OIDC AT refresh error:", e);

				return { data: {} };
			});

		return {
			...token,
			accessToken: data.access_token,
			idToken: data.id_token ?? token.idToken,
			expiresAt: Date.now() + (data.expires_in ?? 300) * 1000, // expires_in is in seconds, convert to milliseconds
			refreshToken: data.refresh_token,
		};
	}

	public get authOptions(): NextAuthOptions {
		return {
			pages: { signIn: "/sign-in" },
			providers: [
				Keycloak({
					clientId: this.clientId,
					clientSecret: this.clientSecret,
					issuer: this.issuer,
					authorization: {
						params: { scope: this.stringifiedScopes },
					},
				}),
			],
			callbacks: {
				jwt: async (data) => {
					// Save the account data into JWT
					if (data.account) {
						data.token.accessToken = data.account.access_token ?? "";
						data.token.idToken = data.account.id_token ?? "";
						data.token.refreshToken = data.account.refresh_token ?? "";
						data.token.expiresAt = data.account.expires_at
							? data.account.expires_at * 1000
							: ((data.account.expires_in as number) ?? 300) * 1000;
					}

					// If the token is not expired (with grace period), return it
					if (
						data.token.expiresAt &&
						Date.now() <
							((data.token.expiresAt as number) ?? 300) - this.gracePeriod
					)
						return data.token;

					// If token has expired or is about to, refresh it
					if (data.token.refreshToken) return this.refreshOidcToken(data.token);

					return data.token;
				},
				session: async (data) => {
					// Save the tokens into session
					data.session.accessToken = data.token.accessToken;
					data.session.idToken = data.token.idToken;
					data.session.error = data.token.error;

					return data.session;
				},
			},
		};
	}

	public get authHandler() {
		return NextAuth(this.authOptions);
	}

	public getSession() {
		return getServerSession(this.authOptions);
	}

	/**
	 * Creates an URL that destroys keycloak session
	 * @param session
	 */
	public getLogoutUrl(
		session: Session,
		oidcIssuer?: string,
		oidcClientId?: string,
		baseUrl?: string,
	) {
		return (
			`${oidcIssuer ?? this.issuer}/protocol/openid-connect/logout` +
			`?client_id=${encodeURIComponent(oidcClientId ?? this.clientId)}` +
			`&post_logout_redirect_uri=${encodeURIComponent(baseUrl ?? this.baseUrl)}/oidc/signed-out` +
			`&id_token_hint=${encodeURIComponent(session.idToken)}`
		);
	}

	public async logout(
		session: Session,
		oidcIssuer: string,
		oidcClientId: string,
		baseUrl: string,
	) {
		await signOut();

		location.href = this.getLogoutUrl(
			session,
			oidcIssuer,
			oidcClientId,
			baseUrl,
		);
	}
}
