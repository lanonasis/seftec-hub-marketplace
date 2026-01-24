import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SEFTEC Hub - AI-Powered Marketplace & Social Discovery",
  description: "Discover amazing experiences, events, and services with AI assistance. From rooftop bars to handyman services, find your next vibe with SEFTEC Hub.",
  keywords: ["marketplace", "events", "AI assistant", "local experiences", "social discovery", "handyman services"],
  authors: [{ name: "SEFTEC Hub" }],
  openGraph: {
    title: "SEFTEC Hub - AI-Powered Marketplace",
    description: "Discover amazing experiences and events with AI assistance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
