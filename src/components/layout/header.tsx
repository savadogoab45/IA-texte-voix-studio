import Link from "next/link";
import { AudioLines, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";
import { UserButton } from "@/components/auth/user-button";
import { buttonVariants } from "@/components/ui/button/button";
import { cn } from "@/lib/cn";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <AudioLines className="h-5 w-5" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features">Fonctions</Link>
          <Link href="/#pricing">Tarifs</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className={cn(buttonVariants({ variant: "secondary", size: "sm" }))} href="/auth/sign-up">
            <Sparkles className="mr-2 h-4 w-4" />
            Essayer
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
