"use client";

import {
  BarChart3,
  Code2,
  Eye,
  Headset,
  Rocket,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";
import { SectionHeading } from "@/components/website/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/website/reveal";

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Eye,
  Wallet,
  Users,
  Code2,
  Target,
  Headset,
  Rocket,
};

export function WhyUs() {
  return (
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="The Partner That Treats Your Budget"
          highlight="Like Their Own"
          description="We combine strategy, execution and transparency to deliver marketing that actually moves revenue."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((w) => {
            const Icon = iconMap[w.icon] ?? Rocket;
            return (
              <StaggerItem key={w.title}>
                <div className="group h-full rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-sky-400 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}