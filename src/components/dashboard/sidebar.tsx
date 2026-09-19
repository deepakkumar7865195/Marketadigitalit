"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_ITEMS, ROLE_LABELS } from "@/lib/constants";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";

interface SidebarProps {
  profile: Profile;
  onNavigate?: () => void;
}

export function Sidebar({ profile, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const visibleSections = SIDEBAR_ITEMS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || item.roles.includes(profile.role)
    ),
  })).filter((section) => section.items.length > 0);

  async function handleLogout() {
    const { actionSignOut } = await import("@/lib/actions");
    await actionSignOut();
    window.location.href = "/staff/login";
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/staff/dashboard" className="flex items-center gap-2.5 px-5 pb-6 pt-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 shadow-md shadow-blue-600/30">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </span>
        <span className="font-display text-base font-bold text-navy">
          Marketa<span className="text-sky-500"> IT</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {visibleSections.map((section) => (
          <div key={section.section}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {section.section}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active =
                  item.href === "/staff/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <UserAvatar name={profile.full_name} photoPath={profile.profile_photo_url} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{profile.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ROLE_LABELS[profile.role] ?? profile.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}