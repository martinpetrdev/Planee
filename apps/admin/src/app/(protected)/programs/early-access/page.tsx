"use client";

import { Button } from "@repo/web-ui/components/ui/button";
import { createEapInvite } from "@/api/modules/admin/programs";
import { useConfig } from "@/providers/ConfigProvider";

export default function Page() {
	const config = useConfig();

	if (config.isLoading) return;

	return (
		<div className={"p-16 flex flex-col gap-8"}>
			<h1 className="text-2xl">Early access program</h1>
			<form className={"flex flex-col gap-1"}>
				<h2 className={"text-xl"}>Invite user</h2>
				<Button
					onClick={() =>
						createEapInvite().then(async (invite) => {
							await navigator.clipboard.writeText(
								`${config.config?.app.baseUrl}/early-access/join?code=${invite.id}`,
							);

							alert("Link has been copied.");
						})
					}
				>
					Get invite link
				</Button>
			</form>
		</div>
	);
}
