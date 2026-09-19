"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Globe,
  LineChart,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { STATS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

const metrics = [
  { label: "Organic Traffic", value: "+340%", icon: TrendingUp },
  { label: "Avg. ROAS", value: "4.7x", icon: LineChart },
  { label: "Leads / Month", value: "312", icon: MousePointerClick },
  { label: "Map Pack #1", value: "92%", icon: Globe },
];

export function Hero() {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="bg-radial-primary absolute -left-32 top-8 h-[480px] w-[480px]" />
      <div className="bg-radial-accent absolute -right-24 top-1/3 h-[420px] w-[420px]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left: copy */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                #1 Digital Marketing &amp; Web Development Agency
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Grow Your Business
              <br />
              with{" "}
              <span className="text-gradient-animated">Powerful Digital</span>{" "}
              <span className="text-gradient-animated">Marketing</span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Marketa Digital IT helps businesses increase visibility, generate quality leads,
              build powerful websites, and grow their online presence with data-driven digital
              marketing strategies.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3.5">
              <Button asChild variant="gradient" size="lg">
                <Link href="/contact">
                  Get Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore Services</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border bg-card/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="font-display text-2xl font-bold text-primary">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: animated dashboard mockup */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 30 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="bg-radial-accent absolute -inset-8" />
            {/* Main dashboard card */}
            <div className="relative rounded-2xl border bg-card p-5 shadow-glow">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">Growth Overview</p>
                    <p className="text-xs text-muted-foreground">marketadigitalit.com</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  Live
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Visitors", value: "24.8k", up: "+38%" },
                  { label: "Leads", value: "1.2k", up: "+52%" },
                  { label: "Revenue", value: "₹18L", up: "+44%" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="mt-1 font-display text-base font-bold">{m.value}</p>
                    <p className="text-xs font-semibold text-emerald-600">{m.up}</p>
                  </div>
                ))}
              </div>

              {/* Chart bars */}
              <div className="mt-5 flex h-28 items-end gap-2">
                {[35, 55, 42, 70, 60, 85, 75, 92, 68, 98, 82, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-sky-400"
                    style={i % 4 === 3 ? { background: "linear-gradient(to top, #7c3aed, #a78bfa)" } : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Floating metric cards */}
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.15, duration: 0.6 }}
                className="absolute animate-float rounded-xl border bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur"
                style={{
                  top: `${[-18, 42, 78, -8][i]}%`,
                  left: [`-30px`, `auto`, `auto`, `-52px`][i],
                  right: [`auto`, `-28px`, `-40px`, `auto`][i],
                  animationDelay: `${i * 1.2}s`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${["bg-blue-50 text-blue-600", "bg-emerald-50 text-emerald-600", "bg-violet-50 text-violet-600", "bg-sky-50 text-sky-600"][i]}`}>
                    <m.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom badge */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-lg"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-semibold">Ranking #1 on Google</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t pt-8 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 50+ Businesses Served</span>
          <span className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Data-Driven ROI</span>
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> 100+ Projects Delivered</span>
        </motion.div>
      </div>
    </section>
  );
}