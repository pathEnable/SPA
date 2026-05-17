import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Loader from "@/components/Loader";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  title: "Méli Empire | Spa Mobile d'Exception",
  description: "Vivez l'expérience ultime du bien-être à domicile. Massage relaxant, soin signature et détente absolue avec Méli Empire.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Méli Empire | Spa Mobile d'Exception",
    description: "Vivez l'expérience ultime du bien-être à domicile. Réservez votre massage dès aujourd'hui.",
    url: "https://meli-empire.com",
    siteName: "Méli Empire SPA MOBILE",
    images: [
      {
        url: "/spa-hero.png",
        width: 1200,
        height: 630,
        alt: "Ambiance relaxante Méli Empire SPA",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Loader />
        {children}
      </body>
    </html>
  );
}
