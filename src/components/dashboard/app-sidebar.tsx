"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AudioLines,
  CreditCard,
  FileText,
  FolderOpen,
  Home,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SidebarUser } from "./sidebar-user";

const mainNavigation = [
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

const accountNavigation = [
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Facturation",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <ShadcnSidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-b border-slate-200">
        <Link
          href="/dashboard"
          className="flex h-12 items-center gap-3 px-2"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
            <Sparkles className="size-5" />
          </div>

          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold text-slate-900">
              AI Text Audio
            </span>

            <span className="text-xs text-slate-500">
              SaaS
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon className="size-[18px]" />

                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Compte
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon className="size-[18px]" />

                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profile */}
      <SidebarFooter className="border-t border-slate-200 p-2">
        <SidebarUser />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}