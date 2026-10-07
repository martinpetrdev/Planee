import axios from "axios";
import { getSession } from "next-auth/react";
import { oidcAuth } from "@/auth";
import { fetchWebConfig, WebConfig } from "@/config";

export const apiConnector = axios.create({
	baseURL: WebConfig.api.baseUrl,
});

async function getAccessToken() {
	// CSR
	if (typeof window !== "undefined") {
		return (await getSession())?.accessToken;
	}

	// SSR
	return (await oidcAuth.getSession())?.accessToken;
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
