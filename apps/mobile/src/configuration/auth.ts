export const OIDC_ISSUER =
  "https://kc.cloud.martinpetr.dev/realms/dev.martinpetr.planee";
export const OIDC_CLIENT_ID = "mobile-app";
export const OIDC_SCOPES = ["openid", "profile", "email", "offline_access"];
export const OIDC_GRACE_PERIOD = 30_000; // 30 seconds grace period for token refresh

export const SESSION_STORE_KEY = "private.session";
