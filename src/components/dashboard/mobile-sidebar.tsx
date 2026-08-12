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
          lg:hidden
        "
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-sky-500
                to-cyan-500
                text-white
              "
            >
              <Sparkles className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                AI Text Audio
              </p>

              <p className="text-xs text-slate-500">
                SaaS
              </p>
            </div>
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
            "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Principal
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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
        <div className="border-t border-slate-200 p-3">
          <SidebarUser />
        </div>
      </aside>
    </>
  );
}