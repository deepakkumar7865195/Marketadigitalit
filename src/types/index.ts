export type Role = "super_admin" | "admin" | "manager" | "employee";

export type ProfileStatus = "pending" | "active" | "inactive";

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Half Day"
  | "Late"
  | "On Leave"
  | "Holiday";

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type LeaveType =
  | "Casual Leave"
  | "Sick Leave"
  | "Paid Leave"
  | "Unpaid Leave"
  | "Work From Home"
  | "Other";

export type TaskStatus = "Not Started" | "In Progress" | "Under Review" | "Completed" | "Blocked";

export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled";

export type ProjectPriority = "Low" | "Medium" | "High" | "Urgent";

export type ClientStatus = "Lead" | "Active" | "Inactive" | "Completed";

export type HolidayType = "National Holiday" | "Festival" | "Company Holiday" | "Optional Holiday";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export interface Profile {
  id: string;
  employee_code: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  profile_photo_url: string | null;
  designation: string | null;
  department: string | null;
  joining_date: string | null;
  role: Role;
  status: ProfileStatus;
  address: string | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  attendance_date: string;
  clock_in: string | null;
  clock_out: string | null;
  clock_in_photo_path: string | null;
  clock_out_photo_path: string | null;
  clock_in_latitude: number | null;
  clock_in_longitude: number | null;
  clock_in_accuracy: number | null;
  clock_out_latitude: number | null;
  clock_out_longitude: number | null;
  clock_out_accuracy: number | null;
  work_minutes: number | null;
  status: AttendanceStatus | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  title: string;
  description: string | null;
  holiday_date: string;
  type: HolidayType;
  created_by: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  service: string | null;
  status: ClientStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  assigned_at: string;
}

export interface Task {
  id: string;
  project_id: string | null;
  assigned_to: string;
  assigned_by: string | null;
  title: string;
  description: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  work_update: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyWorkReport {
  id: string;
  user_id: string;
  report_date: string;
  project_id: string | null;
  task_id: string | null;
  work_summary: string;
  hours_spent: number | null;
  status: TaskStatus | null;
  proof_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string | null;
  attachment_path: string | null;
  status: LeaveStatus;
  reviewed_by: string | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebsiteLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: string;
  read: boolean;
  created_at: string;
}

export interface CompanySetting {
  id: string;
  company_name: string | null;
  logo_url: string | null;
  office_start_time: string | null;
  office_end_time: string | null;
  late_grace_minutes: number | null;
  half_day_minutes: number | null;
  timezone: string | null;
  updated_at: string;
}

// Row types joined with profiles
export interface AttendanceWithProfile extends Attendance {
  profiles: Pick<
    Profile,
    "id" | "full_name" | "email" | "profile_photo_url" | "designation" | "department" | "role"
  > | null;
}

export interface TaskWithRelations extends Task {
  profiles: Pick<Profile, "id" | "full_name" | "profile_photo_url"> | null;
  projects: Pick<Project, "id" | "name"> | null;
}

export interface LeaveWithProfile extends LeaveRequest {
  profiles: Pick<Profile, "id" | "full_name" | "profile_photo_url" | "department"> | null;
}

export interface ProjectWithRelations extends Project {
  clients: Pick<Client, "id" | "company_name"> | null;
  project_members: { user_id: string; profiles: Pick<Profile, "id" | "full_name" | "profile_photo_url"> }[];
  tasks: { id: string; status: TaskStatus }[];
}

export type DashboardStats = {
  total_employees: number;
  present: number;
  absent: number;
  on_leave: number;
  late: number;
  active_projects: number;
  pending_tasks: number;
  completed_tasks: number;
  clients: number;
};