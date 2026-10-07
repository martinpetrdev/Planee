import type { PropsWithChildren } from "react";
import { ServerSideAccessGuard } from "@/providers/AccessGuard";

export default function Layout(props: PropsWithChildren) {
	return <ServerSideAccessGuard>{props.children}</ServerSideAccessGuard>;
}
