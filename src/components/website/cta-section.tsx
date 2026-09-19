import Link from "next/link";
import { MessageCircle, Phone, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/website/reveal";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center shadow-2xl sm:px-12 lg:py-20">
            <div className="absolute inset-0 bg-grid-navy opacity-40" />
            <div className="bg-radial-primary absolute -left-20 -top-20 h-72 w-72" />
            <div className="bg-radial-accent absolute -bottom-24 -right-16 h-72 w-72" />
            <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-600/25 blur-[90px]" />

            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-lg shadow-blue-600/40">
                <Rocket className="h-7 w-7 text-white" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Grow Your Business?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Get a free strategy call and a clear, no-obligation growth plan for your business.
                Limited onboarding slots each month.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                <Button asChild variant="gradient" size="lg">
                  <Link href="/contact">Get Free Consultation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="https://wa.me/917870241157" target="_blank" rel="noreferrer">
                    <MessageCircle className="h-5 w-5 text-emerald-400" />
                    WhatsApp Us
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="tel:+917870241157">
                    <Phone className="h-5 w-5 text-sky-400" />
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}