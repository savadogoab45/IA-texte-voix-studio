"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Languages,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";


export default function SettingsPage() {

  const [language, setLanguage] = useState("fr");
  const [generationNotifications, setGenerationNotifications] =
    useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activeTheme: Theme = isMounted
    ? ((theme ?? resolvedTheme ?? "system") as Theme)
    : "system";
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleSave() {
    setSaved(false);

    // La sauvegarde réelle pourra être connectée
    // à ton backend plus tard.

    setTimeout(() => {
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    }, 500);
  }

  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-5xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              size-12
              items-center
              justify-center
              rounded-xl
              bg-sky-50

              dark:bg-sky-950/50
              dark:shadow-lg
              dark:shadow-sky-950/20
            "
          >
            <Settings
              className="
                size-6
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-slate-100
                sm:text-3xl
              "
            >
              Paramètres
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Personnalisez votre expérience sur la plateforme.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          APPEARANCE
          ========================================= */}
      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-sky-50

                dark:bg-sky-950/50
              "
            >
              <Palette
                className="
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Apparence
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Choisissez l&apos;apparence de votre interface.
              </p>
            </div>
          </div>

          {/* Theme choices */}
          <div
            className="
              mt-6
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            {/* LIGHT */}
            <ThemeCard
              active={activeTheme === "light"}
              icon={Sun}
              title="Clair"
              description="Utiliser le thème clair"
              onClick={() => setTheme("light")}
            />

            {/* DARK */}
            <ThemeCard
              active={activeTheme === "dark"}
              icon={Moon}
              title="Sombre"
              description="Utiliser le thème sombre"
              onClick={() => setTheme("dark")}
            />

            {/* SYSTEM */}
            <ThemeCard
              active={activeTheme === "system"}
              icon={Monitor}
              title="Système"
              description="Suivre le système"
              onClick={() => setTheme("system")}
            />
          </div>
        </div>
      </section>

      {/* =========================================
          LANGUAGE
          ========================================= */}
      <section
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-sky-50

                dark:bg-sky-950/50
              "
            >
              <Languages
                className="
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Langue
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Choisissez la langue de l&apos;interface.
              </p>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <label
              htmlFor="language"
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Langue de l&apos;application
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              className="
                mt-2
                flex
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                text-slate-900
                outline-none
                shadow-sm

                focus:border-sky-500
                focus:ring-2
                focus:ring-sky-500/20

                dark:border-[#1e3354]
                dark:bg-[#071a33]
                dark:text-slate-100
                dark:focus:border-sky-500
                dark:focus:ring-sky-500/20
              "
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </section>

      {/* =========================================
          NOTIFICATIONS
          ========================================= */}
      <section
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-sky-50

                dark:bg-sky-950/50
              "
            >
              <Bell
                className="
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                  dark:text-slate-100
                "
              >
                Notifications
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Gérez les notifications que vous souhaitez recevoir.
              </p>
            </div>
          </div>

          <div
            className="
              mt-6
              divide-y
              divide-slate-100

              dark:divide-[#1e3354]
            "
          >
            {/* Generation */}
            <SettingToggle
              title="Générations terminées"
              description="Recevoir une notification lorsqu'une génération est terminée."
              checked={generationNotifications}
              onChange={setGenerationNotifications}
            />

            {/* Email */}
            <SettingToggle
              title="Notifications par email"
              description="Recevoir les informations importantes par email."
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
          </div>
        </div>
      </section>

      {/* =========================================
          SAVE
          ========================================= */}
      <div
        className="
          mt-6
          flex
          justify-end
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm

          dark:border-[#1e3354]
          dark:bg-[#0b1830]
          dark:shadow-lg
          dark:shadow-blue-950/10
        "
      >
        <Button
          type="button"
          onClick={handleSave}
          className="
            rounded-xl
            shadow-sm
            shadow-sky-500/10
          "
        >
          {saved ? (
            <>
              <Check className="mr-2 size-4" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* =============================================
   THEME CARD
   ============================================= */

function ThemeCard({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        flex
        min-h-[130px]
        flex-col
        items-start
        justify-between
        rounded-xl
        border
        p-4
        text-left
        transition-all

        ${
          active
            ? `
              border-sky-500
              bg-sky-50
              shadow-sm
              shadow-sky-500/10

              dark:border-sky-600
              dark:bg-sky-950/40
              dark:shadow-sky-950/20
            `
            : `
              border-slate-200
              bg-white
              hover:border-sky-200
              hover:bg-slate-50

              dark:border-[#1e3354]
              dark:bg-[#071a33]
              dark:hover:border-sky-800
              dark:hover:bg-[#0e1f38]
            `
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex
          size-9
          items-center
          justify-center
          rounded-lg

          ${
            active
              ? `
                bg-sky-100
                text-sky-600

                dark:bg-sky-900/60
                dark:text-sky-400
              `
              : `
                bg-slate-100
                text-slate-500

                dark:bg-[#10213d]
                dark:text-slate-400
              `
          }
        `}
      >
        <Icon className="size-4" />
      </div>

      <div>
        <p
          className="
            text-sm
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>

      {/* Selected */}
      {active && (
        <div
          className="
            absolute
            right-3
            top-3
            flex
            size-5
            items-center
            justify-center
            rounded-full
            bg-sky-500
            text-white
          "
        >
          <Check className="size-3" />
        </div>
      )}
    </button>
  );
}

/* =============================================
   TOGGLE
   ============================================= */

function SettingToggle({
  title,
  description,
    checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        py-5
      "
    >
      <div className="min-w-0">
        <p
          className="
            text-sm
            font-medium
            text-slate-900
            dark:text-slate-100
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition-colors

          ${
            checked
              ? "bg-sky-500"
              : `
                bg-slate-200
                dark:bg-[#244166]
              `
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            size-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform

            ${
              checked
                ? "translate-x-[5px]"
                : "translate-x-[-18px]"
            }
          `}
        />
      </button>
    </div>
  );
}