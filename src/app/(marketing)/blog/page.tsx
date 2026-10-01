import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/website/reveal";
import { BLOG_POSTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Digital Marketing Blog & Insights",
  description:
    "Actionable guides on SEO, Google Ads, social media marketing, local SEO and web development from the Marketa Digital IT team.",
};

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
            {BLOG_POSTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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