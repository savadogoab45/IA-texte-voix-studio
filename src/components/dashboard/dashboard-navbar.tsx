"use client";

import { Bell } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type DashboardNavbarProps = {
  title?: string;
};

export function DashboardNavbar({
  title = "Tableau de bord",
}: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="shrink-0 rounded-lg" />

        <h1 className="truncate text-lg font-semibold text-slate-900">
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="size-5" />

          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-sky-500" />
        </Button>
      </div>
    </header>
  );
}