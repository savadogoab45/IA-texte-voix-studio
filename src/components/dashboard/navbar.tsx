"use client";

import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type NavbarProps = {
  title?: string;
  onMenuClick?: () => void;
};

export function Navbar({
  title = "Tableau de bord",
  onMenuClick,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        w-full
        items-center
        justify-between
        border-b
        border-border
        bg-background/95
        px-4
        text-foreground
        backdrop-blur
        transition-colors
        sm:px-6
      "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          title="Ouvrir le menu"
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-border
            bg-background
            text-foreground
            transition-colors
            hover:bg-accent
            hover:text-accent-foreground
            lg:hidden
          "
        >
          <Menu
            className="size-5 shrink-0"
            strokeWidth={2}
          />
        </button>

        {/* Title */}
        <h1 className="truncate text-lg font-semibold text-foreground">
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
          className="
            relative
            text-muted-foreground
            hover:bg-accent
            hover:text-accent-foreground
          "
        >
          <Bell
            className="size-5 shrink-0"
            strokeWidth={2}
          />

          {/* Notification indicator - à activer plus tard */}
          {/*
          <span
            className="
              absolute
              right-1.5
              top-1.5
              size-1.5
              rounded-full
              bg-sky-500
            "
          />
          */}
        </Button>

        {/* Theme */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Changer le thème"
          title="Changer le thème"
          onClick={toggleTheme}
          className="
            text-muted-foreground
            hover:bg-accent
            hover:text-accent-foreground
          "
        >
          <Sun className="size-5 dark:hidden" />
          <Moon className="hidden size-5 dark:block" />
        </Button>
      </div>
    </header>
  );
}