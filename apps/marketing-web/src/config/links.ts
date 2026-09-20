export const PLANEE_MARKETING_ROOT =
  process.env.NODE_ENV === "production"
    ? "https://planee.martinpetr.dev"
    : "http://locakhost:4002";
export const PLANEE_APP_ROOT =
  process.env.NODE_ENV === "production"
    ? "https://app.planee.martinpetr.dev"
    : "http://localhost:4000";
