"use client";

import { CLIENT_LOGOS } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";

export function ClientsLogos() {
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section className="overflow-hidden bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trusted By"
          title="Businesses That Grow With"
          highlight="Marketa Digital IT"
          description=""
        />
      </div>
      <div className="relative mt-10 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="group flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-3 rounded-xl border px-6 py-3.5 opacity-70 transition-opacity group-hover:opacity-100"
            >
              <span className="flex h-5 w-5 rounded-full bg-gradient-to-br from-blue-600 to-sky-400" />
              <span className="whitespace-nowrap font-display text-lg font-bold text-muted-foreground">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}