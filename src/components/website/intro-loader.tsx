"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function IntroLoader() {
  const [show, setShow] = useState(true);
  const [complete, setComplete] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Show only once per browser session, only on the initial page load.
    const seen = sessionStorage.getItem("mdi_intro_seen");
    if (seen) {
      setShow(false);
      return;
    }

    const t1 = setTimeout(() => setComplete(true), 2100);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("mdi_intro_seen", "1");
      setShow(false);
    }, 2650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-navy"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          aria-hidden
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/30 blur-[110px] animate-blob" />
            <div className="absolute right-1/4 top-[60%] h-64 w-64 rounded-full bg-sky-400/20 blur-[100px] animate-blob" />
            <div className="absolute left-1/4 top-[10%] h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px] animate-blob" />
            <div className="absolute inset-0 bg-grid-navy opacity-40" />
          </motion.div>

          {/* Logo */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-2xl shadow-blue-600/40"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
            >
              MARKETA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-1 font-display text-lg font-medium uppercase tracking-[0.35em] text-sky-300"
            >
              Digital IT
            </motion.p>

            {/* Animated lines */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="mt-6 h-px w-48 origin-center bg-gradient-to-r from-transparent via-sky-400/70 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 0.85, duration: 0.9 }}
              className="mt-5 text-sm font-medium uppercase text-slate-300"
            >
              Grow. Rank. Convert.
            </motion.p>
          </div>

          {/* Bottom loading bar */}
          <div className="absolute bottom-16 w-40">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.1, ease: "easeInOut" }}
              />
            </div>
          </div>

          {complete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-navy"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}