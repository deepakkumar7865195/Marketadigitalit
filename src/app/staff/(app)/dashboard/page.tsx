import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
  Palette,
  Users,
  Wallet,
} from "lucide-react";
import { getCurrentUser, isManagement } from "@/lib/auth";
import {
  getAttendanceSeries,
  getAttendanceForDate,
  getDashboardStats,
  getMyDailyReports,
  getMyLeaves,
  getMyTasks,
  getPendingLeaves,
  getProjectProgressData,
  getUpcomingHolidays,
  getWebsiteLeads,
} from "@/lib/queries";
import { formatDate, formatDateTime, todayStr } from "@/lib/format";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { AttendancePie } from "@/components/dashboard/attendance-pie";
import { PendingLeaveClient } from "@/components/dashboard/pending-leaves";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await getCurrentUser();
  const management = isManagement(profile?.role);
  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  let pieData = [
    { name: "Present", value: 0, color: "#10b981" },
    { name: "Late", value: 0, color: "#f59e0b" },
    { name: "Absent", value: 0, color: "#f43f5e" },
    { name: "On Leave", value: 0, color: "#0ea5e9" },
  ];

  let todayAttendance: Awaited<ReturnType<typeof getAttendanceForDate>> = [];
  let series: Awaited<ReturnType<typeof getAttendanceSeries>> = [];
  let stats: Awaited<ReturnType<typeof getDashboardStats>> | null = null;
  let projectRows: Awaited<ReturnType<typeof getProjectProgressData>> = [];
  let leads: Awaited<ReturnType<typeof getWebsiteLeads>> = [];
  let pendingLeaves: Awaited<ReturnType<typeof getPendingLeaves>> = [];

  const upcoming = await getUpcomingHolidays();

  if (management && profile) {
    const [s, att, st, proj, web, pv] = await Promise.all([
      getAttendanceSeries(14),
      getAttendanceForDate(todayStr()),
      getDashboardStats(),
      getProjectProgressData(),
      getWebsiteLeads(),
      getPendingLeaves(),
    ]);
    series = s;
    todayAttendance = (att as typeof todayAttendance) ?? [];
    stats = st;
    projectRows = proj;
    leads = web;
    pendingLeaves = pv;
    pieData = [
      { name: "Present", value: stats.present, color: "#10b981" },
      { name: "Late", value: stats.late, color: "#f59e0b" },
      { name: "Absent", value: stats.absent, color: "#f43f5e" },
      { name: "On Leave", value: stats.on_leave, color: "#0ea5e9" },
    ];
  }

  const myTasks = management ? [] : await getMyTasks();
  const myReports = management ? [] : await getMyDailyReports();
  const myLeaves = management ? [] : await getMyLeaves();

  const attendedToday = management ? null : (await getAttendanceForDate(todayStr())).find((a) => a.user_id === profile?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-bold">
          {greeting}, {profile?.full_name.split(" ")[0] ?? "there"} 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          {formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {management && stats ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Active Employees" value={stats.total_employees} icon={Users} tone="primary" sub={`${(await getDashboardStats()).absent} absent today`} />
            <StatCard label="Present Today" value={stats.present + stats.late} icon={CheckCircle2} tone="success" sub={`${stats.late} late`} />
            <StatCard label="On Leave" value={stats.on_leave} icon={Palette} tone="warning" sub={`${pendingLeaves.length} pending approval`} />
            <StatCard label="Active Clients" value={stats.clients} icon={Building2} tone="navy" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Active Projects" value={stats.active_projects} icon={FolderKanban} tone="info" />
            <StatCard label="Pending Tasks" value={stats.pending_tasks} icon={ListTodo} tone="warning" />
            <StatCard label="Completed Tasks" value={stats.completed_tasks} icon={CheckCircle2} tone="success" />
            <StatCard label="New Leads" value={leads.length} icon={Wallet} tone="primary" sub="Website enquiries" />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Attendance Status" value={attendedToday?.status ?? "Not marked"} icon={Clock} tone="primary" />
          <StatCard label="My Open Tasks" value={myTasks.filter((t) => t.status !== "Completed").length} icon={ListTodo} tone="warning" />
          <StatCard label="Leaves (Recent)" value={myLeaves.length} icon={Palette} tone="info" />
          <StatCard label="Reports Submitted" value={myReports.length} icon={Briefcase} tone="success" sub="Last 100 days" />
        </div>
      )}

      {management ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Attendance — Last 14 Days</h3>
              <Link href="/staff/attendance" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <AttendanceChart data={series} />
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
            <h3 className="mb-4 font-display text-base font-semibold">Today's Breakdown</h3>
            <AttendancePie data={pieData} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Today's Attendance</h3>
            <Link href="/staff/attendance" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Clock in / out <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {todayAttendance.length === 0 ? (
            <EmptyState icon={Clock} title="No attendance marked yet" description="Attendance records for today will appear here once employees clock in." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 font-semibold">Employee</th>
                    <th className="pb-2 font-semibold">Clock In</th>
                    <th className="pb-2 font-semibold">Clock Out</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            name={a.profiles?.full_name}
                            photoPath={a.profiles?.profile_photo_url}
                            className="h-8 w-8"
                          />
                          <span className="font-medium">{a.profiles?.full_name ?? "Employee"}</span>
                        </div>
                      </td>
                      <td className="py-2.5">{formatDateTime(a.clock_in)}</td>
                      <td className="py-2.5">{formatDateTime(a.clock_out)}</td>
                      <td className="py-2.5"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-display text-base font-semibold">Upcoming Holidays</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming holidays booked.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((h) => (
                  <li key={h.id} className="flex items-center gap-3">
                    <span className="flex h-9 w-11 flex-col items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <span className="text-sm font-bold leading-none">{new Date(h.holiday_date).getDate()}</span>
                      <span className="text-[9px] uppercase">{new Date(h.holiday_date).toLocaleString("en-IN", { month: "short" })}</span>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{h.title}</p>
                      <p className="text-xs text-muted-foreground">{h.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/staff/holidays" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all holidays <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {management ? (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">Pending Leave Requests</h3>
                <Link href="/staff/leaves" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <PendingLeaveClient pending={pendingLeaves} />
            </div>
          ) : null}

          {management ? (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">Latest Leads</h3>
                <Link href="/staff/leads" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {leads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No website leads yet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {leads.slice(0, 4).map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{l.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{l.service ?? l.email}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">{l.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {management ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Project Progress</h3>
            <Link href="/staff/projects" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Manage projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {projectRows.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to start tracking progress." />
          ) : (
            <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
              {projectRows.slice(0, 6).map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">
                      {String(p.id).slice(0, 6)} — Project
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <Progress value={p.progress} className="h-2" />
                  <p className="text-right text-xs text-muted-foreground">{p.progress}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">My Tasks</h3>
              <Link href="/staff/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {myTasks.length === 0 ? (
              <EmptyState icon={ListTodo} title="No tasks assigned" description="Task assigned to you will show up here." />
            ) : (
              <ul className="space-y-2.5">
                {myTasks.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{t.title}</span>
                    <StatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Recent Daily Reports</h3>
              <Link href="/staff/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Submit report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {myReports.length === 0 ? (
              <EmptyState icon={Briefcase} title="No reports yet" description="Submit your first daily work report from the Tasks page." />
            ) : (
              <ul className="space-y-2.5">
                {myReports.slice(0, 4).map((r) => (
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
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-gradient-to-r from-sky-50 to-blue-50 p-4 text-sm">
        <CalendarDays className="h-5 w-5 text-primary" />
        <p className="flex-1 text-muted-foreground">
          Need a day off? Plan ahead and request leave in advance so your team can cover your work.
        </p>
        <Link href="/staff/leaves" className="font-semibold text-primary hover:underline">
          Request Leave
        </Link>
      </div>
    </div>
  );
}