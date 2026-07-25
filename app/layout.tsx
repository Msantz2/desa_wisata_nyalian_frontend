import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Toaster } from "sonner";
import { getNavigation, getSettings } from "@/lib/data";
import StructuredData from "@/components/seo/StructuredData";
import { createOrganizationSchema } from "@/lib/structuredData";
import { DestinationModalProvider } from "@/contexts/DestinationModalContext";
import { PackageModalProvider } from "@/contexts/PackageModalContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nyalian Tourism Village | Authentic Balinese Mountain Experience",
    template: "%s | Nyalian Tourism Village",
  },
  description: "Discover the hidden gem of Bangli Regency. Experience pristine waterfalls, rice terraces, rich cultural heritage, and warm hospitality in Bali's mountains.",
  keywords: ["Bali tourism", "Nyalian Village", "Bangli Regency", "waterfall Bali", "rice terraces", "cultural tourism", "ecotourism", "village tourism Bali"],
  authors: [{ name: "Nyalian Tourism Village" }],
  creator: "Nyalian Tourism Village",
  publisher: "Nyalian Tourism Village",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nyalianvillage.com"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nyalian Tourism Village",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = getNavigation();
  const settings = getSettings();
  const organizationSchema = createOrganizationSchema(settings);
  
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <StructuredData data={organizationSchema} />
        <PackageModalProvider>
          <DestinationModalProvider>
            <Navbar navLinks={navLinks} />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
            <Toaster position="top-right" />
          </DestinationModalProvider>
        </PackageModalProvider>
      </body>
    </html>
  );
}
