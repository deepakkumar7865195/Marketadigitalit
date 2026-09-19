"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";
import { Reveal } from "@/components/website/reveal";

const CATEGORIES = ["All", "SEO", "Website", "Google Ads", "Social Media", "Local SEO"];

export function PortfolioGrid() {
  const [filter, setFilter] = useState("All");
  const projects = PORTFOLIO_PROJECTS.filter((p) => filter === "All" || p.category === filter);

  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Results We're Proud to"
          highlight="Showcase"
          description="A glimpse of the growth our clients have achieved with data-driven marketing."
        />

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                filter === c
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <motion.article
              layout
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500" />
                <div className="absolute inset-0 bg-grid-navy opacity-50" />
                <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {p.category}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                {p.image ? (
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                ) : null}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                  <BarChart3 className="h-4 w-4 shrink-0" />
                  {p.results}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}