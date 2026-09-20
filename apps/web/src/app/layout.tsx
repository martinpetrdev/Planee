import type { Metadata } from "next";
import { Figtree, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@repo/web-ui";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
