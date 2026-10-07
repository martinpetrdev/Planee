import { OIDC } from "@repo/web-oidc";
import { NextResponse } from "next/server";
import { oidcProvider } from "@/auth";

export async function GET() {
	new OIDC(oidcProvider);

	return NextResponse.json({
		token: await OIDC.instance.getAccessToken(),
	});
}
