import type { Metadata } from "next";
import { contactDetails, seoDescription } from "@/data/site-content";
import { createMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
export const metadata: Metadata = {
  ...createMetadata({
    title: "INK DABBA | Design-Led Creative Studio, Chennai",
    description: seoDescription,
    path: "/",
    keywords: [
      "design-led creative studio",
      "branding studio Chennai",
      "digital design agency India",
      "campaign creative studio",
      "visual branding Chennai",
    ],
  }),
  title: {
    absolute: "INK DABBA | Design-Led Creative Studio, Chennai",
  },
};

import HeroSection from "@/components/home/HeroSection";

export default async function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeAgency",
    name: "INK DABBA",
    description: seoDescription,
    url: SITE_URL,
    email: contactDetails.email,
    telephone: contactDetails.phoneNumbers,
    slogan: "Design-led studio in Chennai",
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactDetails.addressLine1,
      addressRegion: "Tamil Nadu",
      postalCode: "600040",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    areaServed: "India",
    knowsAbout: [
      "Brand identity",
      "Poster design",
      "Campaign creatives",
      "Banner systems",
      "Digital marketing design support",
      "Visual communication studio India",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="flex flex-col bg-ink-black text-warm-white">
        <HeroSection />
      </main>
    </>
  );
}
