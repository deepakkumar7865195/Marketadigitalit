import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/website/reveal";

export const metadata: Metadata = {
  title: "Digital Marketing Blog & Insights",
  description:
    "Actionable guides on SEO, Google Ads, social media marketing, local SEO and web development from the Marketa Digital IT team.",
};

const posts = [
  {
    slug: "local-seo-checklist-2026",
    title: "The Complete Local SEO Checklist for 2026",
    excerpt:
      "Dominate the Google map pack with this step-by-step local SEO checklist — GBP optimization, citations and review strategy.",
    date: "Aug 2026",
    tag: "Local SEO",
  },
  {
    slug: "google-ads-account-structure",
    title: "Google Ads Account Structure That Cuts Cost Per Lead",
    excerpt:
      "How we structure campaigns, ad groups and keywords to lower CPC and maximise conversion quality.",
    date: "Jul 2026",
    tag: "Google Ads",
  },
  {
    slug: "ai-search-optimization",
    title: "AEO / GEO: Getting Cited by ChatGPT, Perplexity & AI Overviews",
    excerpt:
      "Brands that appear in AI answers win the next search era. Here's how to optimise for generative engines.",
    date: "Jun 2026",
    tag: "AI Search",
  },
  {
    slug: "website-page-speed-guide",
    title: "How Page Speed Impacts SEO & How to Get a 95+ PageSpeed Score",
    excerpt:
      "Core Web Vitals are ranking factors. A developer's guide to a fast, conversion-ready website.",
    date: "May 2026",
    tag: "Web Development",
  },
  {
    slug: "meta-ads-creative-testing",
    title: "Meta Ads Creative Testing Framework That Scales",
    excerpt:
      "Angle, hook and creative structure — the testing system behind our 10x ROAS Meta campaigns.",
    date: "Apr 2026",
    tag: "Meta Ads",
  },
  {
    slug: "seo-reporting-kpis",
    title: "SEO KPIs That Actually Matter (and Which to Ignore)",
    excerpt:
      "Rankings are vanity. Leads are the scoreboard. How we define and report SEO success.",
    date: "Mar 2026",
    tag: "SEO",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-36 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> Blog
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Insights for <span className="text-gradient">Smart Growth</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Practical, no-fluff marketing and web development guides from our team.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-grid-navy opacity-50" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}