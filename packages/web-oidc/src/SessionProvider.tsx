"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function AuthProvider(props: PropsWithChildren) {
	return <SessionProvider basePath="/oidc">{props.children}</SessionProvider>;
}
