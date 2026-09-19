"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, isAdmin, isManagement } from "@/lib/auth";
import { daysBetween, todayStr, workMinutes } from "@/lib/format";
import { sendLeadAlertEmail, sendLeaveStatusMessage } from "@/lib/email";
import {
  attendanceNoteSchema,
  changePasswordSchema,
  clientSchema,
  companySettingsSchema,
  employeeSchema,
  holidaySchema,
  leaveReviewSchema,
  leaveSchema,
  leadStatusSchema,
  loginSchema,
  projectSchema,
  profileUpdateSchema,
  resetPasswordSchema,
  signupSchema,
  taskSchema,
  taskUpdateSchema,
  websiteLeadSchema,
} from "@/lib/validations";
import type { Profile, Role } from "@/types";

type ActionResult = { success: boolean; error?: string; data?: unknown };

function err(e: unknown, fallback = "Something went wrong"): ActionResult {
  console.error(e);
  return { success: false, error: e instanceof Error ? e.message : fallback };
}

async function notify(userId: string, title: string, message: string, type = "general") {
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    read: false,
  });
}

async function notifyManagement(title: string, message: string, type = "general") {
  const supabase = await createClient();
  const { data: managers } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["super_admin", "admin", "manager"])
    .eq("status", "active");
  await Promise.all(
    (managers ?? []).map((m: { id: string }) =>
      supabase.from("notifications").insert({
        user_id: m.id,
        title,
        message,
        type,
        read: false,
      })
    )
  );
}

// ---------- AUTH ----------
export async function actionLogin(values: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function actionSignOut(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function actionSignup(values: unknown): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const { fullName, email, phone, password } = parsed.data;
  const admin = createAdminClient();

  const { data: result, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone: phone ?? "" },
  });
  if (error) return { success: false, error: error.message };
  if (!result.user) return { success: false, error: "Account could not be created" };

  // Profile row is created by the handle_new_user trigger (status = pending).
  // Ensure the row exists and carry over metadata.
  await admin.from("profiles").upsert(
    {
      id: result.user.id,
      full_name: fullName,
      email: email.toLowerCase(),
      phone: phone || null,
      role: "employee",
      status: "pending",
    },
    { onConflict: "id" }
  );

  // Sign the user in immediately (they may view portal, approval gates access).
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  return { success: true, data: { status: "pending" } };
}

export async function actionForgotPassword(values: unknown): Promise<ActionResult> {
  const parsed = z
    .object({ email: z.string().min(1, "Email is required").email() })
    .safeParse(values);
  if (!parsed.success) return { success: false, error: "Enter a valid email address" };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/staff/reset-password`,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function actionResetPassword(values: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Session expired. Please request a new reset link." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function actionChangePassword(values: unknown): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: (await getCurrentUser()).user?.email ?? "",
    password: parsed.data.currentPassword,
  });
  if (verifyError) return { success: false, error: "Current password is incorrect" };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ---------- EMPLOYEES ----------
export async function actionUpsertEmployee(values: unknown, userId?: string): Promise<ActionResult> {
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || "Invalid data" };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };

  const payload = {
    full_name: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone || null,
    designation: parsed.data.designation || null,
    department: parsed.data.department || null,
    joining_date: parsed.data.joiningDate || null,
    role: parsed.data.role as Role,
    status: parsed.data.status,
    address: parsed.data.address || null,
    emergency_contact: parsed.data.emergencyContact || null,
  };

  if (userId) {
    const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
    if (error) return err(error);
    revalidatePath("/staff/employees");
    return { success: true };
  }

  // Creating a new employee requires an auth account.
  const password = parsed.data.password;
  if (!password) return { success: false, error: "Password is required for a new employee" };
  const admin = createAdminClient();
  const { data: result, error: createErr } = await admin.auth.admin.createUser({
    email: payload.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: payload.full_name, phone: payload.phone ?? "" },
  });
  if (createErr) return err(createErr);
  if (!result.user) return { success: false, error: "Could not create account" };

  const { error } = await admin.from("profiles").upsert(
    { id: result.user.id, ...payload },
    { onConflict: "id" }
  );
  if (error) return err(error);
  void notify(result.user.id, "Welcome to Marketa Digital IT", "Your employee account is ready. Welcome aboard!");
  revalidatePath("/staff/employees");
  return { success: true, data: { id: result.user.id } };
}

export async function actionDeactivateEmployee(userId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase
    .from("profiles")
    .update({ status: profile?.id === userId ? "active" : "inactive" })
    .eq("id", userId);
  if (error) return err(error);
  revalidatePath("/staff/employees");
  return { success: true };
}

export async function actionActivateEmployee(userId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("profiles").update({ status: "active" }).eq("id", userId);
  if (error) return err(error);
  void notify(userId, "Account approved", "Your account has been approved. You can now access the portal.");
  revalidatePath("/staff/employees");
  return { success: true };
}

export async function actionDeleteEmployee(userId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (profile?.role !== "super_admin") return { success: false, error: "Only super admins can delete employees" };
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return err(error);
  revalidatePath("/staff/employees");
  return { success: true };
}

// ---------- ATTENDANCE ----------
async function getOfficeSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("company_settings").select("*").limit(1).single();
  return data;
}

function computeStatus(clockIn: Date, settings: { office_start_time?: string; late_grace_minutes?: number; half_day_minutes?: number } | null) {
  if (!settings?.office_start_time) return "Present" as const;
  const [h, m] = settings.office_start_time.split(":").map(Number);
  const start = new Date(clockIn);
  start.setHours(h, m, 0, 0);
  // If employee is a "morning-type" worker start at office start
  const graceMs = (settings.late_grace_minutes ?? 0) * 60000;
  const startWithGrace = start.getTime() + graceMs;
  let status: string;
  if (clockIn.getTime() <= startWithGrace) {
    status = "Present";
  } else {
    status = "Late";
  }
  // Half-day determination handled after clock-out (server recomputes).
  return status as "Present" | "Late";
}

export async function actionClockIn(data: {
  photoPath: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile || profile.status !== "active") return { success: false, error: "Not authorized" };

  const now = new Date();
  const date = now.toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("user_id", profile.id)
    .eq("attendance_date", date)
    .maybeSingle();
  if (existing) return { success: false, error: "You have already clocked in today." };

  const settings = await getOfficeSettings();
  const status = computeStatus(now, settings);

  const { error } = await supabase.from("attendance").insert({
    user_id: profile.id,
    attendance_date: date,
    clock_in: now.toISOString(),
    clock_in_photo_path: data.photoPath,
    clock_in_latitude: data.latitude,
    clock_in_longitude: data.longitude,
    clock_in_accuracy: data.accuracy,
    status,
    notes: null,
  });
  if (error) return err(error, "Could not record clock in");
  revalidatePath("/staff/attendance");
  return { success: true, data: { clockIn: now.toISOString(), status } };
}

export async function actionClockOut(data: {
  photoPath: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };

  const now = new Date();
  const date = now.toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", profile.id)
    .eq("attendance_date", date)
    .maybeSingle();
  if (!existing) return { success: false, error: "Please clock in before clocking out." };
  if (existing.clock_out) return { success: false, error: "You have already clocked out today." };

  const minutes = workMinutes(existing.clock_in, now) ?? 0;
  const settings = await getOfficeSettings();
  let status = existing.status;
  if (status === "Present" || status === "Late") {
    const halfDayMin = settings?.half_day_minutes ?? 240;
    if (minutes < halfDayMin) status = "Half Day";
    else if (existing.status === "Late" && minutes >= halfDayMin) status = "Late";
  }

  const { error } = await supabase
    .from("attendance")
    .update({
      clock_out: now.toISOString(),
      clock_out_photo_path: data.photoPath,
      clock_out_latitude: data.latitude,
      clock_out_longitude: data.longitude,
      clock_out_accuracy: data.accuracy,
      work_minutes: minutes,
      status,
    })
    .eq("id", existing.id);
  if (error) return err(error, "Could not record clock out");
  revalidatePath("/staff/attendance");
  return { success: true, data: { clockOut: now.toISOString(), minutes, status } };
}

export async function actionMarkLeaveDays(userId: string, date: string, type: "leave" | "undo" = "leave"): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };

  if (type === "undo") {
    const { data: row } = await supabase
      .from("attendance")
      .select("id")
      .eq("user_id", userId)
      .eq("attendance_date", date)
      .maybeSingle();
    if (row) {
      await supabase.from("attendance").delete().eq("id", row.id);
    }
    revalidatePath("/staff/attendance");
    return { success: true };
  }

  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("user_id", userId)
    .eq("attendance_date", date)
    .maybeSingle();
  if (!existing) {
    await supabase.from("attendance").insert({
      user_id: userId,
      attendance_date: date,
      status: "On Leave",
    });
  }
  revalidatePath("/staff/attendance");
  return { success: true };
}

export async function actionAdminClockAdjust(values: {
  userId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status?: string;
  notes?: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };

  const { data: existing } = await supabase
    .from("attendance")
    .select("id, clock_in, clock_out")
    .eq("user_id", values.userId)
    .eq("attendance_date", values.date)
    .maybeSingle();

  const payload: Record<string, unknown> = { notes: values.notes ?? null };
  if (values.status) payload.status = values.status;
  if (values.clockIn) {
    payload.clock_in = new Date(`${values.date}T${values.clockIn}`).toISOString();
  }
  if (values.clockOut) {
    const out = new Date(`${values.date}T${values.clockOut}`).toISOString();
    payload.clock_out = out;
    const inTime = payload.clock_in ? (payload.clock_in as string) : existing?.clock_in;
    if (inTime) payload.work_minutes = workMinutes(inTime, out);
  }

  if (existing) {
    const { error } = await supabase.from("attendance").update(payload).eq("id", existing.id);
    if (error) return err(error);
  } else {
    const { error } = await supabase.from("attendance").insert({
      user_id: values.userId,
      attendance_date: values.date,
      status: values.status ?? "Present",
      ...payload,
    });
    if (error) return err(error);
  }
  revalidatePath("/staff/attendance");
  return { success: true };
}

export async function actionUpdateAttendanceNote(id: string, values: unknown): Promise<ActionResult> {
  const parsed = attendanceNoteSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "Invalid input" };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const { data: row } = await supabase.from("attendance").select("user_id").eq("id", id).single();
  if (!row || (row.user_id !== profile.id && !isManagement(profile.role)))
    return { success: false, error: "Not authorized" };
  const { error } = await supabase
    .from("attendance")
    .update({ notes: parsed.data.notes || null })
    .eq("id", id);
  if (error) return err(error);
  return { success: true };
}

// ---------- HOLIDAYS ----------
export async function actionCreateHoliday(values: unknown): Promise<ActionResult> {
  const parsed = holidaySchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("holidays").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    holiday_date: parsed.data.holidayDate,
    type: parsed.data.type,
    created_by: profile.id,
  });
  if (error) return err(error);
  revalidatePath("/staff/holidays");
  return { success: true };
}

export async function actionUpdateHoliday(id: string, values: unknown): Promise<ActionResult> {
  const parsed = holidaySchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase
    .from("holidays")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      holiday_date: parsed.data.holidayDate,
      type: parsed.data.type,
    })
    .eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/holidays");
  return { success: true };
}

export async function actionDeleteHoliday(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("holidays").delete().eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/holidays");
  return { success: true };
}

// ---------- PROJECTS ----------
export async function actionCreateProject(values: unknown): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name: d.name,
      client_id: d.clientId || null,
      description: d.description || null,
      start_date: d.startDate || null,
      due_date: d.dueDate || null,
      status: d.status,
      priority: d.priority,
      progress: d.progress,
      created_by: profile.id,
    })
    .select("id")
    .single();
  if (error) return err(error);
  if (project && d.memberIds.length) {
    await supabase.from("project_members").insert(
      d.memberIds.map((userId) => ({ project_id: project.id, user_id: userId }))
    );
    for (const userId of d.memberIds) {
      void notify(userId, "Project assigned", `You have been added to the project “${d.name}”.`, "project");
    }
  }
  revalidatePath("/staff/projects");
  return { success: true, data: { id: project?.id } };
}

export async function actionUpdateProject(id: string, values: unknown): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase
    .from("projects")
    .update({
      name: d.name,
      client_id: d.clientId || null,
      description: d.description || null,
      start_date: d.startDate || null,
      due_date: d.dueDate || null,
      status: d.status,
      priority: d.priority,
      progress: d.progress,
    })
    .eq("id", id);
  if (error) return err(error);

  // Sync members
  const { data: existing } = await supabase.from("project_members").select("user_id").eq("project_id", id);
  const existingIds = new Set((existing ?? []).map((m) => m.user_id));
  const requestedIds = new Set(d.memberIds);
  const toAdd = d.memberIds.filter((userId) => !existingIds.has(userId));
  const toRemove = (existing ?? []).filter((m) => !requestedIds.has(m.user_id)).map((m) => m.user_id);
  if (toAdd.length) {
    await supabase.from("project_members").insert(toAdd.map((userId) => ({ project_id: id, user_id: userId })));
    for (const userId of toAdd) {
      void notify(userId, "Project assigned", `You have been added to the project “${d.name}”.`, "project");
    }
  }
  if (toRemove.length) {
    await supabase
      .from("project_members")
      .delete()
      .eq("project_id", id)
      .in("user_id", toRemove);
  }
  revalidatePath("/staff/projects");
  return { success: true };
}

export async function actionUpdateProjectProgress(id: string, progress: number): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase
    .from("projects")
    .update({ progress: Math.max(0, Math.min(100, progress)) })
    .eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/projects");
  return { success: true };
}

export async function actionDeleteProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/projects");
  return { success: true };
}

// ---------- TASKS ----------
export async function actionCreateTask(values: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase.from("tasks").insert({
    project_id: d.projectId || null,
    assigned_to: d.assignedTo || profile.id,
    assigned_by: profile.id,
    title: d.title,
    description: d.description || null,
    priority: d.priority,
    status: d.status,
    due_date: d.dueDate || null,
  });
  if (error) return err(error);
  if (d.assignedTo && d.assignedTo !== profile.id) {
    void notify(d.assignedTo, "New task assigned", `A new task was assigned to you: “${d.title}”.`, "task");
  }
  revalidatePath("/staff/tasks");
  return { success: true };
}

export async function actionUpdateTask(id: string, values: unknown): Promise<ActionResult> {
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase
    .from("tasks")
    .update({
      project_id: d.projectId || null,
      assigned_to: d.assignedTo || profile.id,
      title: d.title,
      description: d.description || null,
      priority: d.priority,
      status: d.status,
      due_date: d.dueDate || null,
      completed_at: d.status === "Completed" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/tasks");
  return { success: true };
}

export async function actionUpdateMyTask(id: string, values: unknown): Promise<ActionResult> {
  const parsed = taskUpdateSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const { data: task } = await supabase.from("tasks").select("assigned_to").eq("id", id).single();
  if (!task || (task.assigned_to !== profile.id && !isManagement(profile.role)))
    return { success: false, error: "You can only update your own tasks" };
  const { error } = await supabase
    .from("tasks")
    .update({
      status: parsed.data.status,
      work_update: parsed.data.workUpdate || null,
      completed_at: parsed.data.status === "Completed" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/tasks");
  return { success: true };
}

export async function actionDeleteTask(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (profile?.role !== "super_admin") return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/tasks");
  return { success: true };
}

// ---------- DAILY WORK REPORTS ----------
export async function actionSubmitReport(values: unknown): Promise<ActionResult> {
  const parsed = z
    .object({
      reportDate: z.string().min(1),
      projectId: z.string().optional().nullable(),
      taskId: z.string().optional().nullable(),
      workSummary: z.string().min(10),
      hoursSpent: z.coerce.number().min(0.5).max(24),
      status: z.string().optional().nullable(),
      proofPath: z.string().optional().nullable(),
    })
    .safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { data: existing } = await supabase
    .from("daily_work_reports")
    .select("id")
    .eq("user_id", profile.id)
    .eq("report_date", d.reportDate)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from("daily_work_reports")
      .update({
        project_id: d.projectId || null,
        task_id: d.taskId || null,
        work_summary: d.workSummary,
        hours_spent: d.hoursSpent,
        status: d.status || null,
        proof_url: d.proofPath || null,
      })
      .eq("id", existing.id);
    if (error) return err(error);
  } else {
    const { error } = await supabase.from("daily_work_reports").insert({
      user_id: profile.id,
      report_date: d.reportDate,
      project_id: d.projectId || null,
      task_id: d.taskId || null,
      work_summary: d.workSummary,
      hours_spent: d.hoursSpent,
      status: d.status || null,
      proof_url: d.proofPath || null,
    });
    if (error) return err(error);
  }
  revalidatePath("/staff/tasks");
  return { success: true };
}

// ---------- LEAVES ----------
export async function actionApplyLeave(values: unknown, attachmentPath?: string | null): Promise<ActionResult> {
  const parsed = leaveSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const totalDays = d.halfDay ? 0.5 : daysBetween(d.startDate, d.endDate);
  const { error } = await supabase.from("leave_requests").insert({
    user_id: profile.id,
    leave_type: d.leaveType,
    start_date: d.startDate,
    end_date: d.endDate,
    total_days: totalDays,
    reason: d.reason,
    attachment_path: attachmentPath || null,
    status: "Pending",
  });
  if (error) return err(error);
  revalidatePath("/staff/leaves");
  void notifyManagement("New leave request", `${profile.full_name} requested ${d.leaveType} (${totalDays} day${totalDays === 1 ? "" : "s"}) starting ${d.startDate}.`, "leave");
  return { success: true };
}

export async function actionCancelLeave(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const { data: row } = await supabase.from("leave_requests").select("user_id, status").eq("id", id).single();
  if (!row || (row.user_id !== profile.id && !isManagement(profile.role)))
    return { success: false, error: "Not authorized" };
  if (row.status !== "Pending") return { success: false, error: "Only pending requests can be cancelled" };
  const { error } = await supabase.from("leave_requests").update({ status: "Cancelled" }).eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/leaves");
  return { success: true };
}

export async function actionReviewLeave(id: string, values: unknown): Promise<ActionResult> {
  const parsed = leaveReviewSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const { data: row } = await supabase
    .from("leave_requests")
    .select("id, user_id, leave_type, start_date, end_date, total_days, reason")
    .eq("id", id)
    .single();
  if (!row) return { success: false, error: "Leave request not found" };
  const { error } = await supabase
    .from("leave_requests")
    .update({
      status: parsed.data.status,
      reviewed_by: profile.id,
      review_note: parsed.data.reviewNote || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return err(error);

  // When approved, mark those days as On Leave in attendance.
  if (parsed.data.status === "Approved") {
    const s = new Date(row.start_date);
    const e = new Date(row.end_date);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      await actionMarkLeaveDays(row.user_id, dateStr, "leave");
    }
  }
  const title = parsed.data.status === "Approved" ? "Leave approved" : "Leave rejected";
  void notify(row.user_id, title, parsed.data.reviewNote || `Your ${parsed.data.status.toLowerCase()} request was reviewed.`, "leave");
  revalidatePath("/staff/leaves");
  revalidatePath("/staff/dashboard");

  // Notify the employee on their email + WhatsApp (no-op until webhooks are configured).
  const { data: employee } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", row.user_id)
    .single();
  if (employee) {
    void sendLeaveStatusMessage({
      employeeName: employee.full_name ?? "Employee",
      employeeEmail: employee.email ?? null,
      employeePhone: employee.phone ?? null,
      leaveType: row.leave_type ?? "Leave",
      startDate: row.start_date,
      endDate: row.end_date,
      totalDays: row.total_days,
      reason: row.reason ?? null,
      status: parsed.data.status,
      note: parsed.data.reviewNote || null,
      reviewerName: profile.full_name ?? null,
    });
  }
  return { success: true };
}

// ---------- CLIENTS ----------
export async function actionCreateClient(values: unknown): Promise<ActionResult> {
  const parsed = clientSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase.from("clients").insert({
    company_name: d.companyName,
    contact_person: d.contactPerson || null,
    email: d.email || null,
    phone: d.phone || null,
    website: d.website || null,
    address: d.address || null,
    service: d.service || null,
    status: d.status,
    notes: d.notes || null,
    created_by: profile.id,
  });
  if (error) return err(error);
  revalidatePath("/staff/clients");
  return { success: true };
}

export async function actionUpdateClient(id: string, values: unknown): Promise<ActionResult> {
  const parsed = clientSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase
    .from("clients")
    .update({
      company_name: d.companyName,
      contact_person: d.contactPerson || null,
      email: d.email || null,
      phone: d.phone || null,
      website: d.website || null,
      address: d.address || null,
      service: d.service || null,
      status: d.status,
      notes: d.notes || null,
    })
    .eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/clients");
  return { success: true };
}

export async function actionDeleteClient(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/clients");
  return { success: true };
}

// ---------- PROFILE ----------
export async function actionUpdateProfile(values: unknown): Promise<ActionResult> {
  const parsed = profileUpdateSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: d.fullName,
      phone: d.phone || null,
      designation: d.designation || null,
      department: d.department || null,
      address: d.address || null,
      emergency_contact: d.emergencyContact || null,
    })
    .eq("id", profile.id);
  if (error) return err(error);
  revalidatePath("/staff/profile");
  return { success: true };
}

export async function actionUpdateProfilePhoto(photoPath: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  const { error } = await supabase
    .from("profiles")
    .update({ profile_photo_url: photoPath })
    .eq("id", profile.id);
  if (error) return err(error);
  revalidatePath("/staff/profile");
  return { success: true };
}

// ---------- SETTINGS ----------
export async function actionSaveSettings(values: unknown): Promise<ActionResult> {
  const parsed = companySettingsSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const d = parsed.data;
  const { data: existing } = await supabase.from("company_settings").select("id").limit(1).single();
  if (existing) {
    const { error } = await supabase
      .from("company_settings")
      .update({
        company_name: d.companyName,
        office_start_time: d.officeStartTime,
        office_end_time: d.officeEndTime,
        late_grace_minutes: d.lateGraceMinutes,
        half_day_minutes: d.halfDayMinutes,
        timezone: d.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) return err(error);
  } else {
    const { error } = await supabase.from("company_settings").insert({
      company_name: d.companyName,
      office_start_time: d.officeStartTime,
      office_end_time: d.officeEndTime,
      late_grace_minutes: d.lateGraceMinutes,
      half_day_minutes: d.halfDayMinutes,
      timezone: d.timezone,
    });
    if (error) return err(error);
  }
  revalidatePath("/staff/settings");
  return { success: true };
}

// ---------- NOTIFICATIONS ----------
export async function actionMarkNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!profile) return { success: false, error: "Not authorized" };
  await supabase.from("notifications").update({ read: true }).eq("user_id", profile.id).eq("read", false);
  return { success: true };
}

// ---------- WEBSITE ----------
export async function actionSubmitWebsiteLead(values: unknown): Promise<ActionResult> {
  const parsed = websiteLeadSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("website_leads").insert({
    name: d.name,
    email: d.email,
    phone: d.phone,
    company: d.company || null,
    service: d.service || null,
    budget: d.budget || null,
    message: d.message,
    status: "new",
  });
  if (error) return err(error, "We could not submit your enquiry. Please try again.");
  void actionNotifyAdmins(
    "New website enquiry",
    `New lead from ${d.name} (${d.email}) — ${d.service ?? "General"} enquiry.`
  );
  void sendLeadAlertEmail({
    name: d.name,
    email: d.email,
    phone: d.phone,
    company: d.company || null,
    service: d.service || null,
    budget: d.budget || null,
    message: d.message,
  });
  return { success: true };
}

async function actionNotifyAdmins(title: string, message: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .in("role", ["super_admin", "admin"]);
  if (!data) return;
  // createAdminClient uses service role; notifications table inserts must bypass RLS via service role (they do).
  await admin
    .from("notifications")
    .insert(data.map((p) => ({ user_id: p.id, title, message, type: "lead", read: false })));
}

export async function actionUpdateLeadStatus(id: string, status: unknown): Promise<ActionResult> {
  const parsed = leadStatusSchema.safeParse(status);
  if (!parsed.success) return { success: false, error: "Invalid status" };
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isManagement(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("website_leads").update({ status: parsed.data }).eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/leads");
  revalidatePath("/staff/dashboard");
  return { success: true };
}

export async function actionDeleteLead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { profile } = await getCurrentUser();
  if (!isAdmin(profile?.role)) return { success: false, error: "Not authorized" };
  const { error } = await supabase.from("website_leads").delete().eq("id", id);
  if (error) return err(error);
  revalidatePath("/staff/leads");
  revalidatePath("/staff/dashboard");
  return { success: true };
}

// Re-exported for convenience
export { todayStr };