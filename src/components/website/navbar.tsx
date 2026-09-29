"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/60 shadow-sm"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/gallery/Marketa Digital it.png"
            alt="Marketa Digital IT"
            width={570}
            height={321}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button asChild variant="gradient" size="default">
            <Link href="/contact">Get Free Consultation</Link>
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-5 py-4">
                <Image
                  src="/gallery/Marketa Digital it.png"
                  alt="Marketa Digital IT"
                  width={570}
                  height={321}
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-5">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-primary/5 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-3 border-t p-5">
                <Button asChild variant="gradient" className="w-full">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Get Free Consultation
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}