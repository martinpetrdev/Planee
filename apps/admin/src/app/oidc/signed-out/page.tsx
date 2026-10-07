import { Button } from "@repo/web-ui/components/ui/button";
import Link from "next/link";

export default function Page() {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<h1 className="text-4xl">You have been signed out.</h1>
			<Link href="/" className="fixed bottom-10">
				<Button size="lg">Sign in</Button>
			</Link>
		</div>
	);
}
