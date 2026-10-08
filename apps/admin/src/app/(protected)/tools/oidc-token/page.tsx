"use client";

import { useSession } from "next-auth/react";

export default function Page() {
	const { data: session, status } = useSession();

	if (status === "loading") return <p>Loading…</p>;

	return <p>{session?.accessToken ?? "Not logged in"}</p>;
}
