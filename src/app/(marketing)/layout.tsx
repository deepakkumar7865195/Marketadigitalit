import { COMPANY } from "@/lib/constants";
import { Navbar } from "@/components/website/navbar";
import { Footer } from "@/components/website/footer";
import { IntroLoader } from "@/components/website/intro-loader";
import { SchemaJsonLd } from "@/components/shared/schema-jsonld";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: COMPANY.name,
    url: "https://marketadigitalit.com",
    email: COMPANY.email,
    telephone: "+91" + COMPANY.phone.replace(/\D/g, ""),
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700157",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91" + COMPANY.phone.replace(/\D/g, ""),
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://www.facebook.com",
      "https://www.instagram.com",
      "https://www.linkedin.com",
      "https://www.youtube.com",
    ],
  };

  return (
    <>
      <IntroLoader />
      <SchemaJsonLd data={organization} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}