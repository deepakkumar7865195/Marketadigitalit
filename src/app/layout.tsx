import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { COMPANY } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marketadigitalit.com"),
  title: {
    default: "Marketa Digital IT — Digital Marketing & Web Development Agency",
    template: "%s | Marketa Digital IT",
  },
  description:
    "Marketa Digital IT helps businesses grow with data-driven digital marketing: SEO, Google Ads, Meta Ads, web development, local SEO, GBP optimization and performance marketing.",
  keywords: [
    "digital marketing agency",
    "SEO agency India",
    "Google Ads agency",
    "Web development company",
    "Local SEO",
    "Google Business Profile optimization",
    "Meta Ads",
    "Performance marketing",
    "Marketa Digital IT",
  ],
  authors: [{ name: "Marketa Digital IT" }],
  creator: "Marketa Digital IT",
  publisher: "Marketa Digital IT",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://marketadigitalit.com",
    siteName: COMPANY.name,
    title: "Marketa Digital IT — Grow. Rank. Convert.",
    description:
      "Data-driven digital marketing, SEO and web development that grow your business.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketa Digital IT — Digital Marketing & Web Development Agency",
    description:
      "SEO, Google Ads, Meta Ads, web development and performance marketing that grow your business.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}