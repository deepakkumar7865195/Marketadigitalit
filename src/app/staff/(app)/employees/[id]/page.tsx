import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, Briefcase, CalendarDays, MapPin, ShieldAlert, UserRound } from "lucide-react";
import { requireRole } from "@/lib/auth";
import {
  getAttendanceReport,
  getDailyReports,
  getEmployeeById,
  getLeaves,
  getTasks,
} from "@/lib/queries";
import { formatDate, formatTime, minutesToDuration, timeAgo } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/constants";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { EmployeeRowActions } from "@/components/employees/employee-row-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Employee Profile" };

export default async function EmployeeDetailPage({ params }: Props) {
  const { id } = await params;
  const current = await requireRole(["super_admin", "admin", "manager"]);
  const employee = await getEmployeeById(id);
  if (!employee) notFound();

  const [attendance, tasks, leaves, reports] = await Promise.all([
    getAttendanceReport({ userId: id }),
    getTasks().then((all) => all.filter((t) => t.assigned_to === id)),
    getLeaves().then((all) => all.filter((l) => l.user_id === id)),
    getDailyReports().then((all) => all.filter((r) => r.user_id === id)),
  ]);

  const presentDays = attendance.filter((a) => a.status === "Present" || a.status === "Late");
  const workTime = presentDays.reduce((sum, a) => sum + (a.work_minutes ?? 0), 0);

  return (
    <div className="space-y-6">
      <Link href="/staff/employees" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Employees
      </Link>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <UserAvatar
                name={employee.full_name}
                photoPath={employee.profile_photo_url}
                className="-mt-14 h-24 w-24 rounded-2xl border-4 border-background shadow-lg"
                fallbackClassName="bg-primary text-lg text-white"
              />
              <div className="pb-1">
                <h1 className="font-display text-2xl font-bold">{employee.full_name}</h1>
                <p className="text-sm text-muted-foreground">
                  {employee.designation ?? "Employee"}
                  {employee.department ? ` · ${employee.department}` : ""}
                </p>
              </div>
            </div>
            <EmployeeRowActions employee={employee} canDelete={current.role === "super_admin"} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile icon={AtSign} label="Email" value={employee.email} />
            <InfoTile icon={UserRound} label="Employee Code" value={employee.employee_code ?? "—"} />
            <InfoTile icon={Briefcase} label="Role" value={ROLE_LABELS[employee.role] ?? employee.role} />
            <InfoTile icon={CalendarDays} label="Joined" value={formatDate(employee.joining_date)} />
            <InfoTile icon={MapPin} label="Address" value={employee.address ?? "—"} />
            <InfoTile icon={ShieldAlert} label="Status" value={employee.status} isBadge />
            <InfoTile icon={CalendarDays} label="Attendance Records" value={`${attendance.length}`} />
            <InfoTile icon={CalendarDays} label="Total Work Time" value={minutesToDuration(workTime)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold">Skills & Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{employee.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Emergency Contact</dt>
              <dd className="font-medium">{employee.emergency_contact ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Account Created</dt>
              <dd className="font-medium">{timeAgo(employee.created_at)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Open Tasks</h2>
            <Link href="/staff/tasks" className="text-xs font-medium text-primary hover:underline">All tasks</Link>
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon={Briefcase} title="No tasks" description="No tasks assigned yet." className="py-8" />
          ) : (
            <ul className="space-y-2.5">
              {tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.projects?.name ?? "No project"} · due {formatDate(t.due_date)}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-display text-base font-semibold">Recent Attendance ({attendance.length})</h2>
        {attendance.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No attendance records" description="No attendance found for this employee." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">In</th>
                  <th className="pb-2 font-semibold">Out</th>
                  <th className="pb-2 font-semibold">Duration</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 12).map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{formatDate(a.attendance_date)}</td>
                    <td className="py-2.5">{formatTime(a.clock_in)}</td>
                    <td className="py-2.5">{formatTime(a.clock_out)}</td>
                    <td className="py-2.5">{minutesToDuration(a.work_minutes)}</td>
                    <td className="py-2.5"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold">Leave History ({leaves.length})</h2>
          {leaves.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No leaves" description="No leave requests found." className="py-8" />
          ) : (
            <ul className="space-y-3">
              {leaves.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{l.leave_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(l.start_date)} → {formatDate(l.end_date)} · {l.total_days} day(s)
                    </p>
                  </div>
                  <StatusBadge status={l.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold">Daily Work Reports ({reports.length})</h2>
          {reports.length === 0 ? (
            <EmptyState icon={Briefcase} title="No reports" description="No daily work reports submitted." className="py-8" />
          ) : (
            <ul className="space-y-3">
              {reports.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.work_summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(r.report_date)} · {r.hours_spent}h
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  isBadge,
}: {
  icon: typeof AtSign;
  label: string;
  value: string;
  isBadge?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isBadge ? (
          <div className="mt-1"><StatusBadge status={value} /></div>
        ) : (
          <p className="text-sm font-medium break-words">{value}</p>
        )}
      </div>
    </div>
  );
}