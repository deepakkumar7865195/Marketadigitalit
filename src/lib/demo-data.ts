// In-memory dataset used by demo mode (NEXT_PUBLIC_DEMO_AUTH=true).
// Lets you explore the whole staff portal without a Supabase backend.
// Server actions mutate these arrays for the lifetime of the dev process.

const y = new Date().getFullYear();

function dateOnly(d: Date) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}
function daysAgo(n: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
}
const todayKey = dateOnly(new Date());

// prettier-ignore
export const DEMO_ADMIN_ID = "u-demo";

// prettier-ignore
export const db: Record<string, any[]> = {
  company_settings: [
    {
      id: "cs-1",
      company_name: "Marketa Digital IT",
      logo_url: null,
      office_start_time: "09:30:00",
      office_end_time: "18:30:00",
      late_grace_minutes: 15,
      half_day_minutes: 240,
      timezone: "Asia/Kolkata",
      updated_at: daysAgo(30, 10, 0).toISOString(),
    },
  ] as any[],

  profiles: [
    { id: "u-demo", employee_code: "MDI-1001", full_name: "Demo Admin", email: "demo@marketadigitalit.in", phone: "+91 90000 00001", profile_photo_url: null, designation: "Founder & Director", department: "Management", joining_date: "2023-04-01", role: "super_admin", status: "active", address: "Andheri East, Mumbai", emergency_contact: "+91 90000 00009", demo_password: "Demo@1234", created_at: daysAgo(520, 10, 0).toISOString(), updated_at: daysAgo(1, 12, 0).toISOString() },
    { id: "u-adm", employee_code: "MDI-1002", full_name: "Priya Sharma", email: "priya@marketadigitalit.in", phone: "+91 90000 00002", profile_photo_url: null, designation: "HR & Operations Head", department: "Administration", joining_date: "2023-06-15", role: "admin", status: "active", address: "Powai, Mumbai", emergency_contact: "+91 90000 00008", demo_password: "Priya@1234", created_at: daysAgo(460, 11, 0).toISOString(), updated_at: daysAgo(2, 9, 30).toISOString() },
    { id: "u-mgr", employee_code: "MDI-1003", full_name: "Rahul Verma", email: "rahul@marketadigitalit.in", phone: "+91 90000 00003", profile_photo_url: null, designation: "Senior Project Manager", department: "Project Management", joining_date: "2023-09-01", role: "manager", status: "active", address: "Borivali, Mumbai", emergency_contact: "+91 90000 00007", demo_password: "Rahul@1234", created_at: daysAgo(330, 10, 30).toISOString(), updated_at: daysAgo(1, 18, 0).toISOString() },
    { id: "u-em1", employee_code: "MDI-1004", full_name: "Ananya Patel", email: "ananya@marketadigitalit.in", phone: "+91 90000 00004", profile_photo_url: null, designation: "SEO Specialist", department: "Search", joining_date: "2024-01-08", role: "employee", status: "active", address: "Thane", emergency_contact: "+91 90000 00006", demo_password: "Ananya@1234", created_at: daysAgo(240, 9, 0).toISOString(), updated_at: daysAgo(0, 9, 45).toISOString() },
    { id: "u-em2", employee_code: "MDI-1005", full_name: "Kabir Singh", email: "kabir@marketadigitalit.in", phone: "+91 90000 00005", profile_photo_url: null, designation: "SEO Executive", department: "Search", joining_date: "2024-03-18", role: "employee", status: "active", address: "Andheri West, Mumbai", emergency_contact: "+91 90000 00006", demo_password: "Kabir@1234", created_at: daysAgo(180, 11, 15).toISOString(), updated_at: daysAgo(0, 18, 15).toISOString() },
    { id: "u-em3", employee_code: "MDI-1006", full_name: "Meera Joshi", email: "meera@marketadigitalit.in", phone: "+91 90000 00010", profile_photo_url: null, designation: "Performance Marketing Lead", department: "Paid Media", joining_date: "2024-05-06", role: "employee", status: "active", address: "Dadar, Mumbai", emergency_contact: "+91 90000 00011", demo_password: "Meera@1234", created_at: daysAgo(120, 10, 45).toISOString(), updated_at: daysAgo(0, 10, 10).toISOString() },
    { id: "u-em4", employee_code: "MDI-1007", full_name: "Arjun Nair", email: "arjun@marketadigitalit.in", phone: "+91 90000 00012", profile_photo_url: null, designation: "Meta Ads Specialist", department: "Paid Media", joining_date: "2024-07-22", role: "employee", status: "active", address: "Bandra, Mumbai", emergency_contact: "+91 90000 00013", demo_password: "Arjun@1234", created_at: daysAgo(90, 11, 0).toISOString(), updated_at: daysAgo(3, 9, 30).toISOString() },
    { id: "u-em5", employee_code: "MDI-1008", full_name: "Sana Khan", email: "sana@marketadigitalit.in", phone: "+91 90000 00014", profile_photo_url: null, designation: "Frontend Developer", department: "Web", joining_date: "2024-10-09", role: "employee", status: "active", address: "Kurla, Mumbai", emergency_contact: "+91 90000 00015", demo_password: "Sana@1234", created_at: daysAgo(60, 9, 45).toISOString(), updated_at: daysAgo(0, 18, 30).toISOString() },
  ] as any[],

  clients: [
    { id: "c-1", company_name: "Bakers Street", contact_person: "Nikhil K.", email: "nikhil@bakersstreet.in", phone: "+91 98220 00121", website: "https://bakersstreet.in", address: "Juhu, Mumbai", service: "Google Ads", status: "Active", notes: "High-intent bakery franchise; scaling PPC month over month.", created_by: "u-demo", created_at: daysAgo(200, 12, 0).toISOString(), updated_at: daysAgo(4, 16, 0).toISOString() },
    { id: "c-2", company_name: "FinEdge Wealth", contact_person: "Meher Tata", email: "meher@finedge.in", phone: "+91 98220 00122", website: "https://finedge.in", address: "Lower Parel, Mumbai", service: "SEO", status: "Active", notes: "B2B financial consultancy; focus on qualified lead SEO.", created_by: "u-demo", created_at: daysAgo(220, 15, 0).toISOString(), updated_at: daysAgo(2, 11, 20).toISOString() },
    { id: "c-3", company_name: "UrbanNest Interiors", contact_person: "Radhika Iyer", email: "radhika@urbannest.in", phone: "+91 98220 00123", website: "https://urbannest.in", address: "Pune", service: "Local SEO / GBP", status: "Lead", notes: "Wants map-pack domination across 6 cities.", created_by: "u-adm", created_at: daysAgo(10, 14, 0).toISOString(), updated_at: daysAgo(1, 10, 0).toISOString() },
    { id: "c-4", company_name: "PayPro Technologies", contact_person: "Siddharth Rao", email: "sid@paypro.io", phone: "+91 98220 00124", website: "https://paypro.io", address: "Hinjewadi, Pune", service: "Meta Ads", status: "Active", notes: "SaaS payments; paused spend for Q3 review.", created_by: "u-mgr", created_at: daysAgo(160, 13, 0).toISOString(), updated_at: daysAgo(6, 17, 0).toISOString() },
  ] as any[],

  projects: [
    { id: "p-1", name: "Bakers Street — PPC Scale Up", client_id: "c-1", description: "Scale profitable Google campaigns while controlling CAC.", start_date: "2025-07-01", due_date: "2026-02-28", status: "Active", priority: "High", progress: 62, created_by: "u-mgr", created_at: daysAgo(150, 9, 0).toISOString(), updated_at: daysAgo(0, 9, 0).toISOString() },
    { id: "p-2", name: "FinEdge SEO Engine", client_id: "c-2", description: "Organic-first engine targeting B2B wealth keywords.", start_date: "2025-08-15", due_date: "2026-03-31", status: "Active", priority: "Urgent", progress: 78, created_by: "u-mgr", created_at: daysAgo(120, 10, 0).toISOString(), updated_at: daysAgo(1, 12, 0).toISOString() },
    { id: "p-3", name: "UrbanNest Local Map Pack", client_id: "c-3", description: "Local SEO + GBP optimisation across 6 cities.", start_date: "2026-03-01", due_date: "2026-06-30", status: "Planning", priority: "Medium", progress: 15, created_by: "u-adm", created_at: daysAgo(8, 11, 0).toISOString(), updated_at: daysAgo(1, 9, 30).toISOString() },
    { id: "p-4", name: "PayPro Meta Lead Engine", client_id: "c-4", description: "Meta pipeline for international SaaS demos.", start_date: "2025-09-01", due_date: "2026-01-31", status: "On Hold", priority: "High", progress: 40, created_by: "u-mgr", created_at: daysAgo(100, 13, 0).toISOString(), updated_at: daysAgo(6, 16, 30).toISOString() },
    { id: "p-5", name: "Marketata Website 2.0", client_id: null, description: "Rebuild of our own marketing website & this portal.", start_date: "2025-12-01", due_date: "2026-04-15", status: "Active", priority: "Medium", progress: 55, created_by: "u-demo", created_at: daysAgo(45, 9, 15).toISOString(), updated_at: daysAgo(0, 11, 30).toISOString() },
  ] as any[],

  // prettier-ignore
  project_members: [
    { id: "pm-1", project_id: "p-1", user_id: "u-mgr", assigned_at: daysAgo(150, 9, 0).toISOString() },
    { id: "pm-2", project_id: "p-1", user_id: "u-em1", assigned_at: daysAgo(150, 9, 5).toISOString() },
    { id: "pm-3", project_id: "p-1", user_id: "u-em2", assigned_at: daysAgo(150, 9, 10).toISOString() },
    { id: "pm-4", project_id: "p-2", user_id: "u-mgr", assigned_at: daysAgo(120, 10, 0).toISOString() },
    { id: "pm-5", project_id: "p-2", user_id: "u-em1", assigned_at: daysAgo(120, 10, 5).toISOString() },
    { id: "pm-6", project_id: "p-2", user_id: "u-em3", assigned_at: daysAgo(120, 10, 10).toISOString() },
    { id: "pm-7", project_id: "p-3", user_id: "u-mgr", assigned_at: daysAgo(8, 11, 0).toISOString() },
    { id: "pm-8", project_id: "p-3", user_id: "u-em1", assigned_at: daysAgo(8, 11, 5).toISOString() },
    { id: "pm-9", project_id: "p-4", user_id: "u-mgr", assigned_at: daysAgo(100, 13, 0).toISOString() },
    { id: "pm-10", project_id: "p-4", user_id: "u-em3", assigned_at: daysAgo(100, 13, 5).toISOString() },
    { id: "pm-11", project_id: "p-5", user_id: "u-demo", assigned_at: daysAgo(45, 9, 15).toISOString() },
    { id: "pm-12", project_id: "p-5", user_id: "u-em5", assigned_at: daysAgo(45, 9, 20).toISOString() },
    { id: "pm-13", project_id: "p-5", user_id: "u-em2", assigned_at: daysAgo(45, 9, 25).toISOString() },
  ] as any[],

  // prettier-ignore
  tasks: [
    { id: "t-1", project_id: "p-1", assigned_to: "u-em1", assigned_by: "u-mgr", title: "Build 45 new Exact-match keyword groups", description: "Group by geo + intent for the bakery franchise.", priority: "High", status: "In Progress", due_date: dateOnly(daysAgo(-6, 0, 0)), completed_at: null, work_update: "12 groups done; 33 remaining.", created_at: daysAgo(20, 10, 0).toISOString(), updated_at: daysAgo(0, 9, 45).toISOString() },
    { id: "t-2", project_id: "p-1", assigned_to: "u-em2", assigned_by: "u-mgr", title: "Weekly search-term report for Bakers Street", description: "", priority: "Medium", status: "Completed", due_date: dateOnly(daysAgo(2, 0, 0)), completed_at: daysAgo(2, 16, 45).toISOString(), work_update: "Shared on Drive + Slack.", created_at: daysAgo(10, 11, 0).toISOString(), updated_at: daysAgo(2, 16, 45).toISOString() },
    { id: "t-3", project_id: "p-1", assigned_to: "u-em2", assigned_by: "u-mgr", title: "Landing page QA fixes", description: "Mobile speed + form prefill issues flagged.", priority: "Medium", status: "Under Review", due_date: dateOnly(daysAgo(-3, 0, 0)), completed_at: null, work_update: "", created_at: daysAgo(8, 12, 0).toISOString(), updated_at: daysAgo(1, 15, 10).toISOString() },
    { id: "t-4", project_id: "p-2", assigned_to: "u-em1", assigned_by: "u-mgr", title: "Publish 6 SEO blogs for FinEdge", description: "B2B wealth management long-tail.", priority: "High", status: "In Progress", due_date: dateOnly(daysAgo(-12, 0, 0)), completed_at: null, work_update: "4 published.", created_at: daysAgo(30, 10, 30).toISOString(), updated_at: daysAgo(0, 10, 20).toISOString() },
    { id: "t-5", project_id: "p-2", assigned_to: "u-em3", assigned_by: "u-mgr", title: "CRO: form conversion tweaks", description: "Reduce fields; add social proof.", priority: "Medium", status: "Not Started", due_date: dateOnly(daysAgo(-8, 0, 0)), completed_at: null, work_update: "", created_at: daysAgo(5, 9, 0).toISOString(), updated_at: daysAgo(5, 9, 0).toISOString() },
    { id: "t-6", project_id: "p-3", assigned_to: "u-em1", assigned_by: "u-adm", title: "NAP audit across 40 directories", description: "", priority: "Low", status: "Completed", due_date: dateOnly(daysAgo(2, 0, 0)), completed_at: daysAgo(3, 18, 0).toISOString(), work_update: "Fixed 12 mismatches.", created_at: daysAgo(7, 14, 0).toISOString(), updated_at: daysAgo(3, 18, 0).toISOString() },
    { id: "t-7", project_id: "p-4", assigned_to: "u-em3", assigned_by: "u-mgr", title: "Creative refresh — Q3", description: "Paused pending client budget approval.", priority: "High", status: "Blocked", due_date: dateOnly(daysAgo(-15, 0, 0)), completed_at: null, work_update: "Waiting on client.", created_at: daysAgo(25, 13, 0).toISOString(), updated_at: daysAgo(6, 16, 0).toISOString() },
    { id: "t-8", project_id: "p-5", assigned_to: "u-em5", assigned_by: "u-demo", title: "Dark mode polish", description: "All staff pages + charts.", priority: "Medium", status: "In Progress", due_date: dateOnly(daysAgo(-4, 0, 0)), completed_at: null, work_update: "90% done.", created_at: daysAgo(12, 9, 45).toISOString(), updated_at: daysAgo(0, 11, 0).toISOString() },
    { id: "t-9", project_id: "p-5", assigned_to: "u-em2", assigned_by: "u-demo", title: "Accessibility pass", description: "Contrast, focus states, ARIA.", priority: "Low", status: "Not Started", due_date: dateOnly(daysAgo(-2, 0, 0)), completed_at: null, work_update: "", created_at: daysAgo(9, 11, 15).toISOString(), updated_at: daysAgo(9, 11, 15).toISOString() },
    { id: "t-10", project_id: "p-1", assigned_to: "u-em3", assigned_by: "u-mgr", title: "Search-intent research for new segments", description: "", priority: "Medium", status: "Completed", due_date: dateOnly(daysAgo(6, 0, 0)), completed_at: daysAgo(7, 17, 30).toISOString(), work_update: "", created_at: daysAgo(15, 10, 0).toISOString(), updated_at: daysAgo(7, 17, 30).toISOString() },
  ] as any[],

  // prettier-ignore
  daily_work_reports: [
    { id: "r-1", user_id: "u-em1", report_date: dateOnly(daysAgo(1, 0, 0)), project_id: "p-1", task_id: "t-1", work_summary: "Wrote 12 keyword groups and started the negative-list for exact match.", hours_spent: 6.5, status: "In Progress", proof_url: null, created_at: daysAgo(1, 18, 30).toISOString(), updated_at: daysAgo(1, 18, 30).toISOString() },
    { id: "r-2", user_id: "u-em1", report_date: todayKey, project_id: "p-2", task_id: "t-4", work_summary: "Published the 4th FinEdge blog; drafted outline for blogs 5-6.", hours_spent: 7, status: "In Progress", proof_url: null, created_at: daysAgo(0, 18, 20).toISOString(), updated_at: daysAgo(0, 18, 20).toISOString() },
    { id: "r-3", user_id: "u-em2", report_date: todayKey, project_id: "p-1", task_id: "t-2", work_summary: "Compiled weekly search-term report and flagged 8 new negatives.", hours_spent: 5, status: "Completed", proof_url: null, created_at: daysAgo(0, 18, 40).toISOString(), updated_at: daysAgo(0, 18, 40).toISOString() },
    { id: "r-4", user_id: "u-em5", report_date: todayKey, project_id: "p-5", task_id: "t-8", work_summary: "Finished dark mode tokens and applied to attendance charts.", hours_spent: 7, status: "In Progress", proof_url: null, created_at: daysAgo(0, 19, 5).toISOString(), updated_at: daysAgo(0, 19, 5).toISOString() },
  ] as any[],

  // prettier-ignore
  leave_requests: [
    { id: "lv-1", user_id: "u-em4", leave_type: "Casual Leave", start_date: dateOnly(daysAgo(-4, 0, 0)), end_date: dateOnly(daysAgo(-3, 0, 0)), total_days: 2, reason: "Family function.", attachment_path: null, status: "Approved", reviewed_by: "u-adm", review_note: "Approved", reviewed_at: daysAgo(6, 12, 0).toISOString(), created_at: daysAgo(8, 9, 30).toISOString(), updated_at: daysAgo(6, 12, 0).toISOString() },
    { id: "lv-2", user_id: "u-em5", leave_type: "Sick Leave", start_date: dateOnly(daysAgo(-9, 0, 0)), end_date: dateOnly(daysAgo(-9, 0, 0)), total_days: 1, reason: "Fever.", attachment_path: null, status: "Approved", reviewed_by: "u-adm", review_note: "", reviewed_at: daysAgo(10, 15, 0).toISOString(), created_at: daysAgo(8, 8, 30).toISOString(), updated_at: daysAgo(10, 15, 0).toISOString() },
    { id: "lv-3", user_id: "u-em1", leave_type: "Work From Home", start_date: dateOnly(daysAgo(3, 0, 0)), end_date: dateOnly(daysAgo(3, 0, 0)), total_days: 1, reason: "Plumber visit at home.", attachment_path: null, status: "Pending", reviewed_by: null, review_note: null, reviewed_at: null, created_at: daysAgo(0, 10, 5).toISOString(), updated_at: daysAgo(0, 10, 5).toISOString() },
    { id: "lv-4", user_id: "u-em2", leave_type: "Paid Leave", start_date: dateOnly(daysAgo(6, 0, 0)), end_date: dateOnly(daysAgo(7, 0, 0)), total_days: 2, reason: "Weekend trip.", attachment_path: null, status: "Pending", reviewed_by: null, review_note: null, reviewed_at: null, created_at: daysAgo(2, 13, 30).toISOString(), updated_at: daysAgo(2, 13, 30).toISOString() },
  ] as any[],

  // prettier-ignore
  notifications: [
    { id: "n-1", user_id: "u-demo", title: "New website enquiry", message: "New lead from Nikhil K. (nikhil@bakersstreet.in) — Web Development enquiry.", type: "lead", read: false, created_at: daysAgo(0, 9, 20).toISOString() },
    { id: "n-2", user_id: "u-demo", title: "Leave request pending", message: "Ananya Patel requested Work From Home for one day.", type: "leave", read: false, created_at: daysAgo(0, 10, 5).toISOString() },
    { id: "n-3", user_id: "u-demo", title: "Welcome to Marketa Digital IT", message: "Your account was created successfully.", type: "general", read: true, created_at: daysAgo(520, 10, 0).toISOString() },
  ] as any[],

  // prettier-ignore
  website_leads: [
    { id: "ld-1", name: "Rohan Gupta", email: "rohan@nesthomes.in", phone: "+91 98111 22334", company: "Nest Homes", service: "Google Ads", budget: "₹50k – 1L/month", message: "We want more qualified leads for our premium flats project across Navi Mumbai.", status: "new", created_at: daysAgo(0, 9, 18).toISOString() },
    { id: "ld-2", name: "Farah Alvi", email: "farah@drsmile.in", phone: "+91 98111 22335", company: "Dr Smile Dental", service: "Local SEO / GBP", budget: "₹20k – 50k/month", message: "Map pack presence is weak in Andheri. Can you help?", status: "contacted", created_at: daysAgo(2, 14, 40).toISOString() },
    { id: "ld-3", name: "Vikram Mehta", email: "vikram@tideup.in", phone: "+91 98111 22336", company: "TideUp Finance", service: "SEO", budget: "₹1L+ /month", message: "Interested in a 6-month SEO engagement for our lending platform.", status: "qualified", created_at: daysAgo(5, 11, 10).toISOString() },
    { id: "ld-4", name: "Sneha Kulkarni", email: "sneha@greenleaf.io", phone: "+91 98111 22337", company: "GreenLeaf Organics", service: "Full Funnel", budget: "₹50k – 1L/month", message: "Full-funnel support needed for our D2C brand.", status: "converted", created_at: daysAgo(9, 16, 25).toISOString() },
  ] as any[],
};

// ---- Attendance seeded for the last 14 days (including weekends as Holiday) ----
const UIDS = ["u-demo", "u-adm", "u-mgr", "u-em1", "u-em2", "u-em3", "u-em4", "u-em5"];

// prettier-ignore
const walks: any[] = [];
for (let i = 13; i >= 0; i--) {
  const d = daysAgo(i, 9, 30);
  const key = dateOnly(d);
  const weekend = d.getDay() === 0 || d.getDay() === 6;
  for (const uid of UIDS) {
    let status = "Present";
    let late = false;
    if (weekend) {
      status = "Holiday";
    } else if (i === 0) {
      if (uid === "u-em3") { status = "Late"; late = true; }
      else if (uid === "u-em4") { status = "On Leave"; }
      else if (uid === "u-em5") { status = "Absent"; }
    } else if ((uid === "u-em3" && i % 5 === 1)) {
      status = "Late"; late = true;
    } else if (uid === "u-em4" && i % 6 === 2) {
      status = "On Leave";
    }
    const inH = late ? 10 : 9;
    const inM = late ? 5 + (i % 20) : 30 + (i % 12);
    const outH = late ? 18 : 18;
    const outM = late ? 45 : 20 + (i % 25);
    if (status === "Holiday" || status === "On Leave" || status === "Absent") {
      walks.push({
        id: `att-${key}-${uid}`,
        user_id: uid,
        attendance_date: key,
        clock_in: null,
        clock_out: null,
        clock_in_photo_path: null,
        clock_out_photo_path: null,
        clock_in_latitude: 19.1136,
        clock_in_longitude: 72.8697,
        clock_in_accuracy: 24.0,
        clock_out_accuracy: null,
        work_minutes: null,
        status,
        notes: null,
        created_at: daysAgo(i, 9, 31).toISOString(),
        updated_at: daysAgo(i, 18, 46).toISOString(),
      });
      continue;
    }
    const fin = daysAgo(i, inH, inM);
    const fout = daysAgo(i, outH, outM);
    walks.push({
      id: `att-${key}-${uid}`,
      user_id: uid,
      attendance_date: key,
      clock_in: fin.toISOString(),
      clock_out: fout.toISOString(),
      clock_in_photo_path: null,
      clock_out_photo_path: null,
      clock_in_latitude: 19.1136,
      clock_in_longitude: 72.8697,
      clock_in_accuracy: 24.0,
      clock_out_latitude: 19.1136,
      clock_out_longitude: 72.8697,
      clock_out_accuracy: 26.0,
      work_minutes: Math.max(0, Math.round((fout.getTime() - fin.getTime()) / 60000)),
      status,
      notes: null,
      created_at: daysAgo(i, inH, inM + 1).toISOString(),
      updated_at: daysAgo(i, outH, outM + 1).toISOString(),
    });
  }
}
db.attendance = walks;

// prettier-ignore
db.holidays = [
  { id: "h-1", title: "Republic Day", description: "National holiday.", holiday_date: `${y}-01-26`, type: "National Holiday", created_by: "u-demo", created_at: daysAgo(300, 10, 0).toISOString() },
  { id: "h-2", title: "Independence Day", description: "National holiday.", holiday_date: `${y}-08-15`, type: "National Holiday", created_by: "u-demo", created_at: daysAgo(220, 10, 0).toISOString() },
  { id: "h-3", title: "Gandhi Jayanti", description: "National holiday.", holiday_date: `${y}-10-02`, type: "National Holiday", created_by: "u-demo", created_at: daysAgo(180, 10, 0).toISOString() },
  { id: "h-4", title: "Team Offsite — Alibaug", description: "Annual team retreat.", holiday_date: dateOnly(daysAgo(-14, 0, 0)), type: "Company Holiday", created_by: "u-demo", created_at: daysAgo(30, 12, 0).toISOString() },
];

export const seedProfileByEmail = (email: string) =>
  db.profiles.find((p) => p.email?.toLowerCase() === String(email).toLowerCase()) ?? null;

// Displayed on the login page in demo mode so each account can be tried.
export const DEMO_ACCOUNTS: { name: string; role: string; email: string; password: string }[] =
  db.profiles.map((p) => ({
    name: p.full_name ?? p.email,
    role: p.role,
    email: p.email,
    password: p.demo_password,
  })) as any;