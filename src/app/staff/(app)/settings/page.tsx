import { requireRole } from "@/lib/auth";
import { getCompanySettings } from "@/lib/queries";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireRole(["super_admin", "admin"]);
  const settings = await getCompanySettings();
  return <SettingsClient settings={settings} />;
}