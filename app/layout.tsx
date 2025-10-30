import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ingredient Shield",
  description: "Scan food products to check ingredients against your dietary restrictions",
  icons: {
    icon: "/icon-512x512.png"
  },
  applicationName: "Ingredient Shield",
  referrer: "origin-when-cross-origin",
  keywords: ["food", "ingredients", "dietary", "restrictions", "scanner"],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Ingredient Shield",
    description: "Scan food products to check ingredients against your dietary restrictions",
    images: [{ url: "/icon-512x512.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ingredient Shield",
    description: "Scan food products to check ingredients against your dietary restrictions",
    images: ["/icon-512x512.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
