"use client";

import Link from "next/link";
import { useState } from "react";
import { Hourglass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PendingApprovalScreen() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const { actionSignOut } = await import("@/lib/actions");
    await actionSignOut();
    window.location.href = "/staff/login";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Hourglass className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-xl font-bold">Account Pending Approval</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your employee account is awaiting approval by an administrator. You&apos;ll be able to
          use the portal as soon as it&apos;s approved. For urgent access, contact the HR or admin
          team.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handleLogout} disabled={loading}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
          <Button asChild variant="gradient">
            <Link href="/">View Company Website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}