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
        <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-white">
              <AudioLines className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-extrabold">AI Text Audio <span className="text-blue-600 dark:text-cyan-400">Studio</span></span>
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