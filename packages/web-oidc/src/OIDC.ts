import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	authorizationCodeGrant,
	buildAuthorizationUrl,
	type Configuration,
	calculatePKCECodeChallenge,
	discovery,
	randomPKCECodeVerifier,
	refreshTokenGrant,
	tokenRevocation,
} from "openid-client";
import type { OIDCProvider } from "./OIDCProvider";
import { SessionStore } from "./Session";

// TODO: Add logout
// TODO: Add callback url state
// TODO: Fix race condition - multi-refresh token use
export class OIDC {
	private static _instance: OIDC;
	public static get instance() {
		return OIDC._instance;
	}

	private _oidcDiscovery: Configuration | null = null;
	private readonly sessionStore: SessionStore;

	constructor(private readonly _provider: OIDCProvider) {
		OIDC._instance = this;

		this.sessionStore = new SessionStore(
			this._provider.cookiePrefix,
			this._provider.cookieEncryptionKey,
			this._provider.cookieSecure,
		);
	}

	async getDiscovery(): Promise<Configuration> {
		if (!this._oidcDiscovery)
			this._oidcDiscovery = await discovery(
				this._provider.issuerURL,
				this._provider.clientId,
				this._provider.clientSecret,
			);

		return this._oidcDiscovery;
	}

	async getSessionStateSSR(): Promise<{ authenticated: boolean }> {
		const session = await this.sessionStore.get();

		return {
			authenticated: session !== null,
		};
	}

	async authenticate() {
		const url = this._provider.baseURL;
		url.pathname = "/auth/signin";

		redirect(url.href);
	}

	async handleAuthenticate() {
		const discovery = await this.getDiscovery();

		const codeVerifier = randomPKCECodeVerifier();
		const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

		if (!discovery.serverMetadata().supportsPKCE())
			throw new Error("[OIDC] PKCE is required!");

		const redirectUrl = this._provider.baseURL;
		redirectUrl.pathname = "/auth/exchange";

		const authUrl = buildAuthorizationUrl(discovery, {
			redirect_uri: redirectUrl.href,
			scope: this._provider.scope,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		});

		const nextCookies = await cookies();
		nextCookies.set("codeVerifier", codeVerifier);

		redirect(authUrl.href);
	}

	async handleExchange(url: URL) {
		const nextCookies = await cookies();
		const discovery = await this.getDiscovery();

		const codeVerifier = nextCookies.get("codeVerifier");
		if (!codeVerifier)
			throw new Error("[OIDC] Code verifier cookie not found!");

		const tokens = await authorizationCodeGrant(discovery, url, {
			pkceCodeVerifier: codeVerifier.value,
		});

		const claims = tokens.claims();

		await this.sessionStore.set({
			accessToken: tokens.access_token ?? "",
			refreshToken: tokens.refresh_token ?? "",
			idToken: tokens.id_token ?? "",
			expiresAt: Date.now() + (tokens.expires_in ?? 300) * 1000,
			userInfo: {
				name: (claims?.name as string) ?? "",
				email: (claims?.email as string) ?? "",
			},
		});

		redirect(this._provider.baseURL.href);
	}

	async refreshAccessToken() {
		const session = await this.sessionStore.get();
		if (!session) throw new Error("[OIDC] Session cookie not found!");

		const discovery = await this.getDiscovery();

		const tokens = await refreshTokenGrant(discovery, session.refreshToken, {
			scope: this._provider.scope,
		}).catch(async () => {
			// Used/expired -> authenticate again
			await this.authenticate();

			return null;
		});
		if (!tokens) return null;

		const claims = tokens.claims();

		await this.sessionStore.set({
			accessToken: tokens.access_token ?? "",
			refreshToken: tokens.refresh_token ?? "",
			idToken: tokens.id_token ?? "",
			expiresAt: Date.now() + (tokens.expires_in ?? 300) * 1000,
			userInfo: {
				name: (claims?.name as string) ?? "",
				email: (claims?.email as string) ?? "",
			},
		});

		return tokens.access_token ?? "";
	}

	async getProfile() {
		const session = await this.sessionStore.get();

		return session
			? {
					...session.userInfo,
					expiresAt: session.expiresAt,
				}
			: null;
	}

	async getAccessToken() {
		const session = await this.sessionStore.get();
		if (!session) return null;

		const isExpired =
			session.expiresAt - this._provider.gracePeriod <= Date.now();
		if (!isExpired) return session.accessToken;

		// Refresh token if expired
		return await this.refreshAccessToken();
	}

	async logout() {
		const discovery = await this.getDiscovery();
		const session = await this.sessionStore.get();

		await tokenRevocation(discovery, session?.refreshToken ?? "");
		await this.sessionStore.clear();

		const url = this._provider.issuerURL;
		const baseURL = this._provider.baseURL;
		baseURL.pathname = "/auth/signed-out";

		redirect(
			`${url.href}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(baseURL.href)}&clientId=${this._provider.clientId}&id_token_hint=${encodeURIComponent(session?.idToken ?? "")}`,
		);
	}
}
