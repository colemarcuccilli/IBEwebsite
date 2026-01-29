import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { QuoteProvider } from "@/context/QuoteContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IBE | Industrial Bakery Equipment - Fort Wayne, IN",
  description: "Industrial Bakery Equipment specializes in food service equipment, wire carts, and various wire and sheet metal related products since 2008.",
  keywords: "industrial bakery equipment, bakery racks, bread racks, pan tree racks, dough troughs, blast freeze racks, wire carts, Fort Wayne",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider>
          <QuoteProvider>{children}</QuoteProvider>
        </DataProvider>
      </body>
    </html>
  );
}
