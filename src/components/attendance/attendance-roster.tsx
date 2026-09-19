"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Palette, Plus, X } from "lucide-react";
import type { AttendanceWithProfile, Holiday, Profile } from "@/types";
import { calendarDays, downloadCSV, formatDate } from "@/lib/format";
import { actionAdminClockAdjust, actionMarkLeaveDays } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  month: string;
  users: Profile[];
  matrix: AttendanceWithProfile[];
  holidays: Holiday[];
  isAdmin: boolean;
  isManagement: boolean;
}

const COLOR: Record<string, string> = {
  Present: "#10b981",
  Late: "#f59e0b",
  Absent: "#f43f5e",
  "Half Day": "#8b5cf6",
  "On Leave": "#0ea5e9",
  Holiday: "#3b82f6",
};

export function AttendanceRoster({ month, users, matrix, holidays, isAdmin, isManagement }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [cellUser, setCellUser] = useState<Profile | null>(null);
  const [cellRecord, setCellRecord] = useState<AttendanceWithProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const year = Number(month.slice(0, 4));
  const monthNum = Number(month.slice(5, 7)) - 1;
  const days = useMemo(() => calendarDays(new Date(year, monthNum, 1)), [year, monthNum]);
  const holidaySet = useMemo(() => new Map(holidays.map((h) => [h.holiday_date, h])), [holidays]);
  const recordsByUser = useMemo(() => {
    const map = new Map<string, Map<string, AttendanceWithProfile>>();
    for (const u of users) map.set(u.id, new Map());
    for (const r of matrix) {
      const dayMap = map.get(r.user_id) ?? new Map<string, AttendanceWithProfile>();
      dayMap.set(r.attendance_date, r);
      map.set(r.user_id, dayMap);
    }
    return map;
  }, [users, matrix]);

  const employees = users.filter((u) => u.status === "active");

  function recordFor(user: Profile, day: Date) {
    const key = day.toISOString().split("T")[0];
    if (holidaySet.has(key)) return "holiday" as const;
    const rec = recordsByUser.get(user.id)?.get(key);
    return rec ?? null;
  }

  function statusFor(user: Profile, day: Date) {
    const r = recordFor(user, day);
    if (r === "holiday") return "Holiday";
    if (!r) return "—";
    return r.status ?? "—";
  }

  function openCell(user: Profile, day: Date) {
    const key = day.toISOString().split("T")[0];
    const rec = recordsByUser.get(user.id)?.get(key) ?? null;
    setCellUser(user);
    setCellRecord(rec);
    setSelectedDate(day);
  }

  function count(user: Profile, statuses: string[]) {
    let n = 0;
    for (const day of days) {
      if (!day) continue;
      const s = statusFor(user, day);
      if (statuses.includes(s)) n++;
    }
    return n;
  }

  async function markLeave(type: "leave" | "undo") {
    if (!cellUser || !selectedDate) return;
    setSaving(true);
    const result = await actionMarkLeaveDays(cellUser.id, selectedDate.toISOString().split("T")[0], type);
    setSaving(false);
    if (result.success) {
      toast.success(type === "leave" ? "Marked as On Leave" : "Leave removed");
      setSelectedDate(null);
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  async function saveAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cellUser || !selectedDate) return;
    const form = new FormData(e.currentTarget);
    setSaving(true);
    const result = await actionAdminClockAdjust({
      userId: cellUser.id,
      date: selectedDate.toISOString().split("T")[0],
      clockIn: (form.get("clockIn") as string) || undefined,
      clockOut: (form.get("clockOut") as string) || undefined,
      status: (form.get("status") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Attendance updated");
      setSelectedDate(null);
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  function exportCSV() {
    const rows: Record<string, unknown>[] = [];
    for (const user of employees) {
      const base = {
        Employee: user.full_name,
        Present: count(user, ["Present"]),
        Late: count(user, ["Late"]),
        "Half Day": count(user, ["Half Day"]),
        Leave: count(user, ["On Leave"]),
        Holiday: count(user, ["Holiday"]),
      } as Record<string, unknown>;
      for (const day of days) {
        if (!day) continue;
        base[day.getDate().toString()] = statusFor(user, day);
      }
      rows.push(base);
    }
    downloadCSV(`attendance-${month}.csv`, rows);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Input
            type="month"
            value={month}
            onChange={(e) => e.target.value && router.push(`/staff/attendance?month=${e.target.value}`)}
            className="w-44"
          />
          <span className="text-sm text-muted-foreground">
            {formatDate(new Date(year, monthNum, 1), { month: "long", year: "numeric" })}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <Legend color="#10b981" label="Present" />
          <Legend color="#f59e0b" label="Late" />
          <Legend color="#f43f5e" label="Absent" />
          <Legend color="#8b5cf6" label="Half Day" />
          <Legend color="#0ea5e9" label="Leave" />
          <Legend color="#3b82f6" label="Holiday" />
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {employees.length === 0 ? (
        <p className="rounded-xl border p-8 text-center text-sm text-muted-foreground">No active employees yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-t-xl border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="sticky left-0 bg-muted/40 px-4 py-3 font-semibold">Employee</th>
                <th className="px-2 py-3 text-center font-semibold">P</th>
                <th className="px-2 py-3 text-center font-semibold">Lt</th>
                <th className="px-2 py-3 text-center font-semibold">A</th>
                <th className="px-2 py-3 text-center font-semibold">H/2</th>
                <th className="px-2 py-3 text-center font-semibold">Lv</th>
                <th className="px-2 py-3 font-semibold">Daily Grid</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((user) => {
                const stats = [
                  count(user, ["Present"]),
                  count(user, ["Late"]),
                  count(user, ["Absent"]),
                  count(user, ["Half Day"]),
                  count(user, ["On Leave"]),
                ];
                return (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="sticky left-0 bg-card px-4 py-2.5">
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.designation ?? user.department ?? "—"}</p>
                    </td>
                    {stats.map((s, i) => (
                      <td key={i} className="px-2 py-2.5 text-center font-semibold tabular-nums">{s || "·"}</td>
                    ))}
                    <td className="px-2 py-2.5">
                      <div className="grid grid-cols-10 gap-1">
                        {days.map((day, i) =>
                          day ? (
                            <button
                              key={i}
                              title={`${formatDate(day)} — ${statusFor(user, day)}`}
                              onClick={() => isManagement && openCell(user, day)}
                              className={`h-4 w-4 rounded-[4px] text-center text-[9px] font-bold leading-4 ${isManagement ? "cursor-pointer hover:ring-2 hover:ring-ring" : "cursor-default"}`}
                              style={{
                                backgroundColor: COLOR[statusFor(user, day)] ?? (day.getDay() === 0 ? "#f1f5f9" : "#e2e8f0"),
                                color: COLOR[statusFor(user, day)] ? "#fff" : "#94a3b8",
                              }}
                            >
                              {day.getDate()}
                            </button>
                          ) : (
                            <span key={i} />
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selectedDate} onOpenChange={(v) => !v && setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cellUser?.full_name} — {selectedDate ? formatDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>
          {cellRecord ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">In</p>
                  <p className="font-semibold">{cellRecord.clock_in ? formatDate(cellRecord.clock_in, { hour: "2-digit", minute: "2-digit" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Out</p>
                  <p className="font-semibold">{cellRecord.clock_out ? formatDate(cellRecord.clock_out, { hour: "2-digit", minute: "2-digit" }) : "—"}</p>
                </div>
              </div>
              <p>
                Status: <span className="font-semibold">{cellRecord.status ?? "—"}</span>
              </p>
              {isManagement && holidaySet.has(selectedDate!.toISOString().split("T")[0]) ? (
                <p className="text-xs text-muted-foreground">This date is a company holiday.</p>
              ) : null}
              <div className="flex gap-2">
                {cellRecord.status !== "On Leave" ? (
                  <Button variant="outline" size="sm" onClick={() => markLeave("leave")}>
                    <Palette className="mr-1.5 h-3.5 w-3.5" /> Mark On Leave
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => markLeave("undo")}>
                    <X className="mr-1.5 h-3.5 w-3.5" /> Undo Leave
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No attendance record for this date. {isManagement ? "You can correct it below." : ""}
            </p>
          )}

          {isAdmin ? (
            <form onSubmit={saveAdjust} className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold">Adjust attendance</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="clockIn">Clock In</Label>
                  <Input id="clockIn" name="clockIn" type="time" defaultValue={cellRecord?.clock_in?.slice(11, 16) ?? ""} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="clockOut">Clock Out</Label>
                  <Input id="clockOut" name="clockOut" type="time" defaultValue={cellRecord?.clock_out?.slice(11, 16) ?? ""} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" name="status" defaultValue={cellRecord?.status ?? "Present"}>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="On Leave">On Leave</option>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" defaultValue={cellRecord?.notes ?? ""} placeholder="Optional" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="gradient" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save Adjustment"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}

          {!cellRecord && isManagement ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markLeave("leave")} disabled={saving}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Mark as On Leave
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}