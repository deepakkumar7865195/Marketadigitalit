import { requireRole } from "@/lib/auth";
import { isManagement } from "@/lib/auth";
import { getLeaves, getMyLeaves } from "@/lib/queries";
import { LeavesClient } from "@/components/leaves/leaves-client";

export const metadata = { title: "Leaves" };

export default async function LeavesPage() {
  const profile = await requireRole(["super_admin", "admin", "manager", "employee"]);
  const management = isManagement(profile.role);
  const isAdminRole = profile.role === "super_admin" || profile.role === "admin";
  const [myLeaves, allLeaves] = management
    ? await Promise.all([getMyLeaves(), getLeaves()])
    : await Promise.all([getMyLeaves(), Promise.resolve([])]);

  return <LeavesClient myLeaves={myLeaves} allLeaves={allLeaves} currentUser={profile} isManagement={management} canApply={!isAdminRole} />;
}