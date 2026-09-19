import { getHolidays } from "@/lib/queries";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { HolidaysClient } from "@/components/holidays/holidays-client";

export const metadata = { title: "Holidays" };

export default async function HolidaysPage() {
  const { profile } = await getCurrentUser();
  const holidays = await getHolidays();

  return <HolidaysClient holidays={holidays} isAdmin={isAdmin(profile?.role)} />;
}