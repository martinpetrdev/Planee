import axios from "axios";
import NextAuth, {
	getServerSession,
	type NextAuthOptions,
	type Session,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";
import { WebConfig } from "@/config";

const { issuer, clientId, clientSecret, scopes, gracePeriod } = WebConfig.oidc;
const stringifiedScopes = scopes.join(" "); // Provider requires space separated ._.

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

async function refreshOidcToken(token: JWT) {
	const url = `${issuer}/protocol/openid-connect/token`;

	const { data } = await axios
		.post(
			url,
			new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
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

export const authOptions: NextAuthOptions = {
	pages: { signIn: "/sign-in" },
	providers: [
		Keycloak({
			clientId,
			clientSecret,
			issuer,
			authorization: {
				params: { scope: stringifiedScopes },
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
				Date.now() < ((data.token.expiresAt as number) ?? 300) - gracePeriod
			)
				return data.token;

			// If token has expired or is about to, refresh it
			if (data.token.refreshToken) return refreshOidcToken(data.token);

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

export const authHandler = NextAuth(authOptions);

export function getSession() {
	return getServerSession(authOptions);
}

/**
 * Creates an URL that destroys keycloak session
 * @param session
 */
export function getLogoutUrl(session: Session) {
	return (
		`${issuer}/protocol/openid-connect/logout` +
		`?client_id=${encodeURIComponent(clientId)}` +
		`&post_logout_redirect_uri=${encodeURIComponent(WebConfig.baseUrl)}/oidc/signed-out` +
		`&id_token_hint=${encodeURIComponent(session.idToken)}`
	);
}
