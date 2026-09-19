import type { Metadata } from "next";
import { SectionHeading } from "@/components/website/section-heading";
import { About } from "@/components/website/about";
import { WhyUs } from "@/components/website/why-us";
import { CtaSection } from "@/components/website/cta-section";
import { Reveal } from "@/components/website/reveal";
import { STATS, WHY_CHOOSE_US } from "@/lib/constants";
import { SchemaJsonLd } from "@/components/shared/schema-jsonld";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Marketa Digital IT is a data-driven digital marketing and web development agency helping businesses grow with SEO, ads and high-converting websites.",
};

const values = [
  { t: "Data over opinions", d: "Every strategy starts with numbers, not gut feeling." },
  { t: "Radical transparency", d: "Live dashboards and honest monthly reporting, always." },
  { t: "Revenue mindset", d: "We optimise for leads and sales — not likes and vanity metrics." },
  { t: "Ownership", d: "We treat your budget like our own money. No waste, no excuses." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="bg-radial-primary absolute -left-24 top-10 h-96 w-96" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-36 text-center sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About Marketa Digital IT"
            title="We Help Businesses"
            highlight="Grow. Rank. Convert."
            description="A focused team of strategists, SEO specialists, developers and media buyers on a mission to make digital marketing measurable for growing businesses."
          />
        </div>
      </section>

      <About />

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Values That Shape"
            highlight="Every Campaign"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="font-display text-3xl font-bold text-primary/20">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 rounded-3xl bg-navy p-10 text-center sm:grid-cols-4">
            {STATS.map((s) => (
              <Reveal key={s.label}>
                <p className="font-display text-4xl font-bold text-white">
                  {s.value}
                  <span className="text-sky-400">{s.suffix}</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyUs />
      <CtaSection />
      <SchemaJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Marketa Digital IT",
          url: "https://marketadigitalit.com/about",
          about: { "@type": "Organization", name: "Marketa Digital IT" },
        }}
      />
    </>
  );
}