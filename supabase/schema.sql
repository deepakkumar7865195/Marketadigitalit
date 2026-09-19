-- ============================================================================
-- MARKETA DIGITAL IT — SUPABASE SCHEMA
-- Paste this entire file into the Supabase SQL Editor and run once.
-- This file is idempotent-friendly (uses IF NOT EXISTS / DROP ... IF EXISTS
-- only for replaced functions).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- HELPER FUNCTIONS
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- EMPLOYEE CODE SEQUENCE
-- ----------------------------------------------------------------------------
create sequence if not exists public.employee_code_seq start 1000 increment 1;

-- ----------------------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_code text,
  full_name text not null default '',
  email text not null,
  phone text,
  profile_photo_url text,
  designation text,
  department text,
  joining_date date,
  role text not null default 'employee' check (role in ('super_admin','admin','manager','employee')),
  status text not null default 'pending' check (status in ('pending','active','inactive')),
  address text,
  emergency_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_department on public.profiles(department);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create a profile row for every new auth user as a PENDING employee.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, employee_code, full_name, email, role, status)
  values (
    new.id,
    'MDI-' || lpad(nextval('public.employee_code_seq')::text, 4, '0'),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'employee',
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- ATTENDANCE
-- ----------------------------------------------------------------------------
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  attendance_date date not null,
  clock_in timestamptz,
  clock_out timestamptz,
  clock_in_photo_path text,
  clock_out_photo_path text,
  clock_in_latitude double precision,
  clock_in_longitude double precision,
  clock_in_accuracy double precision,
  clock_out_latitude double precision,
  clock_out_longitude double precision,
  clock_out_accuracy double precision,
  work_minutes integer,
  status text check (status in ('Present','Absent','Half Day','Late','On Leave','Holiday')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, attendance_date)
);

create index if not exists idx_attendance_user_date on public.attendance(user_id, attendance_date desc);
create index if not exists idx_attendance_date on public.attendance(attendance_date);

drop trigger if exists trg_attendance_updated on public.attendance;
create trigger trg_attendance_updated
before update on public.attendance
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- HOLIDAYS
-- ----------------------------------------------------------------------------
create table if not exists public.holidays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  holiday_date date not null,
  type text not null default 'Company Holiday'
    check (type in ('National Holiday','Festival','Company Holiday','Optional Holiday')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_holidays_date on public.holidays(holiday_date);
create unique index if not exists idx_holidays_date_title on public.holidays(holiday_date, title);

-- ----------------------------------------------------------------------------
-- CLIENTS
-- ----------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text,
  email text,
  phone text,
  website text,
  address text,
  service text,
  status text not null default 'Lead' check (status in ('Lead','Active','Inactive','Completed')),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_clients_updated on public.clients;
create trigger trg_clients_updated
before update on public.clients
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- PROJECTS & MEMBERS
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references public.clients(id) on delete set null,
  description text,
  start_date date,
  due_date date,
  status text not null default 'Planning'
    check (status in ('Planning','Active','On Hold','Completed','Cancelled')),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Urgent')),
  progress integer not null default 0 check (progress between 0 and 100),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_project_members_user on public.project_members(user_id);
create index if not exists idx_project_members_project on public.project_members(project_id);

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
before update on public.projects
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- TASKS
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  assigned_to uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Urgent')),
  status text not null default 'Not Started'
    check (status in ('Not Started','In Progress','Under Review','Completed','Blocked')),
  due_date date,
  completed_at timestamptz,
  work_update text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_assigned on public.tasks(assigned_to);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_project on public.tasks(project_id);

drop trigger if exists trg_tasks_updated on public.tasks;
create trigger trg_tasks_updated
before update on public.tasks
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- DAILY WORK REPORTS
-- ----------------------------------------------------------------------------
create table if not exists public.daily_work_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  report_date date not null,
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  work_summary text not null,
  hours_spent numeric(4,1),
  status text check (status in ('Not Started','In Progress','Under Review','Completed','Blocked')),
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, report_date)
);

drop trigger if exists trg_daily_reports_updated on public.daily_work_reports;
create trigger trg_daily_reports_updated
before update on public.daily_work_reports
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- LEAVE REQUESTS
-- ----------------------------------------------------------------------------
create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  leave_type text not null
    check (leave_type in ('Casual Leave','Sick Leave','Paid Leave','Unpaid Leave','Work From Home','Other')),
  start_date date not null,
  end_date date not null,
  total_days numeric(4,1) not null default 1,
  reason text,
  attachment_path text,
  status text not null default 'Pending' check (status in ('Pending','Approved','Rejected','Cancelled')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leaves_user on public.leave_requests(user_id);
create index if not exists idx_leaves_status on public.leave_requests(status);

drop trigger if exists trg_leaves_updated on public.leave_requests;
create trigger trg_leaves_updated
before update on public.leave_requests
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type text not null default 'general',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_read on public.notifications(user_id, read);

-- ----------------------------------------------------------------------------
-- COMPANY SETTINGS
-- ----------------------------------------------------------------------------
create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default 'Marketa Digital IT',
  logo_url text,
  office_start_time time not null default '10:00:00',
  office_end_time time not null default '19:00:00',
  late_grace_minutes integer not null default 10,
  half_day_minutes integer not null default 240,
  timezone text not null default 'Asia/Kolkata',
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_company_settings_updated on public.company_settings;
create trigger trg_company_settings_updated
before update on public.company_settings
for each row execute function public.set_updated_at();

-- Insert a default settings row
insert into public.company_settings (company_name)
select 'Marketa Digital IT'
where not exists (select 1 from public.company_settings);

-- ----------------------------------------------------------------------------
-- WEBSITE LEADS (public enquiry form)
-- ----------------------------------------------------------------------------
create table if not exists public.website_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','qualified','converted','closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_status on public.website_leads(status);
create index if not exists idx_leads_created on public.website_leads(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.attendance enable row level security;
alter table public.holidays enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_work_reports enable row level security;
alter table public.leave_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.company_settings enable row level security;
alter table public.website_leads enable row level security;

-- Helper: is the current user management (super_admin/admin/manager)?
create or replace function public.is_management()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('super_admin','admin','manager')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('super_admin','admin')
  );
$$;

-- ----------------------------------------------------------------------------
-- PROFILES RLS
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_select_all_authenticated" on public.profiles;
create policy "profiles_select_all_authenticated"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (
  -- users may never escalate their own role/status
  auth.uid() = id
  and role in ('super_admin','admin','manager','employee')
  and status in ('pending','active','inactive')
);

drop policy if exists "profiles_update_management" on public.profiles;
create policy "profiles_update_management"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
on public.profiles for delete
to authenticated
using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ATTENDANCE RLS
-- ----------------------------------------------------------------------------
drop policy if exists "attendance_insert_own" on public.attendance;
create policy "attendance_insert_own"
on public.attendance for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "attendance_select_own" on public.attendance;
create policy "attendance_select_own"
on public.attendance for select
to authenticated
using (auth.uid() = user_id or public.is_management());

drop policy if exists "attendance_update_own" on public.attendance;
create policy "attendance_update_own"
on public.attendance for update
to authenticated
using (auth.uid() = user_id or public.is_management());

drop policy if exists "attendance_delete_management" on public.attendance;
create policy "attendance_delete_management"
on public.attendance for delete
to authenticated
using (public.is_management());

-- ----------------------------------------------------------------------------
-- HOLIDAYS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "holidays_select_authenticated" on public.holidays;
create policy "holidays_select_authenticated"
on public.holidays for select
to authenticated
using (true);

drop policy if exists "holidays_write_admin" on public.holidays;
create policy "holidays_write_admin"
on public.holidays for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- CLIENTS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "clients_select_authenticated" on public.clients;
create policy "clients_select_authenticated"
on public.clients for select
to authenticated
using (true);

drop policy if exists "clients_write_management" on public.clients;
create policy "clients_write_management"
on public.clients for all
to authenticated
using (public.is_management())
with check (public.is_management());

-- ----------------------------------------------------------------------------
-- PROJECTS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "projects_select_member_or_management" on public.projects;
create policy "projects_select_member_or_management"
on public.projects for select
to authenticated
using (
  public.is_management()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = id and pm.user_id = auth.uid()
  )
);

drop policy if exists "projects_write_management" on public.projects;
create policy "projects_write_management"
on public.projects for all
to authenticated
using (public.is_management())
with check (public.is_management());

-- ----------------------------------------------------------------------------
-- PROJECT MEMBERS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "project_members_select" on public.project_members;
create policy "project_members_select"
on public.project_members for select
to authenticated
using (
  public.is_management()
  or user_id = auth.uid()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = project_id and pm.user_id = auth.uid()
  )
);

drop policy if exists "project_members_write_management" on public.project_members;
create policy "project_members_write_management"
on public.project_members for all
to authenticated
using (public.is_management())
with check (public.is_management());

-- ----------------------------------------------------------------------------
-- TASKS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "tasks_select" on public.tasks;
create policy "tasks_select"
on public.tasks for select
to authenticated
using (
  assigned_to = auth.uid()
  or public.is_management()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = tasks.project_id and pm.user_id = auth.uid()
  )
);

drop policy if exists "tasks_insert_management" on public.tasks;
create policy "tasks_insert_management"
on public.tasks for insert
to authenticated
with check (public.is_management());

drop policy if exists "tasks_update_own_or_management" on public.tasks;
create policy "tasks_update_own_or_management"
on public.tasks for update
to authenticated
using (assigned_to = auth.uid() or public.is_management())
with check (assigned_to = auth.uid() or public.is_management());

drop policy if exists "tasks_delete_admin" on public.tasks;
create policy "tasks_delete_admin"
on public.tasks for delete
to authenticated
using (public.is_admin());

-- ----------------------------------------------------------------------------
-- DAILY WORK REPORTS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "reports_insert_own" on public.daily_work_reports;
create policy "reports_insert_own"
on public.daily_work_reports for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "reports_select_own_or_management" on public.daily_work_reports;
create policy "reports_select_own_or_management"
on public.daily_work_reports for select
to authenticated
using (auth.uid() = user_id or public.is_management());

drop policy if exists "reports_update_own_or_management" on public.daily_work_reports;
create policy "reports_update_own_or_management"
on public.daily_work_reports for update
to authenticated
using (auth.uid() = user_id or public.is_management());

-- ----------------------------------------------------------------------------
-- LEAVE REQUESTS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "leaves_insert_own" on public.leave_requests;
create policy "leaves_insert_own"
on public.leave_requests for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "leaves_select_own_or_management" on public.leave_requests;
create policy "leaves_select_own_or_management"
on public.leave_requests for select
to authenticated
using (auth.uid() = user_id or public.is_management());

drop policy if exists "leaves_update_own_or_management" on public.leave_requests;
create policy "leaves_update_own_or_management"
on public.leave_requests for update
to authenticated
using (auth.uid() = user_id or public.is_management())
with check (
  (auth.uid() = user_id and status in ('Pending','Cancelled'))
  or public.is_management()
);

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
on public.notifications for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
on public.notifications for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "notifications_insert_admin" on public.notifications;
create policy "notifications_insert_admin"
on public.notifications for insert
to authenticated
with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- COMPANY SETTINGS RLS
-- ----------------------------------------------------------------------------
drop policy if exists "settings_select_authenticated" on public.company_settings;
create policy "settings_select_authenticated"
on public.company_settings for select
to authenticated
using (true);

drop policy if exists "settings_write_admin" on public.company_settings;
create policy "settings_write_admin"
on public.company_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- WEBSITE LEADS RLS (public insert allowed)
-- ----------------------------------------------------------------------------
drop policy if exists "leads_insert_public" on public.website_leads;
create policy "leads_insert_public"
on public.website_leads for insert
to anon, authenticated
with check (true);

drop policy if exists "leads_select_management" on public.website_leads;
create policy "leads_select_management"
on public.website_leads for select
to authenticated
using (public.is_management());

drop policy if exists "leads_update_management" on public.website_leads;
create policy "leads_update_management"
on public.website_leads for update
to authenticated
using (public.is_management())
with check (public.is_management());

drop policy if exists "leads_delete_admin" on public.website_leads;
create policy "leads_delete_admin"
on public.website_leads for delete
to authenticated
using (public.is_admin());

-- ============================================================================
-- STORAGE
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 5 * 1024 * 1024, array['image/jpeg','image/png','image/webp']),
  ('attendance-photos', 'attendance-photos', false, 5 * 1024 * 1024, array['image/jpeg','image/png','image/webp']),
  ('leave-attachments', 'leave-attachments', false, 15 * 1024 * 1024, null),
  ('work-proofs', 'work-proofs', false, 15 * 1024 * 1024, null),
  ('project-files', 'project-files', false, 50 * 1024 * 1024, null)
on conflict (id) do nothing;

-- Owner-scoped access helper: first path segment equals the user id
create or replace function public.is_owner_or_management(file_path text)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select (
    public.is_management()
    or (split_part(file_path, '/', 1) = auth.uid()::text)
  );
$$;

-- AVATARS
-- Owner + management can read (every logged-in user displays avatars).
drop policy if exists "avatars_select_owner" on storage.objects;
drop policy if exists "avatars_select" on storage.objects;
create policy "avatars_select"
on storage.objects for select
to authenticated
using (bucket_id = 'avatars' and public.is_owner_or_management((storage.foldername(name))[1]));

drop policy if exists "avatars_insert" on storage.objects;
create policy "avatars_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ATTENDANCE PHOTOS
drop policy if exists "att_photos_insert" on storage.objects;
create policy "att_photos_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'attendance-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "att_photos_select" on storage.objects;
create policy "att_photos_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'attendance-photos'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_management())
);

-- LEAVE ATTACHMENTS
drop policy if exists "leave_att_insert" on storage.objects;
create policy "leave_att_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'leave-attachments' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "leave_att_select" on storage.objects;
create policy "leave_att_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'leave-attachments'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_management())
);

-- WORK PROOFS
drop policy if exists "work_proofs_insert" on storage.objects;
create policy "work_proofs_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'work-proofs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "work_proofs_select" on storage.objects;
create policy "work_proofs_select"
on storage.objects for select
to authenticated
using (
  bucket_id = 'work-proofs'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_management())
);

-- PROJECT FILES (members read, management write)
drop policy if exists "project_files_insert_management" on storage.objects;
create policy "project_files_insert_management"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-files' and public.is_management());

drop policy if exists "project_files_select_management" on storage.objects;
create policy "project_files_select_management"
on storage.objects for select
to authenticated
using (bucket_id = 'project-files' and public.is_management());

-- ============================================================================
-- ROLE GRANTS
-- ----------------------------------------------------------------------------
-- RLS policies are the real gate; these grants simply give roles the DML
-- privileges they need so the policies can be evaluated.
-- ============================================================================
grant usage on schema public to anon, authenticated;

-- Functions
grant execute on function public.set_updated_at() to anon, authenticated;
grant execute on function public.handle_new_user() to authenticated;
grant execute on function public.is_management() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_owner_or_management(text) to anon, authenticated;

-- Website lead form (public) — rows still protected by leads RLS (insert only).
grant insert on public.website_leads to anon, authenticated;

-- Authenticated staff
grant select, insert, update, delete
on public.profiles, public.attendance, public.holidays, public.clients,
   public.projects, public.project_members, public.tasks,
   public.daily_work_reports, public.leave_requests, public.notifications,
   public.company_settings, public.website_leads
to authenticated;

-- ============================================================================
-- FIRST ADMIN — run this AFTER creating your account (see README section 9):
-- update public.profiles
-- set role = 'super_admin', status = 'active'
-- where email = 'you@example.com';
-- ============================================================================