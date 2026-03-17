import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const baseUrl = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "https://seftec-hub.replit.app"
);

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "SEFTEC Hub — Lagos Marketplace & VibeFind",
    template: "%s | SEFTEC Hub",
  },
  description:
    "Find Lagos's hottest parties, owambe, and rooftop vibes — or book a verified handyman in 30 secs. SEFTEC Hub is the GenZ marketplace for Lagos.",
  keywords: [
    "Lagos events",
    "Lagos nightlife",
    "owambe",
    "Lagos handyman",
    "VibeFind Lagos",
    "Lagos parties",
    "book handyman Lagos",
    "Lagos marketplace",
    "SEFTEC Hub",
    "Leo AI",
  ],
  authors: [{ name: "SEFTEC Hub" }],
  creator: "SEFTEC Hub",
  publisher: "SEFTEC Hub",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "SEFTEC Hub",
    title: "SEFTEC Hub — Lagos, Where You Dey Tonight? 🔥",
    description:
      "Find Lagos's hottest parties, owambe, and rooftop vibes — or book a verified handyman in 30 secs. No dull moment.",
    url: baseUrl.href,
    locale: "en_NG",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SEFTEC Hub — Lagos Marketplace & VibeFind",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEFTEC Hub — Lagos, Where You Dey Tonight? 🔥",
    description:
      "Find Lagos's hottest parties, owambe, and rooftop vibes — or book a verified handyman in 30 secs.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
