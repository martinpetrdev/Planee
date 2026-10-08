import { SignInIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@repo/web-ui/components/ui/button";
import Link from "next/link";

export default function Page() {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<h1 className={"text-4xl"}>You have been signed out.</h1>
			<Link href={"/"}>
				<Button
					variant={"secondary"}
					size="lg"
					className={"fixed bottom-10 left-1/2 -translate-x-1/2"}
				>
					Sign in <SignInIcon size={24} />
				</Button>
			</Link>
		</div>
	);
}
