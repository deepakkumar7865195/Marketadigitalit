import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

const posts = [
  {
    slug: "local-seo-checklist-2026",
    title: "The Complete Local SEO Checklist for 2026",
    tag: "Local SEO",
    date: "Aug 2026",
    body: `Local SEO is the closest thing to "free customers on tap" for businesses with a physical presence. Here is the checklist we run for every local client.

1. Claim and fully optimize your Google Business Profile — categories, services, photos, posts and Q&A.
2. Fix NAP (Name, Address, Phone) consistency across every directory and citation.
3. Build localized landing pages targeting “near me” and city + service keywords.
4. Generate a steady stream of genuine Google reviews — respond to every single one.
5. Embed embedded maps and schema markup (LocalBusiness) on every location page.
6. Build local links: sponsorships, community pages, local press and industry associations.

Do these six things consistently for 90 days and the map pack becomes your number one lead source.`,
  },
  {
    slug: "google-ads-account-structure",
    title: "Google Ads Account Structure That Cuts Cost Per Lead",
    tag: "Google Ads",
    date: "Jul 2026",
    body: `A messy account structure quietly burns budget. The clean structure we use:

1. Campaign per theme — break campaigns by intent (brand, non-brand, competitor, remarketing).
2. Tightly themed ad groups — each ad group covers one search-intent theme, not a keyword dump.
3. Exact phrases in separate ad groups from broad/phrase so you can control spend precisely.
4. A ruthless negative keyword list from day one, reviewed weekly.
5. Search + page one bid strategy with tCPA once conversion data supports it.
6. Ad extensions everywhere: sitelinks, callouts, call, and structured snippets.

Structure is the difference between ₹800 and ₹130 cost per lead on the same budget.`,
  },
  {
    slug: "ai-search-optimization",
    title: "AEO / GEO: Getting Cited by ChatGPT, Perplexity & AI Overviews",
    tag: "AI Search",
    date: "Jun 2026",
    body: `Generative search engines now answer queries directly. Brands that earn citations in those answers own the next search era.

How to optimise:
1. Write direct, structured answers (definition → evidence → steps) that AI models can quote.
2. Publish original data and research — AI engines love citing unique statistics.
3. Keep consistent brand mentions and entity signals across your site, profiles and directories.
4. Use FAQ and HowTo schema so your content is machine-readable.
5. Earn authoritative backlinks and brand mentions (reviews, press, communities).

We call it AEO (Answer Engine Optimization) — and it now drives a measurable share of our clients' organic pipeline.`,
  },
  {
    slug: "website-page-speed-guide",
    title: "How Page Speed Impacts SEO & How to Get a 95+ PageSpeed Score",
    tag: "Web Development",
    date: "May 2026",
    body: `Core Web Vitals are Google ranking factors and conversion killers when ignored. Every 100ms of extra load time measurably drops conversion rate.

Our non-negotiables:
1. Next-generation image formats (WebP/AVIF) with proper dimensions and lazy loading.
2. Critical CSS inlined; render-blocking scripts deferred.
3. Image CDN and caching headers edge-side.
4. Preload and preconnect for fonts and third-party resources.
5. Avoid heavy carousels and autoplay media; design mobile-first.

A 95+ PageSpeed score is not a vanity metric — it is revenue on autopilot.`,
  },
  {
    slug: "meta-ads-creative-testing",
    title: "Meta Ads Creative Testing Framework That Scales",
    tag: "Meta Ads",
    date: "Apr 2026",
    body: `Creative is 80% of Meta Ads performance. Our testing framework:

1. One variable at a time — angle, hook, format or CTA — never all at once.
2. Minimum 3 creatives per ad set; kill underperformers within 10–14 days.
3. Test hooks hard: statistic, pain point, story, myth-bust.
4. Scale winners with CBO across audiences rather than duplicating ad sets.
5. Refresh creatives before fatigue sets in (usually every 3–4 weeks).

This discipline is how our clients consistently hold 4x–10x ROAS.`,
  },
  {
    slug: "seo-reporting-kpis",
    title: "SEO KPIs That Actually Matter (and Which to Ignore)",
    tag: "SEO",
    date: "Mar 2026",
    body: `Rankings and "keyword positions" are inputs, not outcomes. The KPIs that matter:

1. Organic qualified leads and revenue — the scoreboard.
2. Conversion rate from organic traffic by landing page.
3. Share of voice and impressions for money keywords.
4. Organic traffic to pages that actually generate enquiries.
5. Return on SEO spend (ROAS for organic).

We still track rankings — but only as a diagnostic. The monthly report answers one question: how much revenue did organic marketing bring this month?`,
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog Post Not Found" };
  return {
    title: post.title,
    description: `${post.tag} insights from Marketa Digital IT.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.body.split("\n\n");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_40%_at_50%_20%,black,transparent)]" />
      <div className="relative mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.tag}</span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <article className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) =>
            p.startsWith("1.") ? (
              <ul key={i} className="space-y-2 pl-1">
                {p.split("\n").filter(Boolean).map((li, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{p}</p>
            )
          )}
        </article>
      </div>
    </section>
  );
}