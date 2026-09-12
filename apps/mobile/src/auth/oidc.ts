import {
  DiscoveryDocument,
  makeRedirectUri,
  refreshAsync,
  revokeAsync,
  TokenResponse,
} from "expo-auth-session";
import { SessionStore } from "./session";
import { APP_SCHEME } from "@/configuration/app";
import axios from "axios";
import { openAuthSessionAsync } from "expo-web-browser";

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

  constructor(options: IOIDCCLientOptions, sessionStore: SessionStore) {
    this.options = Object.freeze(options);
    this.sessionStore = sessionStore;
    this.redirectUri = makeRedirectUri({
      scheme: APP_SCHEME,
      path: "callbacks/oidc",
    });
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

  public async fetchUser(
    discovery: DiscoveryDocument,
  ): Promise<IOIDCUserInfo | null> {
    const response = await axios
      .get(discovery.userInfoEndpoint!, {
        headers: {
          Authorization: `Bearer ${await this.getToken(discovery)}`,
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

  public async getToken(discovery: DiscoveryDocument): Promise<string | null> {
    const session = await this.sessionStore.getSession();
    if (!session) return null;

    // Check if the access token is still valid
    if (Date.now() < Number(session.expiresAt)) return session.accessToken;

    // Refresh the access token using the refresh token
    if (!session.refreshToken) return null;

    const fresh = await refreshAsync(
      {
        clientId: this.options.clientId,
        refreshToken: session.refreshToken,
      },
      discovery,
    ).catch(() => null);
    if (!fresh) return null;

    await this.saveTokens(fresh);

    return fresh.accessToken;
  }

  public async logout(discovery: DiscoveryDocument) {
    const session = await this.sessionStore.getSession();
    if (!session) return;

    await revokeAsync(
      {
        clientId: this.options.clientId,
        token: session.refreshToken,
      },
      discovery,
    ).catch(() => null);

    await this.sessionStore.clearSession();

    await openAuthSessionAsync(
      `${discovery.endSessionEndpoint}?id_token_hint=${session.idToken}&post_logout_redirect_uri=${encodeURIComponent(this.redirectUri)}`,
      this.redirectUri,
    );
  }
}
