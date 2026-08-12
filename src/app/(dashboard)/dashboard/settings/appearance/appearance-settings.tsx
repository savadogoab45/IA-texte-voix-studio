"use client";

import {
  Check,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

type Theme = "system" | "light" | "dark";

const themes: {
  value: Theme;
  label: string;
  description: string;
  icon: typeof Monitor;
}[] = [
  {
    value: "system",
    label: "Système",
    description:
      "Utiliser automatiquement le thème de votre appareil.",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Clair",
    description:
      "Utiliser toujours le thème clair.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Sombre",
    description:
      "Utiliser toujours le thème sombre.",
    icon: Moon,
  },
];

export function AppearanceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const activeTheme = theme ?? resolvedTheme ?? "system";

  return (
    <div>
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Apparence
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personnalisez l&apos;apparence de votre application.
        </p>
      </div>

      <div className="p-6">
        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Thème
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choisissez le thème que vous souhaitez utiliser.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {themes.map((item) => {
            const Icon = item.icon;
            const active = activeTheme === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition-colors
                  ${
                    active
                      ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-950/30"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      active
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }
                  `}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`
                    flex
                    size-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    ${
                      active
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }
                  `}
                >
                  {active && (
                    <Check className="size-3.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}