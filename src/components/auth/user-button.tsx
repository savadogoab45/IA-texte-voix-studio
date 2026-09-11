"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { Avatar, Button } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button/button";
import { cn } from "@/lib/cn";

export function UserButton() {
  const { data } = useSession();
  const user = data?.user;

  if (!user) {
    return (
      <Link className={cn(buttonVariants({ variant: "outline" }))} href="/auth/sign-in">
        Connexion
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar src={user.image} name={user.name} />
      <Link className={cn(buttonVariants({ variant: "ghost" }))} href="/dashboard/settings" title="Parametres">
        <Settings className="h-4 w-4" />
      </Link>
      <Button
        variant="ghost"
        title="Deconnexion"
        onClick={() => {
          void authClient.signOut();
        }}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
