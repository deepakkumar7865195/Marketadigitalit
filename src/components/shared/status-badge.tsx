import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/constants";

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  const key = status ?? "pending";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[key] ?? STATUS_STYLES.pending,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status ?? "—"}
    </span>
  );
}