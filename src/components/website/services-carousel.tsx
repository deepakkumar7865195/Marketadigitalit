"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Code,
  FileText,
  LocateFixed,
  MapPin,
  MousePointerClick,
  Rocket,
  Search,
  Share2,
  ShoppingCart,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";
import { Reveal } from "@/components/website/reveal";

const iconMap: Record<string, LucideIcon> = {
  Search,
  Code,
  MousePointerClick,
  Share2,
  ThumbsUp,
  MapPin,
  LocateFixed,
  ShoppingCart,
  TrendingUp,
  FileText,
  Award,
  Sparkles,
};

export function ServiceItem({ service, index }: { service: (typeof SERVICES)[number] & { index?: number }; index?: number }) {
  const Icon = iconMap[service.icon] ?? BarChart3;
  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-all duration-300 group-hover:scale-[2.5] group-hover:bg-primary/10" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="relative mt-5 font-display text-lg font-semibold leading-snug">
        {service.title}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short}
      </p>
      <Link
        href={`/services/${service.slug}`}
        className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
      >
        Learn More
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const card = cards[i];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const go = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = (track.children[0] as HTMLElement)?.getBoundingClientRect();
    if (!card) return;
    track.scrollBy({ left: dir * (card.width + 24), behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cardW = (track.children[0] as HTMLElement)?.getBoundingClientRect().width ?? 0;
        const idx = Math.round((track.scrollLeft + 12) / (cardW + 24));
        setActive(Math.max(0, Math.min(SERVICES.length - 1, idx)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        go(1);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="bg-radial-primary absolute right-0 top-0 h-[380px] w-[380px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Everything Your Business Needs to"
          highlight="Grow Online"
          description="From ranking on Google to websites that convert — one accountable partner for your entire digital presence."
        />

        <Reveal className="mt-12">
          <div
            className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth pb-4"
            ref={trackRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.slug}
                className="w-[92%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <ServiceItem service={{ ...s, index: i }} />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous services"
            className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            {SERVICES.map((s, i) => (
              <button
                key={s.slug}
                onClick={() => goTo(i)}
                aria-label={`Go to service ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active ? "w-7 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next services"
            className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}