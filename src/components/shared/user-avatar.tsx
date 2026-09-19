"use client";

import { cn, initials } from "@/lib/utils";
import { useFileUrl } from "@/hooks/use-file-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  photoPath?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({ name, photoPath, className, fallbackClassName }: UserAvatarProps) {
  const { url } = useFileUrl("avatars", photoPath);
  return (
    <Avatar className={className}>
      {url ? <AvatarImage src={url} alt={name ?? "User"} /> : null}
      <AvatarFallback className={cn("bg-primary/10 font-semibold text-primary", fallbackClassName)}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}