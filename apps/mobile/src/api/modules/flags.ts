import { ApiVersion } from "@repo/shared";
import { api } from "../api";

const BASE_PATH = "/flags";

export const getFeatureFlags = () =>
  api.get<Record<string, boolean>>(ApiVersion.v1, BASE_PATH);
