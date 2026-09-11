"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Toggle clair / sombre autonome.
 *
 * Si le projet utilise déjà `next-themes` (ThemeProvider dans le layout
 * racine), remplace le contenu de ce fichier par un simple wrapper autour de
 * `useTheme()` pour éviter deux sources de vérité concurrentes :
 *
 *   import { useTheme } from "next-themes";
 *   const { theme, setTheme } = useTheme();
 *
 * Sinon, ce composant gère lui-même la classe `dark` sur <html> et persiste
 * le choix dans localStorage.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("sonagen-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = stored ? stored === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("sonagen-theme", next ? "dark" : "light");
  };

  // Évite un flash de contenu incohérent avant l'hydratation.
  if (!mounted) {
    return (
      <div className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Activer le thème clair" : "Activer le thème sombre"
      }
      className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}