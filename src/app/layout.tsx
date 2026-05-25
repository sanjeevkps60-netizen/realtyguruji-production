import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} | Gurugram Real Estate Consultant`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Gurugram real estate",
    "Gurugram property dealer",
    "Realty Guruji",
    "Rahul Soni",
    "2BHK rent Gurugram",
    "3BHK resale Gurugram",
    "Dwarka Expressway property",
    "Golf Course Road flats",
    "builder floor Gurugram",
    "society flat Gurugram",
    "Gurugram property consultant",
  ],
  authors: [{ name: site.founder.name }],
  creator: site.founder.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/hero-banner.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero-banner.png"],
  },
  icons: { icon: "/images/rg-logo.jpg", apple: "/images/rg-logo.jpg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${site.url}/#organization`,
  name: site.name,
  image: `${site.url}/images/logo.png`,
  url: site.url,
  telephone: site.contact.phoneE164,
  email: site.contact.email,
  priceRange: "₹₹",
  founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address,
    addressLocality: site.contact.city,
    addressRegion: site.contact.state,
    postalCode: site.contact.postalCode,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.contact.geo.lat,
    longitude: site.contact.geo.lng,
  },
  areaServed: { "@type": "City", name: "Gurugram" },
  sameAs: [
    site.socials.youtube,
    site.socials.facebook,
    site.socials.instagram,
    site.socials.linkedin,
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ChatWidget />
      </body>
    </html>
  );
}
