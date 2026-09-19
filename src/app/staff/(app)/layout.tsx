import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications } from "@/lib/queries";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PendingApprovalScreen } from "@/components/dashboard/pending-approval";

export default async function StaffAppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getCurrentUser();
  if (!user) redirect("/staff/login");

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <PendingApprovalScreen />
      </div>
    );
  }

  if (profile.status !== "active") {
    return <PendingApprovalScreen />;
  }

  const notifications = await getNotifications(20);

  return (
    <DashboardShell profile={profile} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}