"use client";

import { useAuthentication } from "@repo/web-oidc/client";
import { Button } from "@repo/web-ui/components/ui/button";

// TODO: Remove/secure later
export default function Page() {
	const auth = useAuthentication();

	return (
		<div className="w-full flex p-8">
			<div className="flex flex-col gap-4 h-min p-8 bg-secondary rounded-md">
				<code className="wrap-anywhere">{auth.accessToken}</code>
				<Button onClick={() => navigator.clipboard.writeText(auth.accessToken)}>
					Copy
				</Button>
			</div>
		</div>
	);
}
