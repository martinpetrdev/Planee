import { OIDC } from "@repo/web-oidc";
import { oidcProvider } from "@/auth";

export async function GET() {
	new OIDC(oidcProvider);

	await OIDC.instance.logout();
}
