import type { Metadata } from "next";
import { ContactSection } from "@/components/website/contact-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get a free consultation for your SEO, website, Google Ads or social media marketing. Contact Marketa Digital IT today.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> Contact
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Let's Talk <span className="text-gradient">Growth</span>
            </h1>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}