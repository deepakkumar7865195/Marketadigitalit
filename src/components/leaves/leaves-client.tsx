"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Palmtree, Paperclip, Send, X } from "lucide-react";
import { daysBetween, formatDate } from "@/lib/format";
import type { Profile } from "@/types";
import { actionApplyLeave, actionCancelLeave, actionReviewLeave } from "@/lib/actions";
import { getBrowserClient, uploadToBucket } from "@/lib/upload";
import type { LeaveRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface LeaveWithProfile extends LeaveRequest {
  profiles?: { id: string; full_name: string; profile_photo_url: string | null; department: string | null } | null;
}

interface Props {
  myLeaves: LeaveWithProfile[];
  allLeaves: LeaveWithProfile[];
  currentUser: Profile;
  isManagement: boolean;
  canApply?: boolean;
}

const TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Paid Leave",
  "Unpaid Leave",
  "Work From Home",
  "Other",
] as const;

export function LeavesClient({ myLeaves, allLeaves, currentUser, isManagement, canApply = true }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [reviewing, setReviewing] = useState<LeaveWithProfile | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const leavesToShow = isManagement ? allLeaves : myLeaves;

  const balances = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of myLeaves) {
      if (l.status === "Approved") {
        counts[l.leave_type] = (counts[l.leave_type] ?? 0) + l.total_days;
      }
    }
    return counts;
  }, [myLeaves]);

  async function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      leaveType: String(form.get("leaveType") ?? "Casual Leave"),
      startDate: String(form.get("startDate") ?? ""),
      endDate: String(form.get("endDate") ?? ""),
      reason: String(form.get("reason") ?? ""),
      halfDay: (form.get("halfDay") as string | null) === "on",
    };
    setSubmitting(true);
    let path: string | null = null;
    if (attachment) {
      try {
        const supabase = await getBrowserClient();
        path = await uploadToBucket(
          supabase,
          "leave-attachments",
          `leave-attachments/${currentUser.id}/${Date.now()}-${attachment.name.replace(/[^\w.-]/g, "_")}`,
          attachment,
          attachment.type || "application/octet-stream"
        );
      } catch {
        toast.error("Attachment upload failed. Try again.");
        setSubmitting(false);
        return;
      }
    }
    const result = await actionApplyLeave(values, path);
    setSubmitting(false);
    if (result.success) {
      toast.success("Leave request submitted");
      e.currentTarget.reset();
      setAttachment(null);
      router.refresh();
    } else toast.error(result.error ?? "Submission failed");
  }

  async function cancel(l: LeaveWithProfile) {
    setBusyId(l.id);
    const result = await actionCancelLeave(l.id);
    setBusyId(null);
    if (result.success) {
      toast.success("Leave request cancelled");
      router.refresh();
    } else toast.error(result.error ?? "Cancel failed");
  }

  async function submitReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reviewing) return;
    const form = new FormData(e.currentTarget);
    setSavingReview(true);
    const result = await actionReviewLeave(reviewing.id, {
      status: String(form.get("status") ?? "Approved"),
      reviewNote: String(form.get("reviewNote") ?? "") || null,
    });
    setSavingReview(false);
    if (result.success) {
      toast.success("Leave reviewed");
      setReviewing(null);
      router.refresh();
    } else toast.error(result.error ?? "Review failed");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {canApply ? (
          <form onSubmit={handleApply} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm" noValidate>
            <h3 className="flex items-center gap-2 font-display text-base font-semibold">
              <Palmtree className="h-4 w-4 text-primary" /> Apply for Leave
            </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select id="leaveType" name="leaveType" defaultValue="Casual Leave">
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground hover:border-primary">
                <Paperclip className="h-4 w-4" />
                {attachment ? attachment.name : "Attach document (optional)"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" name="startDate" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" name="endDate" type="date" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea id="reason" name="reason" rows={3} required placeholder="Please share the reason for your leave" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="halfDay" className="h-4 w-4 rounded border-input accent-primary" />
            Applied for half day only
          </label>
          <div className="flex justify-end">
            <Button type="submit" variant="gradient" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {submitting ? "Applying..." : "Submit Request"}
            </Button>
          </div>
        </form>
        ) : null}

        <div className={`rounded-xl border bg-card p-5 shadow-sm${canApply ? "" : " lg:col-span-2"}`}>
          <h3 className="mb-4 font-display text-base font-semibold">My Leave Balance (Approved)</h3>
          {Object.keys(balances).length === 0 ? (
            <p className="text-sm text-muted-foreground">No approved leaves yet this period.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(balances).map(([type, days]) => (
                <div key={type} className="rounded-xl bg-muted/50 p-4">
                  <p className="text-2xl font-bold text-primary">{days}<span className="ml-1 text-sm text-muted-foreground">days</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">{type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">
            {isManagement ? "All Leave Requests" : "My Leave Requests"}
          </h3>
          <span className="text-xs text-muted-foreground">{leavesToShow.filter((l) => l.status === "Pending").length} pending</span>
        </div>
        {leavesToShow.length === 0 ? (
          <EmptyState icon={Palmtree} title="No leave requests" description="Apply for leave to see it here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {isManagement ? <th className="pb-2 font-semibold">Employee</th> : null}
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Dates</th>
                  <th className="pb-2 font-semibold">Days</th>
                  <th className="pb-2 font-semibold">Status</th>
                  {isManagement ? <th className="pb-2 text-right font-semibold">Action</th> : <th className="pb-2 text-right font-semibold">Cancel</th>}
                </tr>
              </thead>
              <tbody>
                {leavesToShow.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    {isManagement ? (
                      <td className="py-2.5">
                        <span className="flex items-center gap-2 font-medium">
                          <UserAvatar name={l.profiles?.full_name} photoPath={l.profiles?.profile_photo_url} className="h-7 w-7" />
                          {l.profiles?.full_name ?? "Employee"}
                        </span>
                      </td>
                    ) : null}
                    <td className="py-2.5">{l.leave_type}</td>
                    <td className="py-2.5">{formatDate(l.start_date)} → {formatDate(l.end_date)}</td>
                    <td className="py-2.5 font-semibold">{l.total_days}</td>
                    <td className="py-2.5"><StatusBadge status={l.status} /></td>
                    <td className="py-2.5 text-right">
                      {l.status === "Pending" ? (
                        isManagement ? (
                          <Button variant="outline" size="sm" onClick={() => setReviewing(l)} disabled={busyId === l.id}>
                            Review
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => cancel(l)} disabled={busyId === l.id}>
                            <X className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                        )
                      ) : l.review_note ? (
                        <span className="text-xs text-muted-foreground">{l.review_note}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!reviewing} onOpenChange={(v) => !v && setReviewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Review Leave — {reviewing?.profiles?.full_name ?? "Employee"}
            </DialogTitle>
          </DialogHeader>
          {reviewing ? (
            <form onSubmit={submitReview} className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <p><span className="text-muted-foreground">Type:</span> <span className="font-semibold">{reviewing.leave_type}</span></p>
                <p><span className="text-muted-foreground">Dates:</span> {formatDate(reviewing.start_date)} → {formatDate(reviewing.end_date)} ({reviewing.total_days} days)</p>
                {reviewing.reason ? (
                  <p className="mt-2 text-muted-foreground">“{reviewing.reason}”</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Decision</Label>
                <Select id="status" name="status" defaultValue="Approved">
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reviewNote">Review Note</Label>
                <Textarea id="reviewNote" name="reviewNote" rows={2} placeholder="Optional note for the employee" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReviewing(null)}>Close</Button>
                <Button type="submit" variant="gradient" disabled={savingReview}>
                  {savingReview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  {savingReview ? "Submitting..." : "Save Decision"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}