"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  FileText,
  FolderOpen,
  Home,
  Sparkles,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarUser } from "./sidebar-user";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Générations",
    href: "/dashboard/generations",
    icon: Sparkles,
  },
  {
    label: "Projets",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    label: "Voix",
    href: "/dashboard/voices",
    icon: AudioLines,
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
];

export function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
      />

      {/* Sidebar */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-xl
          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          lg:hidden
        "
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-[#1e3354]">
          
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-white">
              <AudioLines className="h-5 w-5" />
            </span>
            <span className="truncate text-[15px] font-extrabold">
              AI Text Audio{" "}
              <span className="text-blue-600 dark:text-cyan-400">
                Studio
              </span>
            </span>
          </Link>
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="
              rounded-lg
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100
            "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Principal
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#10213d] dark:hover:text-slate-100",
                  )}
                >
                  <Icon className="size-[18px]" />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-slate-200 p-3 dark:border-[#1e3354]">
          <SidebarUser />
        </div>
      </aside>
    </>
  );
}