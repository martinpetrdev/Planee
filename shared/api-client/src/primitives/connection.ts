import axios from "axios";
import type { TokenProvider } from "../types/Authorization.ts";

export function getApiConnection(
	baseUrl: string,
	provideAccessToken: TokenProvider,
) {
	const connection = axios.create({
		baseURL: baseUrl,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"X-Planee-ClientLib": "@repo-shared/api-client",
		},
	});

	connection.interceptors.request.use(async (req) => {
		const token = await provideAccessToken();
		if (token) req.headers.Authorization = buildAuthorizationHeader(token);

		return req;
	});

	return connection;
}

function buildAuthorizationHeader(token: string) {
	return `Bearer ${token}`;
}
