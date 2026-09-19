"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { formatDate } from "@/lib/format";
import { actionReviewLeave } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";

export interface PendingLeaveRow {
  id: string;
  user_id: string;
  leave_type: string | null;
  start_date: string;
  end_date: string;
  reason: string | null;
  profiles?: {
    full_name: string | null;
    profile_photo_url: string | null;
    department?: string | null;
  } | null;
}

export function PendingLeaveClient({ pending }: { pending: PendingLeaveRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function review(id: string, status: "Approved" | "Rejected") {
    setBusyId(id);
    const result = await actionReviewLeave(id, { status, reviewNote: null });
    setBusyId(null);
    if (result.success) {
      toast.success(`Leave ${status === "Approved" ? "approved" : "rejected"} — employee notified by email & WhatsApp`);
      router.refresh();
    } else toast.error(result.error ?? "Review failed");
  }

  if (pending.length === 0)
    return <p className="text-sm text-muted-foreground">No pending leave requests.</p>;

  return (
    <ul className="space-y-3">
      {pending.map((l) => (
        <li key={l.id} className="rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <UserAvatar name={l.profiles?.full_name} photoPath={l.profiles?.profile_photo_url} className="h-8 w-8" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{l.profiles?.full_name ?? "Employee"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {l.leave_type} · {formatDate(l.start_date)}
                {l.end_date !== l.start_date ? ` → ${formatDate(l.end_date)}` : ""}
              </p>
            </div>
          </div>
          {l.reason ? <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{l.reason}</p> : null}
          <div className="mt-2.5 flex gap-2">
            <Button
              size="sm"
              className="h-7 gap-1 px-2.5 text-xs"
              disabled={busyId === l.id}
              onClick={() => review(l.id, "Approved")}
            >
              {busyId === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 px-2.5 text-xs text-rose-600 hover:text-rose-600"
              disabled={busyId === l.id}
              onClick={() => review(l.id, "Rejected")}
            >
              {busyId === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
              Reject
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}