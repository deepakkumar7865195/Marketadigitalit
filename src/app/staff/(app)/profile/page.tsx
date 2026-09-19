import { requireAuth } from "@/lib/auth";
import { ProfileClient } from "@/components/profile/profile-client";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { profile } = await requireAuth();
  return <ProfileClient profile={profile} />;
}