"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarUser } from "./sidebar-user";

type SidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
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

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();

  const isNavigationActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const toggleSidebar = () => {
    onCollapsedChange?.(!collapsed);
  };

  return (
    <aside
      className={cn(
        `
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-[width]
          duration-300
          ease-in-out
          lg:flex

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
        `,
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* =========================================
          HEADER
          ========================================= */}
      <div
        className={cn(
          `
            relative
            flex
            h-16
            shrink-0
            items-center
            border-b
            border-slate-200

            dark:border-[#1e3354]
          `,
          collapsed
            ? "justify-center px-2"
            : "px-5"
        )}
      >
        {!collapsed ? (
          <Link
            href="/dashboard"
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-sky-500
                to-cyan-500
                text-white
                shadow-sm
              "
            >
              <Sparkles className="size-5" />
            </div>

            <div className="flex min-w-0 flex-col">
              <span
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-900

                  dark:text-slate-100
                "
              >
                AI Text Audio
              </span>

              <span
                className="
                  text-xs
                  text-slate-500

                  dark:text-slate-400
                "
              >
                SaaS
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            title="AI Text Audio"
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
              shadow-sm
            "
          >
            <Sparkles className="size-5" />
          </Link>
        )}

        {/* =========================================
            COLLAPSE BUTTON
            ========================================= */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            collapsed
              ? "Ouvrir le menu"
              : "Réduire le menu"
          }
          title={
            collapsed
              ? "Ouvrir le menu"
              : "Réduire le menu"
          }
          className={cn(
            `
              absolute
              flex
              size-7
              items-center
              justify-center
              rounded-md
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition-colors

              hover:bg-slate-50
              hover:text-slate-900

              dark:border-[#1e3354]
              dark:bg-[#0b1830]
              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100
            `,
            collapsed
              ? "-right-3 top-5"
              : "right-3 top-5"
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* =========================================
          NAVIGATION
          ========================================= */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
      >
        {!collapsed && (
          <p
            className="
              mb-3
              px-3
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-400

              dark:text-slate-500
            "
          >
            Principal
          </p>
        )}

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isNavigationActive(
              item.href
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
                className={cn(
                  `
                    flex
                    h-10
                    items-center
                    rounded-lg
                    text-sm
                    font-medium
                    transition-colors
                  `,
                  collapsed
                    ? "justify-center px-0"
                    : "gap-3 px-3",

                  isActive
                    ? `
                      bg-sky-50
                      text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-50
                      hover:text-slate-900

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                      dark:hover:text-slate-100
                    `
                )}
              >
                <Icon
                  className="
                    size-[18px]
                    shrink-0
                  "
                />

                {!collapsed && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =========================================
          USER
          ========================================= */}
      <div
        className={cn(
          `
            shrink-0
            border-t
            border-slate-200

            dark:border-[#1e3354]
          `,
          collapsed
            ? "p-2"
            : "p-3"
        )}
      >
        <SidebarUser
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}