import type { Metadata } from "next";

const baseUrl = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "https://seftec-hub.replit.app"
);

export const metadata: Metadata = {
  title: "VibeFind — Lagos Events & Nightlife",
  description:
    "Quilox, Owambe @ Eko Hotel, Escape Lekki, Yaba Underground and more — find where Lagos is linking up tonight. Live crowd data, HOT badges, RSVP in seconds.",
  alternates: {
    canonical: `${baseUrl.href}vibefind`,
  },
  openGraph: {
    type: "website",
    siteName: "SEFTEC Hub",
    title: "VibeFind — Lagos, Where You Dey Tonight? 🔥",
    description:
      "Quilox, Owambe, Escape Lekki and more — find where Lagos is linking up tonight. Live crowd data, RSVP in seconds.",
    url: `${baseUrl.href}vibefind`,
    locale: "en_NG",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VibeFind Lagos — SEFTEC Hub",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeFind — Lagos, Where You Dey Tonight? 🔥",
    description:
      "Find where Lagos is linking up tonight. Quilox, Owambe, Escape Lekki and more.",
    images: ["/opengraph-image"],
  },
};

export default function VibeFindsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
