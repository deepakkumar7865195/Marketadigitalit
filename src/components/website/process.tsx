"use client";

import { PROCESS_STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";
import { Reveal } from "@/components/website/reveal";

export function Process() {
  return (
    <section className="bg-navy py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Our Process"
          title="A Proven System From Brief to"
          highlight="Growth"
          description="No guesswork. Every engagement follows a transparent, six-step process built for measurable results."
        />

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-blue-600 via-sky-500/60 to-transparent sm:left-1/2" />
          <div className="space-y-10">
            {PROCESS_STEPS.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={step.no} delay={0.05 * i} x={left ? -20 : 20} y={0}>
                  <div className={`relative flex flex-col gap-4 pl-14 sm:pl-0 sm:flex-row ${left ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-400 font-display text-sm font-bold text-white shadow-lg shadow-blue-600/40 sm:left-1/2 sm:-translate-x-1/2">
                      {step.no}
                    </span>
                    <div className={`sm:w-1/2 ${left ? "sm:pr-14 sm:text-right" : "sm:pl-14"}`}>
                      <div className="inline-block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <span className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                          Step {step.no}
                        </span>
                        <h3 className="mt-2 font-display text-xl font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.text}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}