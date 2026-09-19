import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  sub?: string;
  tone?: "primary" | "success" | "warning" | "destructive" | "info" | "navy";
  loading?: boolean;
}

const tones = {
  primary: "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  destructive: "bg-rose-50 text-rose-600",
  info: "bg-sky-50 text-sky-600",
  navy: "bg-navy text-white",
};

export function StatCard({ label, value, icon: Icon, sub, tone = "primary", loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border bg-card p-5 shadow-sm">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="mt-4 h-6 w-16 rounded bg-muted" />
        <div className="mt-2 h-3 w-24 rounded bg-muted" />
      </div>
    );
  }
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-display text-3xl font-bold tracking-tight">{value}</p>
          {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}