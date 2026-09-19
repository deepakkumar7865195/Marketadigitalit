// Demo-mode flags shared between server, client and edge middleware.
// Set NEXT_PUBLIC_DEMO_AUTH=true in your .env.local to explore the staff
// portal WITHOUT a Supabase backend. Production (no flag) uses real Supabase.

export const DEMO_SESSION_COOKIE = "marketata_demo";
export const DEMO_EMAIL = "demo@marketadigitalit.in";
export const DEMO_PASSWORD = "Demo@1234";

export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_AUTH === "true";
}