import type { Metadata } from "next";
import { Figtree, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@repo/web-ui";
import { AppShell } from "@repo/web-ui/components/shell/app-shell";
import { PLANEE_APP_ROOT } from "@/config/links";
import { PLANEE_MOBILE_APP_PACKAGE_NAME } from "@/config/mobile";

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Planee",
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
        loraHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppShell
          navbarButtonLabel="Open the app"
          navbarButtonHref={PLANEE_APP_ROOT}
          navbarLinks={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Get the app",
              items: [
                {
                  label: "Google Play",
                  description: "Download for Android",
                  href: `https://play.google.com/store/apps/details?id=${PLANEE_MOBILE_APP_PACKAGE_NAME}`,
                },
              ],
            },
          ]}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
