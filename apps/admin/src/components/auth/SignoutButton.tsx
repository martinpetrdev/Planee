"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { Button } from "@repo/web-ui/components/ui/button";
import type { Session } from "next-auth";
import { oidcAuth } from "@/auth";
import { useConfig } from "@/providers/ConfigProvider";

interface ISignoutButtonProps {
	session: Session;
}

export function SignoutButton(props: ISignoutButtonProps) {
	const { config, isLoading } = useConfig();

	if (isLoading) return <></>;

	return (
		<Button
			size="icon-lg"
			variant="secondary"
			onClick={() => {
				oidcAuth.logout(
					props.session,
					config.oidc.issuer,
					config.oidc.clientId,
					config.baseUrl,
				);
			}}
		>
			<SignOutIcon />
		</Button>
	);
}
