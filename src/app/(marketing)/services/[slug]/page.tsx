import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/website/cta-section";
import { Reveal } from "@/components/website/reveal";
import { SchemaJsonLd } from "@/components/shared/schema-jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.long,
    alternates: { canonical: `https://marketadigitalit.com/services/${slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const includes = [
    "Complete strategy & execution",
    "Transparent monthly reporting with live dashboards",
    "Dedicated account manager on WhatsApp & calls",
    "Continuous testing & optimization",
    "No long-term lock-in",
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="bg-radial-primary absolute -left-24 top-10 h-96 w-96" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-36 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
          <Reveal className="mt-6 max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{service.long}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">See Results</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl font-bold">What's Included</h2>
              <ul className="mt-6 space-y-4">
                {includes.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-2xl font-bold">How We Deliver Result</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Audit your current presence and identify quick wins",
                  "Build a documented 90-day growth roadmap with clear KPIs",
                  "Execute campaigns, ship content and optimize continuously",
                  "Report everything in plain language your team can act on",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-4 rounded-xl border bg-card p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Start this process <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
      <SchemaJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.long,
          provider: { "@type": "Organization", name: "Marketa Digital IT", url: "https://marketadigitalit.com" },
          areaServed: "IN",
        }}
      />
    </>
  );
}