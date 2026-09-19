import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, NAV_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse all pages on marketadigitalit.com.",
};

export default function SitemapPage() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Sitemap</h1>
        <p className="mt-3 text-muted-foreground">Every page on marketadigitalit.com.</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Main Pages</h2>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary hover:underline">
                    {l.href === "/" ? "Home" : l.label}
                  </Link>
                </li>
              ))}
              <li><Link href="/privacy-policy" className="text-sm text-primary hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-primary hover:underline">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Services</h2>
            <ul className="mt-3 space-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-primary hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}