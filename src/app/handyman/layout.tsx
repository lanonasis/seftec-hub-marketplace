import type { Metadata } from "next";

const baseUrl = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "https://seftec-hub.replit.app"
);

export const metadata: Metadata = {
  title: "Handyman Hub — Book Lagos Pros in 30 Secs",
  description:
    "AC dead? Pipe burst? Book a verified Lagos plumber, electrician, or AC repair pro in under 30 seconds. Flat ₦15k pricing, real reviews, no scammers.",
  alternates: {
    canonical: `${baseUrl.href}handyman`,
  },
  openGraph: {
    type: "website",
    siteName: "SEFTEC Hub",
    title: "Handyman Hub — AC Dead? Book in 30 Secs. Done by Dinner. 🔧",
    description:
      "Book a verified Lagos plumber, electrician, or AC repair pro in under 30 seconds. Flat ₦15k pricing, no stories.",
    url: `${baseUrl.href}handyman`,
    locale: "en_NG",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Handyman Hub Lagos — SEFTEC Hub",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handyman Hub — AC Dead? Book in 30 Secs. Done by Dinner. 🔧",
    description:
      "Book a verified Lagos pro in 30 secs. Flat ₦15k pricing, no scammers, no stories.",
    images: ["/opengraph-image"],
  },
};

export default function HandymanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
