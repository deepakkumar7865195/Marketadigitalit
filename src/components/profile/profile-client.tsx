"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, KeyRound, Loader2, Save } from "lucide-react";
import type { Profile } from "@/types";
import { actionChangePassword, actionUpdateProfile, actionUpdateProfilePhoto } from "@/lib/actions";
import { getBrowserClient, uploadToBucket } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";

export function ProfileClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSavingProfile(true);
    const result = await actionUpdateProfile({
      fullName: String(form.get("fullName") ?? profile.full_name),
      phone: String(form.get("phone") ?? "") || null,
      designation: String(form.get("designation") ?? "") || null,
      department: String(form.get("department") ?? "") || null,
      address: String(form.get("address") ?? "") || null,
      emergencyContact: String(form.get("emergencyContact") ?? "") || null,
    });
    setSavingProfile(false);
    if (result.success) {
      toast.success("Profile updated");
      router.refresh();
    } else toast.error(result.error ?? "Update failed");
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSavingPhoto(true);
    try {
      const supabase = await getBrowserClient();
      const path = await uploadToBucket(
        supabase,
        "avatars",
        `avatars/${profile.id}/profile.jpg`,
        file,
        file.type
      );
      const result = await actionUpdateProfilePhoto(path);
      if (result.success) {
        toast.success("Photo updated");
        // Bust cache so the avatar refreshes
        window.location.reload();
        router.refresh();
      } else toast.error(result.error ?? "Update failed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Photo upload failed");
    } finally {
      setSavingPhoto(false);
    }
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (password !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    const result = await actionChangePassword({
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword: password,
      confirmPassword: confirm,
    });
    setSavingPassword(false);
    if (result.success) {
      toast.success("Password changed");
      e.currentTarget.reset();
    } else toast.error(result.error ?? "Password change failed");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <UserAvatar
            name={profile.full_name}
            photoPath={profile.profile_photo_url}
            className="h-28 w-28 rounded-2xl"
            fallbackClassName="bg-primary text-2xl text-white"
          />
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm text-muted-foreground hover:border-primary">
            {savingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {savingPhoto ? "Uploading..." : "Upload New Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </label>
          <p className="text-xs text-muted-foreground">JPG or PNG. Max 2MB recommended.</p>
          <div className="w-full rounded-xl bg-muted/50 p-4 text-left text-sm">
            <p className="text-muted-foreground">Employee Code</p>
            <p className="font-semibold">{profile.employee_code ?? "Not assigned"}</p>
            <p className="mt-2 text-muted-foreground">Email</p>
            <p className="font-semibold">{profile.email}</p>
            <p className="mt-2 text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">{profile.role}</p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={saveProfile} className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required defaultValue={profile.full_name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" defaultValue={profile.designation ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" defaultValue={profile.department ?? ""} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" rows={2} defaultValue={profile.address ?? ""} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" name="emergencyContact" defaultValue={profile.emergency_contact ?? ""} />
            </div>
          </CardContent>
          <div className="px-6 pb-4">
            <Button type="submit" variant="gradient" disabled={savingProfile}>
              <Save className="mr-2 h-4 w-4" /> {savingProfile ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
              </div>
            </div>
            <Button type="submit" variant="outline" disabled={savingPassword}>
              {savingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}