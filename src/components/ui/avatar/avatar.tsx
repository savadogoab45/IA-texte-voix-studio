import { User } from "lucide-react";

import { cn } from "@/lib/cn";

export function Avatar({ src, name, className }: { src?: string | null; name?: string | null; className?: string }) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm", className)}>
      {src ? <img src={src} alt={name ?? "Avatar"} className="h-full w-full rounded-full object-cover" /> : initials || <User className="h-4 w-4" />}
    </div>
  );
}
