"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Holiday } from "@/types";
import { actionCreateHoliday, actionDeleteHoliday, actionUpdateHoliday } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

interface Props {
  holidays: Holiday[];
  isAdmin: boolean;
}

const TYPES = ["National Holiday", "Festival", "Company Holiday", "Optional Holiday"] as const;

export function HolidaysClient({ holidays, isAdmin }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [saving, setSaving] = useState(false);

  const upcoming = holidays.filter((h) => h.holiday_date >= new Date().toISOString().split("T")[0]);
  const past = holidays.filter((h) => h.holiday_date < new Date().toISOString().split("T")[0]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(h: Holiday) {
    setEditing(h);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      title: String(form.get("title") ?? ""),
      holidayDate: String(form.get("holidayDate") ?? ""),
      type: String(form.get("type") ?? "Company Holiday"),
      description: String(form.get("description") ?? "") || null,
    };
    setSaving(true);
    const result = editing ? await actionUpdateHoliday(editing.id, values) : await actionCreateHoliday(values);
    setSaving(false);
    if (result.success) {
      toast.success(editing ? "Holiday updated" : "Holiday added");
      setDialogOpen(false);
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  async function remove(h: Holiday) {
    if (!confirm(`Delete "${h.title}"?`)) return;
    const result = await actionDeleteHoliday(h.id);
    if (result.success) {
      toast.success("Holiday deleted");
      router.refresh();
    } else toast.error(result.error ?? "Delete failed");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Holidays {new Date().getFullYear()}</h2>
          <p className="text-sm text-muted-foreground">{holidays.length} holidays this year</p>
        </div>
        {isAdmin ? (
          <Button onClick={openCreate} variant="gradient">
            <Plus className="mr-2 h-4 w-4" /> Add Holiday
          </Button>
        ) : null}
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
          <CalendarDays className="h-4 w-4 text-primary" /> Upcoming
        </h3>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming holidays" description="New holidays will appear here." className="py-10" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((h) => (
              <li key={h.id} className="flex items-start gap-3 rounded-xl border p-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="font-display text-lg font-bold leading-none">{new Date(h.holiday_date).getDate()}</span>
                  <span className="text-[10px] uppercase">{new Date(h.holiday_date).toLocaleString("en-IN", { month: "short" })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(h.holiday_date, { weekday: "long", day: "numeric", month: "long" })}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px]">{h.type}</Badge>
                </div>
                {isAdmin ? (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(h)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(h)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {past.length > 0 ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" /> Past Holidays
          </h3>
          <ul className="divide-y">
            {past.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(h.holiday_date)} · {h.type}</p>
                </div>
                {isAdmin ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => remove(h)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-primary" />
              {editing ? "Edit Holiday" : "Add Holiday"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={editing?.title ?? ""} placeholder="e.g. Diwali" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="holidayDate">Date *</Label>
                <Input id="holidayDate" name="holidayDate" type="date" required defaultValue={editing?.holiday_date?.slice(0, 10) ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select id="type" name="type" defaultValue={editing?.type ?? "Company Holiday"}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} defaultValue={editing?.description ?? ""} placeholder="Optional note" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="gradient" disabled={saving}>
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Holiday"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}