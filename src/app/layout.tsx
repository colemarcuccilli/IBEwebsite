import type { Metadata } from "next";
import Script from "next/script";
import { Barlow } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { QuoteProvider } from "@/context/QuoteContext";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "IBE | Industrial Bakery Equipment - Fort Wayne, IN",
  description: "Industrial Bakery Equipment (IBE) specializes in food service equipment, bakery racks, bread racks, blast freeze racks, wire carts, dough troughs, and custom wire and sheet metal products. Serving the baking, food processing, seafood, restaurant, and retail grocery industries since 2008. Located in Fort Wayne, IN.",
  keywords: "industrial bakery equipment, IBE, bakery racks, bread racks, bread cooling racks, pan tree racks, dough troughs, blast freeze racks, drying racks, wire carts, mail carts, platform trucks, nesting carts, receiving carts, fry screens, bagel baskets, donut baskets, pie racks, glazing racks, custom racks, food service equipment, sheet metal products, Fort Wayne, Indiana, seafood processing equipment",
  authors: [{ name: "Industrial Bakery Equipment" }],
  openGraph: {
    title: "IBE | Industrial Bakery Equipment",
    description: "Quality food service equipment, bakery racks, blast freeze racks, wire carts, and custom solutions since 2008.",
    type: "website",
    locale: "en_US",
    siteName: "Industrial Bakery Equipment",
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
