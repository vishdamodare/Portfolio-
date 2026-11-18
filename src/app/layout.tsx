import type { Metadata, Viewport } from "next";
import { Barlow_Semi_Condensed, Geist, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/ui/Header";
import { Providers } from "@/components/ui/Providers";
import { creator, siteUrl } from "@/data/creator";
import { compact } from "@/lib/format";
import "./globals.css";

const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
// Numbers only; not preloaded so it never competes with the LCP image.
const barlow = Barlow_Semi_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: "600", preload: false });

const description = `${creator.name} (${creator.handle}) is a ${creator.role.toLowerCase()} from ${creator.location}, with ${compact(creator.stats.followers)} Instagram followers and ${compact(creator.stats.monthlyViews)} monthly views. Available for UGC, reels and brand collaborations.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${creator.name} — ${creator.role}`,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "profile", title: `${creator.name} — ${creator.role}`, description, url: "/", siteName: creator.name, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: creator.name, description },
};

export const viewport: Viewport = { themeColor: "#f4f1ea" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: creator.name,
  alternateName: creator.handle,
  jobTitle: creator.role,
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  sameAs: [creator.instagram],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${instrument.variable} ${geist.variable} ${barlow.variable} antialiased`}>
      <body>
        <a href="#main" className="sr-only z-[110] rounded-full bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
