import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const font_outfit = Outfit({
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Planee",
  description: "Day planner for people who love forgetting things",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${font_outfit.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
