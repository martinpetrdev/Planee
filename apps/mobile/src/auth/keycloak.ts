import { APP_SCHEME } from "@/config/app";
import { KEYCLOAK_CLIENT_ID } from "@/config/auth";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export class KeycloakAuth {
  private static readonly SECURE_STORE_ACCESS_TOKEN_KEY =
    "keycloak_access_token";
  private static readonly SECURE_STORE_REFRESH_TOKEN_KEY =
    "keycloak_refresh_token";
  private static readonly SECURE_STORE_EXPIRY_KEY = "keycloak_expires_at";

  /** Keycloak only allows `schema://*`, so the path segment is required. */
  private static readonly REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: APP_SCHEME,
    path: "/",
  });

  /**
   * Returns useAuthRequest configuration for Keycloak
   */
  public static getRequestConfig() {
    return {
      clientId: KEYCLOAK_CLIENT_ID,
      redirectUri: this.REDIRECT_URI,
      scopes: ["openid", "profile", "email", "offline_access"],
      usePKCE: true, // Force PKCE (Required by our Keycloak realm)
    };
  }

  /**
   * Finishes auth session flow
   */
  public static async finishAuthSessionFlow(
    request,
    response,
    discovery: AuthSession.DiscoveryDocument,
  ) {
    const session = await AuthSession.exchangeCodeAsync(
      {
        clientId: KEYCLOAK_CLIENT_ID,
        code: response.params.code,
        redirectUri: this.REDIRECT_URI,
        extraParams: {
          code_verifier: request.codeVerifier!,
        },
      },
      discovery,
    );

    await this.saveSession(session);
  }

  /**
   * Saves the auth session tokens into secure store (encrypted).
   */
  public static async saveSession(tokens: AuthSession.TokenResponse) {
    await SecureStore.setItemAsync(
      this.SECURE_STORE_ACCESS_TOKEN_KEY,
      tokens.accessToken,
    );

    if (tokens.refreshToken)
      await SecureStore.setItemAsync(
        this.SECURE_STORE_REFRESH_TOKEN_KEY,
        tokens.refreshToken,
      );

    await SecureStore.setItemAsync(
      this.SECURE_STORE_EXPIRY_KEY,
      String(Date.now() + (tokens.expiresIn ?? 300) * 1000),
    );
  }

  /**
   * Returns the session info from secure store
   */
  public static async getSession(): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt: string;
  } | null> {
    const accessToken = await SecureStore.getItemAsync(
      this.SECURE_STORE_ACCESS_TOKEN_KEY,
    );
    const refreshToken = await SecureStore.getItemAsync(
      this.SECURE_STORE_REFRESH_TOKEN_KEY,
    );
    const expiresAt = await SecureStore.getItemAsync(
      this.SECURE_STORE_EXPIRY_KEY,
    );

    if (!accessToken || !expiresAt) return null; // Invalid session

    return {
      accessToken,
      refreshToken: refreshToken ?? undefined,
      expiresAt,
    };
  }

  /**
   * Clears the session info from secure store
   */
  public static async clearSession() {
    await SecureStore.deleteItemAsync(this.SECURE_STORE_ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(this.SECURE_STORE_REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(this.SECURE_STORE_EXPIRY_KEY);
  }
}
