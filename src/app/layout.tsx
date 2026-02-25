import type { Metadata } from "next";
import Script from "next/script";
import { Barlow } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { QuoteProvider } from "@/context/QuoteContext";
import StructuredData from "@/components/StructuredData";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "IBE | Industrial Bakery Equipment - Fort Wayne, IN",
  description: "Industrial Bakery Equipment (IBE) specializes in food service equipment, bakery racks, bread racks, blast freeze racks, wire carts, dough troughs, and custom wire and sheet metal products. Serving the baking, food processing, seafood, restaurant, and retail grocery industries since 2008. Located in Fort Wayne, IN.",
  keywords: "industrial bakery equipment, IBE, bakery racks, bread racks, bread cooling racks, pan tree racks, dough troughs, blast freeze racks, drying racks, wire carts, mail carts, platform trucks, nesting carts, receiving carts, fry screens, bagel baskets, donut baskets, pie racks, glazing racks, custom racks, food service equipment, sheet metal products, stainless steel fabrication, steel wire products, Fort Wayne, Indiana, seafood processing equipment, chicken processing equipment, meat drying racks, commercial bakery equipment",
  authors: [{ name: "Industrial Bakery Equipment" }],
  metadataBase: new URL("https://www.ibefw.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "IBE | Industrial Bakery Equipment - Fort Wayne, IN",
    description: "Steel & stainless steel fabrication for bakery racks, blast freeze racks, wire carts, dough troughs, and custom equipment. Serving food service industries since 2008.",
    type: "website",
    locale: "en_US",
    url: "https://www.ibefw.com",
    siteName: "Industrial Bakery Equipment",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Bakery Equipment - Steel & Stainless Steel Food Service Equipment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IBE | Industrial Bakery Equipment - Fort Wayne, IN",
    description: "Steel & stainless steel fabrication for bakery racks, blast freeze racks, wire carts, dough troughs, and custom equipment since 2008.",
    images: ["/images/og-image.jpg"],
  },
  other: {
    "geo.region": "US-IN",
    "geo.placename": "Fort Wayne",
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
        <StructuredData />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${barlow.variable} antialiased`}>
        <DataProvider>
          <QuoteProvider>{children}</QuoteProvider>
        </DataProvider>
      </body>
    </html>
  );
}
