// TODO: Should probably throw instead of the default value
import axios from "axios";
import type { ConfigurationJson } from "@/types/config";

export const WebConfig = {
	baseUrl: process.env.CONF_WEB_BASE || "http://planee.internal",
	api: {
		baseUrl: process.env.CONF_WEB_API_BASE || "http://planee.internal",
	},
	marketingWeb: {
		baseUrl: process.env.CONF_WEB_MARKETING_BASE || "http://planee.internal",
	},
	oidc: {
		issuer: process.env.CONF_WEB_OIDC_ISSUER || "http://planee.internal",
		clientId: process.env.CONF_WEB_OIDC_CLIENT_ID || "",
		clientSecret: process.env.CONF_WEB_OIDC_CLIENT_SECRET || "",
		scopes: ["openid", "profile", "email", "offline_access"],
		gracePeriod: 30_000, // 30secs
		cookiePrefix: process.env.CONF_WEB_OIDC_COOKIE_PREFIX || "",
		cookieEncryptionKey: process.env.CONF_WEB_OIDC_COOKIE_ENCRYPTION_KEY || "",
	},
};

export async function fetchWebConfig(): Promise<ConfigurationJson> {
	const { data } = await axios.get("/configuration.json");

	return data;
}
