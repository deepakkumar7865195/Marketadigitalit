import type { Metadata } from "next";
import { Hero } from "@/components/website/hero";
import { HeroSlider } from "@/components/website/hero-slider";
import { ServicesCarousel } from "@/components/website/services-carousel";
import { WhyUs } from "@/components/website/why-us";
import { About } from "@/components/website/about";
import { Process } from "@/components/website/process";
import { PortfolioGrid } from "@/components/website/portfolio";
import { ClientsLogos } from "@/components/website/clients-logos";
import { Testimonials } from "@/components/website/testimonials";
import { CtaSection } from "@/components/website/cta-section";
import { ContactSection } from "@/components/website/contact-section";
import { SchemaJsonLd } from "@/components/shared/schema-jsonld";

export const metadata: Metadata = {
  title: "Grow Your Business With Powerful Digital Marketing",
  description:
    "Marketa Digital IT — data-driven SEO, Google Ads, Meta Ads, web development and performance marketing that grows your business. Get a free consultation.",
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Marketa Digital IT",
  url: "https://marketadigitalit.com",
  description:
    "Digital Marketing & Web Development Agency offering SEO, Google Ads, Meta Ads, Social Media Marketing, Local SEO and more.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://marketadigitalit.com/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    "Search Engine Optimization",
    "Website Design & Development",
    "Google Ads / PPC",
    "Meta Ads",
    "Social Media Marketing",
    "Local SEO",
  ].map((name, i) => ({
    "@type": "Service",
    position: i + 1,
    name,
    provider: { "@type": "Organization", name: "Marketa Digital IT" },
  })),
};

export default function HomePage() {
  return (
    <>
      <SchemaJsonLd data={webSiteSchema} />
      <SchemaJsonLd data={servicesSchema} />
      <Hero />
      <HeroSlider />
      <ServicesCarousel />
      <WhyUs />
      <About />
      <Process />
      <PortfolioGrid />
      <ClientsLogos />
      <Testimonials />
      <CtaSection />
      <ContactSection />
    </>
  );
}