import Link from "next/link";
import { Sparkles } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export default function StaffAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-10">
      <div className="absolute inset-0 bg-grid-navy opacity-40" />
      <div className="bg-radial-primary absolute -left-24 top-10 h-96 w-96" />
      <div className="bg-radial-accent absolute -bottom-24 -right-20 h-96 w-96" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-lg shadow-blue-600/30">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-bold text-white">
            Marketa Digital<span className="text-sky-400"> IT</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-7 shadow-2xl backdrop-blur sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {COMPANY.name} · Employee Portal
        </p>
      </div>
    </div>
  );
}