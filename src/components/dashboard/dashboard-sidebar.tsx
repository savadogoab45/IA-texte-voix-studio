"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioWaveform,
  ChevronDown,
  FileText,
  FolderKanban,
  Home,
  Mic2,
  Music2,
  Settings,
  Trash2,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/generations", label: "Générations", icon: Music2 },
  { href: "/dashboard/library", label: "Bibliothèque audio", icon: Music2 },
  { href: "/dashboard/voices", label: "Voix", icon: Mic2 },
] as const;

const FOOTER_ITEMS = [
  { href: "/dashboard/trash", label: "Corbeille", icon: Trash2 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-[#050b1a]">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
          <AudioWaveform className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">
            SonaGen
          </p>
          <p className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400">
            AI Audio Studio
          </p>
        </div>
      </Link>

      {/* Navigation principale */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>

      <div className="my-4 border-t border-slate-100 dark:border-slate-800/80" />

      {/* Navigation secondaire */}
      <nav className="flex flex-col gap-1">
        {FOOTER_ITEMS.map((item) => (
          <SidebarLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Profil utilisateur */}
      <button
        type="button"
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30"
      >
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white">
          AM
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            Alex Martin
          </p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            alex@sonagen.com
          </p>
        </div>
        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </button>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-indigo-600/10 to-violet-600/10 text-indigo-600 dark:from-indigo-500/15 dark:to-violet-500/15 dark:text-indigo-300"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
      }`}
    >
      <Icon className="size-[18px]" />
      {label}
    </Link>
  );
}