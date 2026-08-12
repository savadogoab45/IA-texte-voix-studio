"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Navbar } from "@/components/dashboard/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  // Restaurer l'état du Sidebar
  useEffect(() => {
    const savedState = localStorage.getItem(
      "dashboard-sidebar-collapsed",
    );

    if (savedState === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  // Sauvegarder l'état du Sidebar
  useEffect(() => {
    localStorage.setItem(
      "dashboard-sidebar-collapsed",
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  return (
  <div
    className="
      min-h-screen
      w-full
      bg-slate-50
      dark:bg-[#061126]
    "
  >
    {/* Desktop Sidebar */}
    <Sidebar
      collapsed={sidebarCollapsed}
      onCollapsedChange={setSidebarCollapsed}
    />

    {/* Mobile Sidebar */}
    <MobileSidebar
      open={mobileSidebarOpen}
      onClose={() => setMobileSidebarOpen(false)}
    />

    {/* Contenu principal */}
    <div
      className={`
        min-h-screen
        w-full
        min-w-0
        transition-[padding]
        duration-300
        ease-in-out
        ${
          sidebarCollapsed
            ? "lg:pl-[72px]"
            : "lg:pl-64"
        }
      `}
    >
      <Navbar
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <main
        className="
          relative
          min-h-[calc(100vh-4rem)]
          w-full
          min-w-0
          overflow-hidden
          bg-slate-50
          p-4
          sm:p-6
          lg:p-8
          dark:bg-[#061126]
        "
      >
        {/* =================================
            BLUE GLOW — HAUT DROITE
            ================================= */}
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-blue-600/20
            blur-3xl
            dark:block
          "
        />

        {/* =================================
            BLUE GLOW — BAS GAUCHE
            ================================= */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-40
            h-[28rem]
            w-[28rem]
            rounded-full
            bg-blue-500/15
            blur-3xl
            dark:block
          "
        />

        {/* =================================
            BLUE GLOW — MILIEU
            ================================= */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/3
            h-64
            w-64
            -translate-x-1/2
            rounded-full
            bg-cyan-500/5
            blur-3xl
            dark:block
          "
        />

        {/* Contenu des pages */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  </div>
);
}