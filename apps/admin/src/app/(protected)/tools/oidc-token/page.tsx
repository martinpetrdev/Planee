"use client";

import { useAuthentication } from "@repo/web-oidc/client";
import { Button } from "@repo/web-ui/components/ui/button";

// TODO: Remove/secure later
export default function Page() {
	const auth = useAuthentication();

	return (
		<div className="w-full flex p-8">
			<div className="flex flex-col gap-8 max-w-240 h-min p-8 bg-secondary rounded-md">
				<p className="wrap-anywhere">{auth.accessToken}</p>
				<Button onClick={() => navigator.clipboard.writeText(auth.accessToken)}>
					Copy
				</Button>
			</div>
		</div>
	);
}
