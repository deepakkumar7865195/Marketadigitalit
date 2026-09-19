"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Settings as SettingsIcon } from "lucide-react";
import type { CompanySetting } from "@/types";
import { actionSaveSettings } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsClient({ settings }: { settings: CompanySetting | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    const result = await actionSaveSettings({
      companyName: String(form.get("companyName") ?? settings?.company_name ?? "Marketa Digital IT"),
      officeStartTime: String(form.get("officeStartTime") ?? "09:30"),
      officeEndTime: String(form.get("officeEndTime") ?? "18:30"),
      lateGraceMinutes: Number(form.get("lateGraceMinutes") ?? 15),
      halfDayMinutes: Number(form.get("halfDayMinutes") ?? 240),
      timezone: String(form.get("timezone") ?? "Asia/Kolkata"),
    });
    setSaving(false);
    if (result.success) {
      toast.success("Settings saved");
      router.refresh();
    } else toast.error(result.error ?? "Save failed");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <SettingsIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">Company Settings</h2>
          <p className="text-sm text-muted-foreground">Office policy and attendance rules</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organisation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" required defaultValue={settings?.company_name ?? "Marketa Digital IT"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" required defaultValue={settings?.timezone ?? "Asia/Kolkata"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Office Hours & Attendance Rules</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="officeStartTime">Office Start Time</Label>
              <Input id="officeStartTime" name="officeStartTime" type="time" required defaultValue={settings?.office_start_time ?? "09:30"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="officeEndTime">Office End Time</Label>
              <Input id="officeEndTime" name="officeEndTime" type="time" required defaultValue={settings?.office_end_time ?? "18:30"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lateGraceMinutes">Late Grace Period (minutes)</Label>
              <Input id="lateGraceMinutes" name="lateGraceMinutes" type="number" min={0} max={180} required defaultValue={settings?.late_grace_minutes ?? 15} />
              <p className="text-xs text-muted-foreground">Arrivals within this window are marked Present.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="halfDayMinutes">Half-Day Threshold (minutes)</Label>
              <Input id="halfDayMinutes" name="halfDayMinutes" type="number" min={0} max={600} required defaultValue={settings?.half_day_minutes ?? 240} />
              <p className="text-xs text-muted-foreground">Work time below this marks the day as Half Day.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gradient" disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}