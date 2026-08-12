"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";

type SidebarUserProps = {
  collapsed?: boolean;
};

export function SidebarUser({
  collapsed = false,
}: SidebarUserProps) {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user;

  const displayName = isMounted
    ? user?.name?.trim() ?? "Utilisateur"
    : "Utilisateur";

  const displayEmail = isMounted
    ? user?.email?.trim() ?? "Aucun email"
    : "Aucun email";

  const image = isMounted
    ? user?.image ?? undefined
    : undefined;

  const fallback =
    displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={
            collapsed
              ? displayName
              : undefined
          }
          disabled={isPending}
          className={`
            flex
            rounded-xl
            transition-colors

            hover:bg-slate-50
            dark:hover:bg-[#10213d]

            focus:outline-none
            focus:ring-2
            focus:ring-sky-500/20

            disabled:cursor-wait
            disabled:opacity-70

            ${
              collapsed
                ? "size-10 items-center justify-center"
                : "w-full items-center gap-3 p-2 text-left"
            }
          `}
        >
          <Avatar className="size-9 shrink-0 rounded-lg">
            <AvatarImage
              src={image}
              alt={displayName}
            />

            <AvatarFallback
              className="
                rounded-lg
                bg-sky-100
                text-sky-700

                dark:bg-sky-950/60
                dark:text-sky-300
              "
            >
              {fallback}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                {isPending
                  ? "Chargement..."
                  : displayName}
              </p>

              <p
                className="
                  truncate
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {isPending
                  ? ""
                  : displayEmail}
              </p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={10}
        className="
          w-72
          rounded-xl
          border
          border-slate-200
          bg-white
          p-1.5
          shadow-lg

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-blue-950/20
        "
      >
        {/* Utilisateur */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="size-9 shrink-0 rounded-lg">
            <AvatarImage
              src={image}
              alt={displayName}
            />

            <AvatarFallback
              className="
                rounded-lg
                bg-sky-100
                text-sky-700

                dark:bg-sky-950/60
                dark:text-sky-300
              "
            >
              {fallback}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900
                dark:text-slate-100
              "
            >
              {displayName}
            </p>

            <p
              className="
                truncate
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {displayEmail}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator
          className="
            bg-slate-100
            dark:bg-[#1e3354]
          "
        />

        {/* Upgrade */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg

            text-slate-700

            hover:bg-slate-50
            focus:bg-slate-50

            dark:text-slate-300
            dark:hover:bg-[#10213d]
            dark:focus:bg-[#10213d]
            dark:focus:text-slate-100
          "
        >
          <Sparkles
            className="
              size-4
              text-sky-600
              dark:text-sky-400
            "
          />

          <span>Passer au plan Pro</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator
          className="
            bg-slate-100
            dark:bg-[#1e3354]
          "
        />

        {/* Profil */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg

            text-slate-700

            hover:bg-slate-50
            focus:bg-slate-50

            dark:text-slate-300
            dark:hover:bg-[#10213d]
            dark:focus:bg-[#10213d]
            dark:focus:text-slate-100
          "
          onClick={() =>
            router.push("/dashboard/profile")
          }
        >
          <User className="size-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>

        {/* Paramètres */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg

            text-slate-700

            hover:bg-slate-50
            focus:bg-slate-50

            dark:text-slate-300
            dark:hover:bg-[#10213d]
            dark:focus:bg-[#10213d]
            dark:focus:text-slate-100
          "
          onClick={() =>
            router.push("/dashboard/settings")
          }
        >
          <Settings className="size-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>

        {/* Facturation */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg

            text-slate-700

            hover:bg-slate-50
            focus:bg-slate-50

            dark:text-slate-300
            dark:hover:bg-[#10213d]
            dark:focus:bg-[#10213d]
            dark:focus:text-slate-100
          "
          onClick={() =>
            router.push("/dashboard/billing")
          }
        >
          <CreditCard className="size-4" />
          <span>Facturation</span>
        </DropdownMenuItem>

        {/* Notifications */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg

            text-slate-700

            hover:bg-slate-50
            focus:bg-slate-50

            dark:text-slate-300
            dark:hover:bg-[#10213d]
            dark:focus:bg-[#10213d]
            dark:focus:text-slate-100
          "
        >
          <Bell className="size-4" />
          <span>Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator
          className="
            bg-slate-100
            dark:bg-[#1e3354]
          "
        />

        {/* Déconnexion */}
        <DropdownMenuItem
          className="
            cursor-pointer
            gap-3
            rounded-lg
            text-red-600

            hover:bg-red-50
            focus:bg-red-50
            focus:text-red-600

            dark:text-red-400
            dark:hover:bg-red-950/30
            dark:focus:bg-red-950/30
            dark:focus:text-red-300
          "
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}