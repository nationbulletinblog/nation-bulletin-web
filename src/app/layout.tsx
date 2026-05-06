import { Inter, Montserrat, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AuthContext from "@/components/AuthContext";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600", "700", "800", "900"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700", "800", "900"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600", "700", "800", "900"] });

import { fetchSiteSettings } from "@/app/actions/blog";

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings?.seoTitle || "Nation Bulletin | Stories & Insights",
      template: "%s | Nation Bulletin"
    },
    description: settings?.seoDescription || "A professional blog for the modern era, delivering curated news and trending stories.",
    alternates: {
      canonical: '/',
    },
    icons: {
      icon: '/favicon-globe.png',
      shortcut: '/favicon-globe.png',
      apple: '/favicon-globe.png',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <AuthContext>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthContext>
      </body>
    </html>
  );
}
