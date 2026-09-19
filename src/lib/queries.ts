import { createClient } from "@/lib/supabase/server";
import { isAdmin, isManagement } from "@/lib/auth";
import type { Profile } from "@/types";

function toISO(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

// ---------- Employees ----------
export async function getEmployees(search?: string, department?: string, status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`);
  }
  if (department && department !== "all") query = query.eq("department", department);
  if (status && status !== "all") query = query.eq("status", status);

  const { data } = await query;
  return (data as Profile[]) ?? [];
}

export async function getEmployeeById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
  return (data as Profile) ?? null;
}

export async function getDepartments() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("department");
  const set = new Set<string>();
  (data ?? []).forEach((r) => r.department && set.add(r.department));
  return Array.from(set).sort();
}

// ---------- Attendance ----------
export async function getAttendanceForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("attendance_date", { ascending: false })
    .limit(90);
  return data ?? [];
}

export async function getAttendanceForDate(date: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attendance")
    .select("*, profiles(full_name, profile_photo_url, designation, department, role)")
    .eq("attendance_date", date)
    .order("clock_in", { ascending: true });
  return data ?? [];
}

export async function getAttendanceReport(filters: {
  userId?: string;
  from?: string;
  to?: string;
  status?: string;
  department?: string;
}) {
  const supabase = await createClient();
  const { userId, from, to, status, department } = filters;
  let query = supabase
    .from("attendance")
    .select("*, profiles(id, full_name, profile_photo_url, designation, department, role)")
    .order("attendance_date", { ascending: false })
    .limit(500);

  if (userId && userId !== "all") query = query.eq("user_id", userId);
  if (from) query = query.gte("attendance_date", toISO(from));
  if (to) query = query.lte("attendance_date", toISO(to));
  if (status && status !== "all") query = query.eq("status", status);
  if (department && department !== "all")
    query = query.in("profiles.department", [department]).eq("profiles.department", department);

  const { data } = await query;
  return data ?? [];
}

export async function getTodayAttendanceSummary() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("attendance")
    .select("status, user_id")
    .eq("attendance_date", today);
  return data ?? [];
}

export async function getAttendanceMatrix(month: string) {
  const supabase = await createClient();
  const { profile } = await (async () => {
    const p = await import("@/lib/auth").then((m) => m.getProfileOrNull());
    return { profile: p };
  })();
  const role = profile?.role;
  let query = supabase
    .from("attendance")
    .select("*, profiles(id, full_name, profile_photo_url, department, role)")
    .gte("attendance_date", `${month}-01`)
    .lte("attendance_date", `${month}-31`)
    .order("attendance_date", { ascending: true });

  if (role && !isManagement(role)) {
    query = query.eq("user_id", profile!.id);
  }
  void isAdmin;
  const { data } = await query;
  return data ?? [];
}

// ---------- Holidays ----------
export async function getHolidays(year?: number) {
  const supabase = await createClient();
  const y = year ?? new Date().getFullYear();
  const { data } = await supabase
    .from("holidays")
    .select("*")
    .gte("holiday_date", `${y}-01-01`)
    .lte("holiday_date", `${y}-12-31`)
    .order("holiday_date", { ascending: true });
  return data ?? [];
}

export async function getUpcomingHolidays() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("holidays")
    .select("*")
    .gte("holiday_date", today)
    .order("holiday_date", { ascending: true })
    .limit(5);
  return data ?? [];
}

// ---------- Projects ----------
export async function getProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, clients(id, company_name), project_members(user_id, profiles(id, full_name, profile_photo_url)), tasks(id, status)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getMyProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("projects")
    .select("*, clients(id, company_name), project_members!inner(user_id, profiles(id, full_name, profile_photo_url)), tasks(id, status)")
    .eq("project_members.user_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, clients(id, company_name, contact_person, email, phone), project_members(id, user_id, profiles(id, full_name, profile_photo_url, designation, department)), tasks(*)")
    .eq("id", id)
    .single();
  return data ?? null;
}

// ---------- Tasks ----------
export async function getTasks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*, profiles(id, full_name, profile_photo_url), projects(id, name)")
    .order("created_at", { ascending: false })
    .limit(300);
  return data ?? [];
}

export async function getMyTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("tasks")
    .select("*, profiles(id, full_name, profile_photo_url), projects(id, name)")
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

// ---------- Daily work reports ----------
export async function getDailyReports() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_work_reports")
    .select("*, profiles(id, full_name, profile_photo_url), projects(id, name), tasks(id, title)")
    .order("report_date", { ascending: false })
    .limit(300);
  return data ?? [];
}

export async function getMyDailyReports() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("daily_work_reports")
    .select("*, projects(id, name), tasks(id, title)")
    .eq("user_id", user.id)
    .order("report_date", { ascending: false })
    .limit(100);
  return data ?? [];
}

// ---------- Leaves ----------
export async function getLeaves() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leave_requests")
    .select("*, profiles(id, full_name, profile_photo_url, department)")
    .order("created_at", { ascending: false })
    .limit(300);
  return data ?? [];
}

export async function getMyLeaves() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function getPendingLeaves() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leave_requests")
    .select("*, profiles(id, full_name, profile_photo_url, department, email, phone)")
    .eq("status", "Pending")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

// ---------- Clients ----------
export async function getClients() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getClientById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*, projects(*, project_members(user_id, profiles(id, full_name, profile_photo_url)), tasks(id, status, title, assigned_to))")
    .eq("id", id)
    .single();
  return data ?? null;
}

// ---------- Notifications ----------
export async function getNotifications(limit = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ---------- Leads (website enquiries, admin only) ----------
export async function getWebsiteLeads() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("website_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

// ---------- Settings ----------
export async function getCompanySettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("company_settings").select("*").limit(1).single();
  return data ?? null;
}

// ---------- Dashboard ----------
export async function getDashboardStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [employees, attendance, projects, tasks, clients] = await Promise.all([
    supabase.from("profiles").select("id, status"),
    supabase.from("attendance").select("status").eq("attendance_date", today),
    supabase.from("projects").select("id, status"),
    supabase.from("tasks").select("id, status"),
    supabase.from("clients").select("id"),
  ]);

  const activeEmployees = (employees.data ?? []).filter((e) => e.status === "active").length;
  const att = attendance.data ?? [];
  const present = att.filter((a) => a.status === "Present" || a.status === "Late").length;
  const absent = att.filter((a) => a.status === "Absent").length;
  const onLeave = att.filter((a) => a.status === "On Leave").length;
  const late = att.filter((a) => a.status === "Late").length;
  const activeProjects = (projects.data ?? []).filter((p) => p.status === "Active").length;
  const pendingTasks = (tasks.data ?? []).filter((t) => t.status !== "Completed").length;
  const completedTasks = (tasks.data ?? []).filter((t) => t.status === "Completed").length;

  return {
    total_employees: activeEmployees,
    present,
    absent,
    on_leave: onLeave,
    late,
    active_projects: activeProjects,
    pending_tasks: pendingTasks,
    completed_tasks: completedTasks,
    clients: (clients.data ?? []).length,
  };
}

export async function getAttendanceSeries(days = 14) {
  const supabase = await createClient();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  const fromStr = start.toISOString().split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("attendance")
    .select("attendance_date, status")
    .gte("attendance_date", fromStr)
    .lte("attendance_date", todayStr);
  const rows = data ?? [];

  const series: { date: string; present: number; absent: number; late: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split("T")[0];
    series.push({
      date: key,
      present: rows.filter((r) => r.attendance_date === key && (r.status === "Present" || r.status === "Late")).length,
      absent: rows.filter((r) => r.attendance_date === key && r.status === "Absent").length,
      late: rows.filter((r) => r.attendance_date === key && r.status === "Late").length,
    });
  }
  return series;
}

export async function getProjectProgressData() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, status, priority, progress")
    .limit(100);
  return data ?? [];
}