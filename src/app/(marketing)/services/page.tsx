import type { Metadata } from "next";
import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";
import { ServiceItem } from "@/components/website/services-carousel";
import { Stagger, StaggerItem } from "@/components/website/reveal";
import { CtaSection } from "@/components/website/cta-section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SEO, web development, Google Ads, Meta Ads, social media marketing, Local SEO, GBP optimization, e-commerce SEO, performance marketing and AI search optimization.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="bg-radial-accent absolute -right-24 top-8 h-96 w-96" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-36 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="Complete Digital Growth"
            highlight="Under One Roof"
            description="From ranking #1 on Google to websites that sell — run your entire digital presence with one accountable team."
          />
        </div>
      </section>

      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceItem service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaSection />
    </>
  );
}