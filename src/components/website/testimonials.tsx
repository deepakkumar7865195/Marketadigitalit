"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TESTIMONIALS } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/website/section-heading";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;
  const t = TESTIMONIALS[index];

  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Clients"
          highlight="Say"
          description="Real words from real businesses we've helped grow."
        />

        <div className="relative mt-12">
          <Quote className="absolute -top-4 left-4 h-16 w-16 text-primary/10" />
          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-lg sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < t.rating ? "fill-amber-400 text-amber-400" : "text-border"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-relaxed text-foreground sm:text-xl">
                  “{t.text}”
                </p>
                <div className="mt-7 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-sky-400 font-semibold text-white">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-card transition hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-primary" : "w-2 bg-border"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => (i + 1) % count)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-card transition hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}