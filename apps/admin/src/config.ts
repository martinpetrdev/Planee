// TODO: Should probably throw instead of the default value

import axios from "axios";
import type { ConfigurationJson } from "@/types/config";

export const WebConfig = {
	baseUrl: process.env.CONF_ADMIN_BASE || "",
	api: {
		baseUrl: process.env.CONF_WEB_API_BASE || "",
	},
	oidc: {
		issuer: process.env.CONF_WEB_OIDC_ISSUER || "",
		clientId: process.env.CONF_WEB_OIDC_CLIENT_ID || "",
		clientSecret: process.env.CONF_WEB_OIDC_CLIENT_SECRET || "",
		scopes: ["openid", "profile", "email", "offline_access"],
		gracePeriod: 30_000, // 30secs
	},
};

export async function fetchWebConfig(): Promise<ConfigurationJson> {
	const { data } = await axios.get("/configuration.json");

	return data;
}
