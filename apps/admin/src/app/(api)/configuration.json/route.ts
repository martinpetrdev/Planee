import { NextResponse } from "next/server";
import { WebConfig } from "@/config";

export async function GET() {
	// CRITICAL: Ensure no secrets are exposed here. This endpoint is public and can be accessed by anyone.
	return NextResponse.json({
		baseUrl: WebConfig.baseUrl,
		api: WebConfig.api,
		marketingWeb: WebConfig.marketingWeb,
	});
}
