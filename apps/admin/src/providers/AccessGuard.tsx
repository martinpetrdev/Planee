"use server";

import type { PropsWithChildren } from "react";
import { hasAccess } from "@/api/modules/admin/admin";
import { AccessDeniedScreen } from "@/screens/AccessDeniedScreen";

export async function ServerSideAccessGuard(props: PropsWithChildren) {
	const accessGranted = await hasAccess();

	if (!accessGranted) return <AccessDeniedScreen />;
	return props.children;
}
