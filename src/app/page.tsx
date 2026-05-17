import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import { Metadata } from "next";
import Script from "next/script";

// Revalidate on a schedule (ISR), though our API routes also trigger on-demand revalidation via revalidatePath('/')
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settingsRows = await prisma.siteSetting.findMany({
    where: {
      key: { in: ['site_title', 'site_description', 'site_keywords'] }
    }
  });
  
  const siteSettings: Record<string, string> = {};
  settingsRows.forEach((setting) => {
    siteSettings[setting.key] = setting.value;
  });

  return {
    title: siteSettings['site_title'] || "Méli Empire | Spa Mobile d'Exception",
    description: siteSettings['site_description'] || "Vivez l'expérience ultime du bien-être à domicile.",
    keywords: siteSettings['site_keywords'] || "spa, massage, abidjan, bien-être, domicile",
    openGraph: {
      title: siteSettings['site_title'] || "Méli Empire | Spa Mobile d'Exception",
      description: siteSettings['site_description'] || "Vivez l'expérience ultime du bien-être à domicile.",
      url: "https://meli-empire.com",
      siteName: siteSettings['site_title'] || "Méli Empire",
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
}

export default async function Page() {
  // Fetch all necessary data for the homepage in parallel
  const [heroSlides, servicesList, faqItems, settingsRows] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    }),
    prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    }),
    prisma.siteSetting.findMany()
  ]);

  // Transform site settings into a simple key-value record
  const siteSettings: Record<string, string> = {};
  settingsRows.forEach((setting) => {
    siteSettings[setting.key] = setting.value;
  });

  return (
    <>
      {siteSettings['google_analytics_id'] && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteSettings['google_analytics_id']}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteSettings['google_analytics_id']}');
            `}
          </Script>
        </>
      )}
      <HomePageClient 
        heroSlides={heroSlides}
        servicesList={servicesList}
        faqItems={faqItems}
        siteSettings={siteSettings}
      />
    </>
  );
}
