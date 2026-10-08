import axios from "axios";
import { oidcProvider } from "@/auth";
import { fetchWebConfig, WebConfig } from "@/config";

export const apiConnector = axios.create({
	baseURL: WebConfig.api.baseUrl,
});

async function getAccessToken() {
	// CSR
	if (typeof window !== "undefined") {
		const { data } = await axios.get("/auth/token");
		return data?.token;
	}

	// SSR
	const { OIDC } = await import("@repo/web-oidc");

	new OIDC(oidcProvider);
	return await OIDC.instance.getAccessToken();
}

apiConnector.interceptors.request.use(async (req) => {
	if (!req.baseURL || !req.baseURL.startsWith("http")) {
		const config = await fetchWebConfig();

		req.baseURL = config.api.baseUrl;
	}

	const token = await getAccessToken();
	if (token) req.headers.Authorization = `Bearer ${token}`;

	return req;
});
