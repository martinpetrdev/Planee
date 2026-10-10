import { OIDC } from "@repo/web-oidc";
import { type NextRequest, NextResponse } from "next/server";
import { oidcProvider } from "@/auth";

export async function GET(req: NextRequest) {
	new OIDC(oidcProvider);

	const url = new URL(req.url);
	await OIDC.instance.handleExchange(url);
}
