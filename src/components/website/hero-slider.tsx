"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/gallery/seo.svg", title: "Search Engine Optimization", tag: "SEO" },
  { src: "/gallery/web.svg", title: "Website Design & Development", tag: "Web" },
  { src: "/gallery/ads.svg", title: "Google Ads / PPC", tag: "Google Ads" },
  { src: "/gallery/social.svg", title: "Social Media Marketing", tag: "Social Media" },
  { src: "/gallery/gbp.svg", title: "Google Business Profile", tag: "Local SEO" },
  { src: "/gallery/perf.svg", title: "Performance Marketing", tag: "Growth" },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || reduce) return;
    timer.current = setInterval(next, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reduce, next]);

  return (
    <section
      className="relative bg-navy py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-grid-navy opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            What We Do
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Marketing That Makes Your Business <span className="text-gradient">Impossible to Miss</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[index].src}
                  alt={slides[index].title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                    {slides[index].tag}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    {slides[index].title}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-sky-400" : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}