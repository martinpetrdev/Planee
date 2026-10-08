import { NextResponse } from "next/server";
import { WebConfig } from "@/config";
import type { ConfigurationJson } from "@/types/config";

export async function GET(): Promise<NextResponse<ConfigurationJson>> {
	// CRITICAL: Ensure no secrets are exposed here. This endpoint is public and can be accessed by anyone.
	return NextResponse.json({
		baseUrl: WebConfig.baseUrl,
		api: WebConfig.api,
		app: WebConfig.app,
		oidc: {
			issuer: WebConfig.oidc.issuer,
			clientId: WebConfig.oidc.clientId,
		},
	});
}
