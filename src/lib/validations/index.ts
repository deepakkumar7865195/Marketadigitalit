import { z } from "zod";

// ---------- AUTH ----------
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------- WEBSITE ----------
export const websiteLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(7, "Phone number is too short").max(20),
  company: z.string().optional().nullable(),
  service: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  message: z.string().min(10, "Please share a few details about your project (min 10 characters)"),
});

// ---------- EMPLOYEES ----------
export const employeeSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  joiningDate: z.string().optional().nullable(),
  role: z.enum(["super_admin", "admin", "manager", "employee"]).default("employee"),
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .optional()
    .or(z.literal("")),
});

// ---------- ATTENDANCE ----------
export const attendanceNoteSchema = z.object({
  notes: z.string().optional().nullable(),
});

// ---------- HOLIDAYS ----------
export const holidaySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional().nullable(),
  holidayDate: z.string().min(1, "Date is required"),
  type: z.enum(["National Holiday", "Festival", "Company Holiday", "Optional Holiday"]),
});

// ---------- PROJECTS ----------
export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  clientId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(["Planning", "Active", "On Hold", "Completed", "Cancelled"]).default("Planning"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  progress: z.coerce.number().min(0).max(100).default(0),
  memberIds: z.array(z.string()).optional().default([]),
});

// ---------- TASKS ----------
export const taskSchema = z.object({
  projectId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  title: z.string().min(2, "Task title is required"),
  description: z.string().optional().nullable(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  status: z
    .enum(["Not Started", "In Progress", "Under Review", "Completed", "Blocked"])
    .default("Not Started"),
  dueDate: z.string().optional().nullable(),
});

export const taskUpdateSchema = z.object({
  status: z.enum(["Not Started", "In Progress", "Under Review", "Completed", "Blocked"]),
  workUpdate: z.string().max(2000).optional().nullable(),
});

// ---------- DAILY WORK REPORT ----------
export const dailyReportSchema = z.object({
  reportDate: z.string().min(1, "Date is required"),
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  workSummary: z.string().min(10, "Work summary must be at least 10 characters"),
  hoursSpent: z.coerce.number().min(0.5, "Min 0.5 hours").max(24, "Max 24 hours"),
  status: z
    .enum(["Not Started", "In Progress", "Under Review", "Completed", "Blocked"])
    .optional()
    .nullable(),
});

// ---------- LEAVES ----------
export const leaveSchema = z
  .object({
    leaveType: z.enum([
      "Casual Leave",
      "Sick Leave",
      "Paid Leave",
      "Unpaid Leave",
      "Work From Home",
      "Other",
    ]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(5, "Please provide a reason"),
    halfDay: z.boolean().default(false),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const leaveReviewSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  reviewNote: z.string().max(500).optional().nullable(),
});

// ---------- CLIENTS ----------
export const clientSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().optional().nullable(),
  email: z.string().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  service: z.string().optional().nullable(),
  status: z.enum(["Lead", "Active", "Inactive", "Completed"]).default("Lead"),
  notes: z.string().optional().nullable(),
});

// ---------- PROFILE ----------
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
});

// ---------- SETTINGS ----------
export const companySettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  officeStartTime: z.string().min(1, "Office start time is required"),
  officeEndTime: z.string().min(1, "Office end time is required"),
  lateGraceMinutes: z.coerce.number().min(0).max(180),
  halfDayMinutes: z.coerce.number().min(0).max(600),
  timezone: z.string().min(1),
});

// ---------- LEADS ----------
export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "converted", "closed"]);