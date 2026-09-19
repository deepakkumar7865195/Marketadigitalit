import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/website/portfolio";
import { CtaSection } from "@/components/website/cta-section";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "See real results from Marketa Digital IT clients: SEO growth, website launches, Google Ads performance and social media wins.",
};

export default function PortfolioPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> Portfolio
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Work That <span className="text-gradient">Speaks in Numbers</span>
            </h1>
          </div>
        </div>
      </section>
      <PortfolioGrid />
      <CtaSection />
    </>
  );
}