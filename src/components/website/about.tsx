"use client";

import { Compass, Eye } from "lucide-react";
import { Reveal } from "@/components/website/reveal";

export function About() {
  return (
    <section className="overflow-hidden bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal x={-24} y={0}>
            <div className="relative">
              <div className="bg-radial-primary absolute -left-10 -top-10 h-64 w-64" />
              <div className="relative rounded-2xl border bg-card p-6 shadow-xl">
                <div className="flex items-center gap-3 border-b pb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white">
                    <Compass className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold">Marketa Digital IT</p>
                    <p className="text-xs text-muted-foreground">Grow. Rank. Convert.</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Team", value: "15+" },
                    { label: "Clients", value: "50+" },
                    { label: "ROI focus", value: "100%" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-muted/70 p-3 text-center">
                      <p className="font-display text-xl font-bold text-primary">{s.value}</p>
                      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500" />
                  <div className="absolute inset-0 bg-grid-navy opacity-60" />
                  <div className="absolute bottom-4 left-4 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                    Nagpur, Maharashtra · Serving clients worldwide
                  </div>
                  <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                      <Eye className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                About Us
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A Digital Partner Obsessed With Your <span className="text-gradient">Growth</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Marketa Digital IT is a digital marketing and web development agency helping
                ambitious businesses win more customers online. We combine technical SEO,
                high-converting websites and performance ads under one accountable roof.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Compass className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold">Our Mission</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    To make world-class digital marketing accessible and truly measurable for
                    growing businesses — so every rupee you invest returns real growth.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="h-full rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Eye className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold">Our Vision</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    To become India's most trusted digital growth partner — known for transparent
                    reporting, data-first decisions and campaigns built for revenue.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}