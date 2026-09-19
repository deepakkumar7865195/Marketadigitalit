import { getCurrentUser, isManagement } from "@/lib/auth";
import {
  getAttendanceForCurrentUser,
  getAttendanceForDate,
  getAttendanceMatrix,
  getEmployees,
  getHolidays,
} from "@/lib/queries";
import { formatDate, minutesToDuration, todayStr } from "@/lib/format";
import { ClockCard } from "@/components/attendance/clock-card";
import { AttendanceRoster } from "@/components/attendance/attendance-roster";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata = { title: "Attendance" };

interface Props {
  searchParams: Promise<{ month?: string }>;
}

export default async function AttendancePage({ searchParams }: Props) {
  const { month: monthParam } = await searchParams;
  const { profile } = await getCurrentUser();
  const management = isManagement(profile?.role);
  const month = monthParam && /^\d{4}-\d{2}$/.test(monthParam) ? monthParam : todayStr().slice(0, 7);
  const today = todayStr();
  const todayRecords = await getAttendanceForDate(today);
  const todayRecord = todayRecords.find((a) => a.user_id === profile?.id);

  const [matrix, employees, holidays, myHistory] = management
    ? await Promise.all([
        getAttendanceMatrix(month),
        getEmployees(),
        getHolidays(Number(month.slice(0, 4))),
        Promise.resolve([]),
      ])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        getHolidays(Number(month.slice(0, 4))),
        getAttendanceForCurrentUser(),
      ]);

  const year = Number(month.slice(0, 4));

  return (
    <div className="space-y-6">
      {management ? (
        <>
          <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <p className="mb-1 font-display text-base font-semibold">Attendance Roster — {formatDate(new Date(year, Number(month.slice(5)) - 1, 1), { month: "long", year: "numeric" })}</p>
            <p className="text-sm text-muted-foreground">
              Click any day cell to correct an entry or mark a leave day. Admins can adjust clock times.
            </p>
          </div>
          <AttendanceRoster
            month={month}
            users={employees}
            matrix={matrix}
            holidays={holidays}
            isAdmin={profile?.role === "admin" || profile?.role === "super_admin"}
            isManagement={management}
          />
        </>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <ClockCard
              userId={profile?.id ?? ""}
              todayRecord={todayRecord ?? undefined}
            />
            <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 font-display text-base font-semibold">Your Recent Attendance</h2>
              {myHistory.length === 0 ? (
                <EmptyState title="No attendance yet" description="Once you clock in, your records will appear here." />
              ) : (
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
                    {myHistory.slice(0, 30).map((a) => (
                      <tr key={a.id} className="border-b last:border-0">
                        <td className="py-2.5 font-medium">{formatDate(a.attendance_date)}</td>
                        <td className="py-2.5">{a.clock_in ? new Date(a.clock_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—"}</td>
                        <td className="py-2.5">{a.clock_out ? new Date(a.clock_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—"}</td>
                        <td className="py-2.5">{minutesToDuration(a.work_minutes)}</td>
                        <td className="py-2.5"><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-display text-base font-semibold">Company Holidays</h3>
            {holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground">No holidays announced this year yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {holidays.map((h) => (
                  <div key={h.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <p className="text-left text-lg font-bold text-primary">{new Date(h.holiday_date).getDate()}</p>
                    <p className="text-xs uppercase text-muted-foreground">{new Date(h.holiday_date).toLocaleString("en-IN", { month: "short", year: "numeric" })}</p>
                    <p className="mt-1 text-sm font-semibold">{h.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}