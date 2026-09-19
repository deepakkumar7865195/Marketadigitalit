"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck2,
  CircleCheck,
  ListTodo,
  LogOut,
  Menu,
  Settings,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import { actionMarkNotificationsRead } from "@/lib/actions";
import type { Notification, Profile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/user-avatar";

interface TopbarProps {
  profile: Profile;
  notifications: Notification[];
  onOpenSidebar: () => void;
}

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/staff/dashboard", title: "Dashboard" },
  { prefix: "/staff/employees", title: "Employees" },
  { prefix: "/staff/attendance", title: "Attendance" },
  { prefix: "/staff/projects", title: "Projects" },
  { prefix: "/staff/tasks", title: "Tasks & Daily Work" },
  { prefix: "/staff/leaves", title: "Leaves" },
  { prefix: "/staff/holidays", title: "Holidays" },
  { prefix: "/staff/clients", title: "Clients" },
  { prefix: "/staff/profile", title: "Profile" },
  { prefix: "/staff/settings", title: "Settings" },
];

function iconFor(type: string) {
  if (type === "leave") return { Icon: CalendarCheck2, className: "text-violet-500" };
  if (type === "task") return { Icon: ListTodo, className: "text-sky-500" };
  if (type === "attendance") return { Icon: CircleCheck, className: "text-emerald-500" };
  return { Icon: Bell, className: "text-blue-500" };
}

export function Topbar({ profile, notifications, onOpenSidebar }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(notifications.filter((n) => !n.read).length);
  const title = useMemo(
    () => TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Portal",
    [pathname]
  );

  async function markAllRead() {
    await actionMarkNotificationsRead();
    setUnread(0);
  }

  async function handleLogout() {
    const { actionSignOut } = await import("@/lib/actions");
    await actionSignOut();
    window.location.href = "/staff/login";
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="font-display text-lg font-bold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unread > 0 ? (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              ) : null}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                notifications.slice(0, 15).map((n) => {
                  const { Icon, className } = iconFor(n.type);
                  return (
                    <div key={n.id} className={cn("flex gap-3 border-b px-4 py-3", !n.read && "bg-primary/[0.03]")}>
                      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted", className)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug">{n.title}</p>
                        {n.message ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                        ) : null}
                        <p className="mt-1 text-[11px] text-muted-foreground/70">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read ? <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2.5 rounded-full p-1.5 pr-3">
              <UserAvatar name={profile.full_name} photoPath={profile.profile_photo_url} className="h-8 w-8" />
              <span className="hidden text-left sm:block">
                <span className="block max-w-[140px] truncate text-sm font-semibold leading-tight">
                  {profile.full_name}
                </span>
                <span className="block text-xs text-muted-foreground leading-tight">
                  {profile.designation ?? "Employee"}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <span className="font-semibold">{profile.full_name}</span>
              <span className="block text-xs text-muted-foreground">{profile.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/staff/profile" className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            {(profile.role === "admin" || profile.role === "super_admin") && (
              <DropdownMenuItem asChild>
                <Link href="/staff/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}