import Link from "next/link";
import type { ReactNode } from "react";

import { dashboardNavigation } from "@/config/navigation";
import { UserButton } from "@/components/auth/user-button";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card p-4 lg:block">
        <Link href="/dashboard" className="mb-8 block text-lg font-semibold">
          AI Text Audio
        </Link>
        <nav className="grid gap-1">
          {dashboardNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Espace de travail</p>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <UserButton />
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
