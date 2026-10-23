import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Lora } from "next/font/google";
import "./globals.css";
import { AuthenticationProvider, OIDCProvider } from "@repo/web-oidc";
import { cn } from "@repo/web-ui";
import { oidcProvider } from "@/auth";
import { WebConfig } from "@/config";
import { ConfigProvider } from "@/providers/ConfigProvider";

const bricolageGrotesqueHeading = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-heading",
});

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Adminee",
	description: "Day planner for people who love forgetting things",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={cn(
				"dark",
				"h-full",
				"antialiased",
				"font-sans",
				figtree.variable,
				bricolageGrotesqueHeading.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				<ConfigProvider>
					<AuthenticationProvider provider={oidcProvider}>
						{children}
					</AuthenticationProvider>
				</ConfigProvider>
			</body>
		</html>
	);
}
