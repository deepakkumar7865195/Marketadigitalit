import { requireRole } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";
import { getWebsiteLeads } from "@/lib/queries";
import { LeadsClient } from "@/components/leads/leads-client";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const profile = await requireRole(["super_admin", "admin", "manager"]);
  const leads = await getWebsiteLeads();

  return <LeadsClient leads={leads} isAdmin={isAdmin(profile.role)} />;
}