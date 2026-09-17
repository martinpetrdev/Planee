import { ApiVersion } from "@repo/shared";
import { api } from "../api";

const BASE_PATH = "/notifications/push-tokens";

export const registerPushToken = (token: string) =>
  api.put<void, { token: string }>(ApiVersion.v1, BASE_PATH, { token });
export const unregisterPushToken = (token: string) =>
  api.delete<void, { token: string }>(ApiVersion.v1, BASE_PATH, { token });
