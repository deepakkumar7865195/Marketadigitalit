# Marketa Digital IT — Website + Employee Management System

A production-ready Next.js (App Router) application for **Marketa Digital IT**: a premium public marketing website **plus** a full employee-management portal at `/staff`, powered by Supabase (PostgreSQL, Auth, Storage, RLS).

## Tech Stack

- **Next.js 16** (App Router, Turbopack, Server Actions) + React 19 + TypeScript
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`)
- **shadcn-style UI kit** hand-written in `src/components/ui` (Button, Card, Dialog, Sheet, Table, Select, DropdownMenu, Avatar, Tabs, Progress, Popover, Badge, etc.)
- **Framer Motion** — marketing animations (reveal/stagger, hero, intro loader)
- **Lucide React** icons, **Recharts** dashboard charts
- **Supabase** — `@supabase/ssr` (client/server/middleware), `supabase` (Admin API)
- **React Hook Form + Zod** for forms (server actions validate again with Zod)

## Folder Structure

```
src/
├─ app/
│  ├─ layout.tsx            # Root layout: fonts, metadata, Toaster
│  ├─ not-found.tsx         # 404
│  ├─ sitemap.ts / robots.ts
│  ├─ auth/callback/        # Supabase OAuth / reset-password callback
│  ├─ (marketing)/          # PUBLIC WEBSITE
│  │  ├─ layout.tsx         # Navbar + Footer + IntroLoader
│  │  ├─ page.tsx           # Homepage
│  │  ├─ about/ services/ portfolio/ contact/ blog/ sitemap/ privacy-policy/ terms/
│  │  └─ services/[slug]/
│  └─ staff/                # EMPLOYEE PORTAL
│     ├─ (auth)/            # login, signup, forgot-password, reset-password
│     └─ (app)/             # Sidebar+Topbar shell (src/components/dashboard)
│        ├─ dashboard/ employees/(+[id]) attendance/ holidays/
│        ├─ projects/(+[id]) tasks/ leaves/ clients/(+[id]) profile/ settings/
├─ components/
│  ├─ ui/                   # shadcn-style primitives
│  ├─ website/              # marketing sections (hero, services, portfolio...)
│  ├─ shared/               # StatusBadge, StatCard, EmptyState, UserAvatar, SchemaJsonLd...
│  ├─ dashboard/            # Sidebar, Topbar, pending-approval, charts
│  ├─ employees/ attendance/ holidays/ projects/ tasks/ leaves/ clients/ profile/ settings/ # page clients
├─ lib/
│  ├─ supabase/             # client.ts, server.ts, middleware.ts, admin.ts
│  ├─ actions.ts            # ALL server mutations (auth, HR, attendance, CRUD)
│  ├─ queries.ts            # ALL server queries (dashboard stats, matrices...)
│  ├─ auth.ts               # requireAuth / requireRole / role helpers
│  ├─ validations/          # Zod schemas
│  ├─ upload.ts             # client-side storage uploads
│  ├─ files.ts              # signed URLs for private buckets
│  ├─ format.ts / constants.ts / utils.ts
├─ hooks/use-file-url.ts    # fetch signed URL for avatars/photos
└─ types/                   # full TS models (Profile, Task, Attendance...)
supabase/schema.sql         # PASTE THIS into Supabase SQL Editor
```

## 1. Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

## 2. Supabase Setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy your project URL + **publishable key** and **service role key** into `.env.local`.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never used in client bundles)
3. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run. This creates:
   - Tables: `profiles`, `attendance`, `holidays`, `clients`, `projects`, `project_members`, `tasks`, `daily_work_reports`, `leave_requests`, `notifications`, `company_settings`, `website_leads`
   - **RLS** policies on every table (employees see own data; management sees company data)
   - **Storage buckets** + policies: `avatars`, `attendance-photos`, `leave-attachments`, `work-proofs`, `project-files`
   - Trigger `handle_new_user` → auto-creates a `pending` profile on signup.
4. **Create your first admin** (required to approve employees). In SQL Editor run:
   ```sql
   update public.profiles
   set role = 'super_admin', status = 'active'
   where email = 'you@marketadigitalit.com';
   ```
   (Create the account via `/staff/signup` first, or with `npx supabase` admin API.)
5. (Optional) Seed company settings:
   ```sql
   insert into public.company_settings (company_name, office_start_time, office_end_time, late_grace_minutes, half_day_minutes, timezone)
   values ('Marketa Digital IT', '09:30', '18:30', 15, 240, 'Asia/Kolkata');
   ```
6. Add employees via **Staff → Employees → Add Employee** (creates their login). New signups stay `pending` until an admin activates them.

## 3. Features

**Public website** — animated intro loader, hero + image slider, services carousel, why-us, about, process timeline, filterable portfolio, client marquee, testimonials slider, CTA, contact form (saves to `website_leads`), full SEO (metadata, Open Graph, JSON-LD, sitemap.xml, robots.txt).

**Staff portal** (`/staff`, protected by middleware + per-route role guards):
- **Auth** — login, self-signup (pending approval), forgot/reset password
- **Dashboard** — KPI cards, 14-day attendance chart, today breakdown pie, live roster, project progress
- **Employees** — CRUD, approve/activate/deactivate, per-employee profile (attendance, tasks, leaves, reports)
- **Attendance** — clock in/out with **camera selfie** + **live geolocation** (photos & coords stored), late/on-leave/half-day logic from company settings, monthly matrix roster with color-coded day grid, admin clock adjustments & CSV export
- **Holidays** — view + admin CRUD
- **Projects** — CRUD, client + team assignment, progress tracking (slider), per-project board
- **Tasks & Daily Work** — create/assign tasks, status + work-update tracking, **daily work report** submissions
- **Leaves** — apply with attachment, approval flow for managers, leave balances
- **Clients** — CRUD + detail page with linked projects
- **Leads** — triage website enquiries (status pipeline, search/filter, CSV export, delete)</think>
- **Profile** — photo upload (avatars bucket), personal info, change password
- **Settings** (admin) — office hours, late grace, half-day threshold, timezone
- **Notifications** — bell popover + admin notifications on new leads/approvals

## 4. Deploy to Vercel

1. Push the repo and import it at [vercel.com/new](https://vercel.com/new).
2. Add the same three env vars from `.env.local` (Supabase URL, publishable key, service role key) and `NEXT_PUBLIC_SITE_URL=https://your-domain.com`.
3. In Supabase Dashboard → **Authentication → URL Configuration**, set your production site URL, and redirect URLs like `https://your-domain.com/auth/callback*` and `https://your-domain.com/staff/reset-password`.
4. Deploy. `npm run build` must pass (it does out of the box).

### 4a. Lead email alerts (optional)

Every website enquiry is forwarded to a webhook so your team gets email. Until you
configure it, it silently no-ops. Add these env vars on Vercel:

- `LEAD_ALERT_WEBHOOK_URL` — endpoint that turns the payload into an email
- `LEAD_ALERT_WEBHOOK_KEY` — optional Bearer token for that endpoint
- `LEAD_ALERT_EMAILS` — comma-separated recipients, forwarded in the payload

Easiest options: a **Resend / Brevo** API route on your own site, or a **Zapier /
Make / n8n** webhook that emails you. The webhook receives:

```json
{
  "event": "lead.created",
  "source": "marketata-www",
  "to": ["sales@marketadigitalit.com"],
  "subject": "New enquiry from Jane Doe",
  "lead": { "name": "Jane Doe", "email": "jane@acme.com", "phone": "...",
            "company": "Acme", "service": "SEO", "budget": "₹50k-1L",
            "message": "..." }
}
```

If you prefer Supabase-side delivery instead (works even if the website isn't the
trigger), enable `pg_net` and fire an HTTP POST from a trigger on `website_leads` to
the same webhook.

### 4b. Leave notifications to employees (optional)

When you approve or reject a leave, the employee is notified **by email and
WhatsApp** via two optional webhooks (silently no-ops until configured). Add on
Vercel:

- `LEAVE_EMAIL_WEBHOOK_URL` / `LEAVE_EMAIL_WEBHOOK_KEY` — endpoint that emails the employee
- `WHATSAPP_WEBHOOK_URL` / `WHATSAPP_WEBHOOK_KEY` — endpoint that WhatsApps the employee
- `WHATSAPP_FROM_NUMBER` — optional sender number, forwarded in the payload

Both receive the same payload:

```json
{
  "event": "leave.status_changed",
  "source": "marketata-staff",
  "channel": "email | whatsapp",
  "toEmail": "ananya@marketadigitalit.com",
  "toPhone": "+91XXXXXXXXXX",
  "subject": "Your Paid Leave request was approved",
  "text": "Hi Ananya, ...",
  "leave": { "employeeName": "...", "employeeEmail": "...", "employeePhone": "...",
             "leaveType": "Paid Leave", "startDate": "2026-09-21",
             "endDate": "2026-09-22", "totalDays": 2, "reason": "...",
             "status": "Approved", "note": null }
}
```

Point each at a small route/function that calls your provider's HTTP API
(Resend/Brevo for email; Twilio WhatsApp, Gupshup, or 360dialog for WhatsApp).
The staff dashboard also lists **Pending Leave Requests** with inline Approve /
Reject, and approving marks those days as On Leave in attendance automatically.

If you want full CRM rules and a WhatsApp Business API key on your own number,
Twilio's docs cover the standard "send a template message" flow; the webhook can
be whatever turns this JSON into a message.

## 5. Security Notes

- Service role key is **server-only** (used in `src/lib/supabase/admin.ts`), never fetched on the client.
- RLS is enforced DB-side; server actions also check roles via `requireRole`/`isAdmin`/`isManagement`.
- Photos/documents stored in **private buckets**; the app reads them via signed URLs (`src/lib/files.ts`) — management can view all, employees only their own (RLS on `storage.objects`).
- Your `SUPABASE_SERVICE_ROLE_KEY` must never be committed. Rotate it immediately if leaked.

## 6. Testing Checklist

**Website**
- [ ] Intro animation shows once per session, auto-skips for reduced-motion
- [ ] Navbar scrolls (glass effect) and mobile menu works
- [ ] Hero slider autoplays; pause on hover; arrows/dots work
- [ ] Services carousel scrolls on desktop & mobile
- [ ] Portfolio filters work
- [ ] Testimonial slider + autoplay works
- [ ] Contact form → success toast; record appears in `website_leads` (SQL)
- [ ] Staff → Leads shows the enquiry; status pipeline + CSV export + delete work
- [ ] With `LEAD_ALERT_WEBHOOK_URL` set: submitting the form fires the webhook
- [ ] Lighthouse SEO + `/sitemap.xml`, tags render

**Auth**
- [ ] Signup creates account; profile shows `pending`
- [ ] Admin activates → full portal access
- [ ] Pending user sees "Pending Approval" screen
- [ ] Forgot/reset password flow works (check email link)
- [ ] Unauthenticated `/staff/*` redirects to login; after login returns to `next`

**Attendance**
- [ ] Clock-in requires camera permission; capture shows in preview (HTTPS or localhost)
- [ ] Clock-in denies duplicate; clock-out requires prior clock-in
- [ ] Location error shows friendly message (grant location in browser)
- [ ] Admin report: status colors, leave marking, clock-time adjustment, CSV export
- [ ] Leave approve/reject → employee notified by email & WhatsApp webhooks

**HR Modules**
- [ ] Add employee → login works with temp password
- [ ] Projects: assign members + clients; progress slider updates; non-member blocked from project page
- [ ] Tasks: assign, quick status change, employee "Update My Task" + work note
- [ ] Daily report saves and shows on dashboard and employee detail
- [ ] Leave: apply with attachment → manager Approve/Reject → balance updates
- [ ] Holidays: admin add/edit/delete; employees see list & roster holiday color
- [ ] Notifications bell shows unread; "Mark all read" clears badge
- [ ] Profile photo uploads and persists; password change works