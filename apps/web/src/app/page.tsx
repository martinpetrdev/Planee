import { oidcAuth } from "@/auth";
import { SignoutButton } from "@/components/SignoutButton";

export default async function Page() {
	const session = await oidcAuth.getSession();

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl animate-pulse font-heading">Welcome to Planee</h1>
			<SignoutButton session={session!} />
		</div>
	);
}
