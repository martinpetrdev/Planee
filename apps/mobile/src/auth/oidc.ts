import {
  DiscoveryDocument,
  fetchDiscoveryAsync,
  makeRedirectUri,
  refreshAsync,
  revokeAsync,
  TokenResponse,
} from "expo-auth-session";
import { SessionStore } from "./session";
import { APP_SCHEME } from "@/configuration/app";
import axios from "axios";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  OIDC_CLIENT_ID,
  OIDC_GRACE_PERIOD,
  OIDC_ISSUER,
  OIDC_SCOPES,
  SESSION_STORE_KEY,
} from "@/configuration/auth";

interface IOIDCCLientOptions {
  issuer: string;
  clientId: string;
  scopes: string[];
  gracePeriod: number;
}

export interface IOIDCUserInfo {
  id: string;
  email: string | null;
  name: string | null;
}

export class OIDCClient {
  private readonly options: IOIDCCLientOptions;
  private readonly sessionStore: SessionStore;
  private readonly redirectUri: string;
  private discovery: DiscoveryDocument | null = null;

  private refreshPromise: Promise<string | null> | null = null;

  constructor(options: IOIDCCLientOptions, sessionStore: SessionStore) {
    this.options = Object.freeze(options);
    this.sessionStore = sessionStore;
    this.redirectUri = makeRedirectUri({
      scheme: APP_SCHEME,
      path: "callbacks/oidc",
    });
  }

  private async getDiscovery() {
    if (!this.discovery)
      this.discovery = await fetchDiscoveryAsync(this.options.issuer);

    return this.discovery;
  }

  public get requestConfig() {
    return {
      clientId: this.options.clientId,
      scopes: this.options.scopes,
      redirectUri: this.redirectUri,
      usePKCE: true,
    };
  }

  public getExchangeConfig(code: string, verifier: string) {
    return {
      clientId: this.options.clientId,
      code: code,
      redirectUri: this.redirectUri,
      extraParams: {
        code_verifier: verifier,
      },
    };
  }

  public async fetchUser(): Promise<IOIDCUserInfo | null> {
    const response = await axios
      .get((await this.getDiscovery()).userInfoEndpoint!, {
        headers: {
          Authorization: `Bearer ${await this.getToken()}`,
        },
      })
      .catch(() => null);
    if (!response || !response.data) return null;

    return {
      id: response.data.sub,
      email: response.data.email || null,
      name: response.data.name || null,
    };
  }

  public async saveTokens(tokens: TokenResponse) {
    await this.sessionStore.saveSession({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken!,
      idToken: tokens.idToken!,
      expiresAt: String(
        Date.now() + tokens.expiresIn! * 1000 - this.options.gracePeriod,
      ),
    });
  }

  public async getToken(): Promise<string | null> {
    const session = await this.sessionStore.getSession();
    if (!session) return null;

    // Check if the access token is still valid
    if (Date.now() < Number(session.expiresAt)) return session.accessToken;

    // Refresh the access token using the refresh token
    if (!session.refreshToken) return null;

    // If a refresh is already in progress, await the existing promise
    if (this.refreshPromise) return await this.refreshPromise;

    // Refresh the access token using the refresh token and save the promise
    this.refreshPromise = new Promise(async (resolve) => {
      const fresh = await refreshAsync(
        {
          clientId: this.options.clientId,
          refreshToken: session.refreshToken,
        },
        await this.getDiscovery(),
      ).catch(() => null);
      if (!fresh) return null;

      await this.saveTokens(fresh);

      resolve(fresh.accessToken);
      this.refreshPromise = null; // Reset the refresh promise after completion
    });

    return await this.refreshPromise;
  }

  public async logout() {
    const session = await this.sessionStore.getSession();
    if (!session) return;

    await revokeAsync(
      {
        clientId: this.options.clientId,
        token: session.refreshToken,
      },
      await this.getDiscovery(),
    ).catch(() => null);

    await this.sessionStore.clearSession();

    await openAuthSessionAsync(
      `${(await this.getDiscovery()).endSessionEndpoint}?id_token_hint=${session.idToken}&post_logout_redirect_uri=${encodeURIComponent(this.redirectUri)}`,
      this.redirectUri,
    );
  }
}

export const oidcClient = new OIDCClient(
  {
    issuer: OIDC_ISSUER,
    clientId: OIDC_CLIENT_ID,
    scopes: OIDC_SCOPES,
    gracePeriod: OIDC_GRACE_PERIOD,
  },
  new SessionStore(SESSION_STORE_KEY),
);
