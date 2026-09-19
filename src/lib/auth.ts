import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile: (profile as Profile) ?? null, supabase };
}

export async function getProfileOrNull() {
  const { profile } = await getCurrentUser();
  return profile;
}

/** Guards a staff page; redirects to login when not authenticated. */
export async function requireAuth() {
  const { user, profile, supabase } = await getCurrentUser();
  if (!user) redirect("/staff/login");
  return { user, profile: profile as Profile, supabase };
}

/** Guards a page for a specific set of roles. */
export async function requireRole(roles: Role[]) {
  const { profile } = await requireAuth();
  if (profile.status !== "active") {
    redirect("/staff/profile");
  }
  if (!roles.includes(profile.role)) {
    redirect("/staff/dashboard");
  }
  return profile;
}

/** Returns true when the logged-in user may manage company-wide records. */
export function isManagement(role?: Role | null) {
  return role === "super_admin" || role === "admin" || role === "manager";
}

export function isAdmin(role?: Role | null) {
  return role === "super_admin" || role === "admin";
}

export async function isApprovedActive(profile: Profile | null) {
  return profile?.status === "active";
}