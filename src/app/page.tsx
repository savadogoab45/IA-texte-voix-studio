"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  FileAudio,
  FileText,
  Headphones,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic2,
  Moon,
  Play,
  Settings2,
  Sparkles,
  Sun,
  Upload,
  User,
  WandSparkles,
  X,
} from "lucide-react";

type Theme = "light" | "dark";

const features = [
  [Upload, "Simplicité", "Importez, générez, écoutez. En quelques clics."],
  [Mic2, "Voix naturelles", "Des voix IA réalistes et expressives."],
  [FileText, "Multiples formats", "TXT, PDF, DOCX et plus encore."],
  [Settings2, "Personnalisation", "Voix, langue, vitesse et style."],
  [Sparkles, "Qualité studio", "Des générations audio propres et immersives."],
] as const;

const steps = [
  [Upload, "Importez ou créez votre texte", "Ajoutez un fichier TXT, PDF, DOCX ou collez votre texte."],
  [Settings2, "Personnalisez", "Choisissez la voix, la langue, la vitesse et le style."],
  [Play, "Générez et écoutez", "Obtenez un audio de qualité studio prêt à être utilisé."],
] as const;

const cases = [
  [Mic2, "Podcasts"],
  [Headphones, "Livres audio"],
  [FileAudio, "Contenus pros"],
  [Languages, "Éducation"],
] as const;

function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Changer de thème"
      className="relative flex h-10 w-19 items-center rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/6"
    >
      <span
        className={`absolute h-8 w-8 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 shadow-lg transition-transform ${
          theme === "dark" ? "translate-x-8" : ""
        }`}
      />
      <Sun className={`relative z-10 ml-1.5 h-4 w-4 ${theme === "light" ? "text-white" : "text-slate-400"}`} />
      <Moon className={`relative z-10 ml-auto mr-1.5 h-4 w-4 ${theme === "dark" ? "text-white" : "text-slate-400"}`} />
    </button>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);

  const user = {
    name: "Genie",
    email: "genie@example.com",
    initials: "G",
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-2.5 py-2 shadow-sm backdrop-blur-xl transition hover:bg-white dark:border-white/10 dark:bg-white/4 dark:hover:bg-white/8"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-cyan-400 via-blue-600 to-violet-600 text-sm font-black text-white">
          {user.initials}
        </span>
        <span className="hidden max-w-30 truncate text-left text-sm font-bold lg:block">{user.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform dark:text-slate-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-60 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-blue-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-[#071326]/95"
        >
          <div className="border-b border-slate-200 px-3 pb-3 pt-2 dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-cyan-400 via-blue-600 to-violet-600 text-sm font-black text-white">
                {user.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">{user.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 dark:hover:bg-white/6"
            >
              <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              Mon studio
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 dark:hover:bg-white/6"
            >
              <User className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              Mon profil
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 dark:hover:bg-white/6"
            >
              <Settings2 className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              Paramètres
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-1 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = true;

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-text-audio-theme") as Theme | null;
    setTheme(saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("ai-text-audio-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const bg = theme === "dark" ? "/images/home/background-dark.png" : "/images/home/background-light.png";
  const hero = theme === "dark" ? "/images/home/hero-dark.png" : "/images/home/hero-light.png";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9ff] text-slate-950 transition-colors dark:bg-[#040b1b] dark:text-white">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex h-17.5 max-w-7xl items-center justify-between rounded-[24px] border border-white/70 bg-white/80 px-4 shadow-xl shadow-blue-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#071326]/80 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 via-blue-600 to-violet-600 text-white">
              <AudioLines className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-extrabold">
              AI Text Audio <span className="text-blue-600 dark:text-cyan-400">Studio</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {[
              "Accueil",
              "Fonctionnalités",
              "Tarifs",
              "À propos",
              "FAQ",
            ].map((x, i) => (
              <a
                key={x}
                href={`#${["accueil", "fonctionnalites", "tarifs", "apropos", "faq"][i]}`}
                className={`text-sm font-semibold ${
                  i === 0 ? "text-blue-600 dark:text-cyan-400" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {x}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle theme={theme} toggle={toggle} />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-bold dark:border-white/10 dark:bg-white/4"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
                >
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-slate-200 p-2.5 sm:hidden dark:border-white/10"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#071326]/95 sm:hidden">
            {["Accueil", "Fonctionnalités", "Tarifs", "À propos", "FAQ"].map((x, i) => (
              <a
                key={x}
                href={`#${["accueil", "fonctionnalites", "tarifs", "apropos", "faq"][i]}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold"
              >
                {x}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
              <ThemeToggle theme={theme} toggle={toggle} />
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Link href="/login" className="flex-1 rounded-xl border px-4 py-3 text-center text-sm font-bold dark:border-white/10">
                    Connexion
                  </Link>
                  <Link href="/register" className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">
                    Commencer
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <section id="accueil" className="relative min-h-205 overflow-hidden pt-32">
        <Image src={bg} alt="" fill priority className="absolute inset-0 -z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-white/45 dark:bg-[#020817]/60" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-blue-700 backdrop-blur dark:border-cyan-400/20 dark:bg-white/6 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> L&apos;IA au service de votre voix
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-[72px]">
              Transformez vos textes en{" "}
              <span className="bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                audios captivants
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              AI Text Audio Studio transforme vos documents, articles ou idées en voix naturelles et professionnelles.
              Créez des podcasts, livres audio, contenus éducatifs et bien plus.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-blue-600 to-violet-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/20"
              >
                Commencer gratuitement <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/70 px-6 py-3.5 text-sm font-bold backdrop-blur dark:border-white/15 dark:bg-white/5"
              >
                <Play className="h-4 w-4 fill-current" /> Voir la démo
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {["Aucune carte bancaire", "Configuration en 1 minute", "Qualité studio"].map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-500" />
                  {x}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-3xl dark:bg-cyan-500/10" />
            <Image
              src={hero}
              alt="Document transformé en audio"
              width={1600}
              height={600}
              priority
              className="relative h-45 w-full rounded-[34px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="relative z-10 -mt-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-2xl shadow-blue-900/10 backdrop-blur dark:border-white/10 dark:bg-[#08152b]/90 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(([Icon, title, text]) => (
            <div
              key={title}
              className="border-b border-slate-200/70 p-6 dark:border-white/7 lg:border-b-0 lg:border-r last:lg:border-r-0"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-cyan-300">
              <WandSparkles className="h-3.5 w-3.5" /> Comment ça marche ?
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              De la lecture à l&apos;écoute en <span className="text-blue-600 dark:text-cyan-400">3 étapes simples</span>
            </h2>
            <p className="mt-5 text-slate-600 dark:text-slate-400">
              Une expérience pensée pour les créateurs, étudiants, entreprises et professionnels.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 px-5 py-3 text-sm font-bold text-white"
            >
              Commencer maintenant <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([Icon, title, text]) => (
              <div key={title} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-white/4">
                <div className="my-7 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apropos" className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-blue-900/10 dark:border-white/10 dark:bg-[#08152b] lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-107.5">
            <Image src="/images/home/listening.png" alt="Écoute audio avec AI Text Audio Studio" fill className="object-cover" />
            <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-2">
              {cases.map(([Icon, label]) => (
                <span key={label} className="flex items-center gap-2 rounded-full border border-white/30 bg-white/75 px-3 py-2 text-xs font-bold text-slate-900 shadow-lg backdrop-blur dark:bg-slate-950/60 dark:text-white">
                  <Icon className="h-4 w-4" /> {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              Des possibilités infinies
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Des audios pour <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">tous vos projets</span>
            </h2>
            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              Podcasts, livres audio, contenu éducatif ou professionnel : AI Text Audio Studio s&apos;adapte à vos besoins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold dark:border-white/10">
                Explorer le studio
              </Link>
              <Link href="/register" className="rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 px-5 py-3 text-center text-sm font-bold text-white">
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Une expérience audio <span className="text-blue-600 dark:text-cyan-400">moderne</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["10K+", "Utilisateurs actifs"],
              ["50K+", "Audios générés"],
              ["30+", "Langues disponibles"],
              ["4.9/5", "Satisfaction client"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-[24px] border border-slate-200 bg-white p-7 dark:border-white/8 dark:bg-white/4">
                <div className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-4xl font-black text-transparent">
                  {v}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-blue-400/20">
          <Image src={bg} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#061225]/70" />
          <div className="relative px-6 py-14 text-center sm:px-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
              <AudioLines className="h-3.5 w-3.5" /> Prêt à donner une voix à vos idées ?
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black text-white sm:text-5xl">
              Créez votre premier audio dès aujourd&apos;hui.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-200">
              Commencez gratuitement et découvrez la puissance de la génération audio par IA.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 px-7 py-3.5 text-sm font-extrabold text-white"
            >
              Commencer gratuitement <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer id="faq" className="px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-slate-200 pt-8 dark:border-white/8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <AudioLines className="h-5 w-5 text-blue-600" /> AI Text Audio Studio
          </Link>
          <div className="flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/dashboard">Studio</Link>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#faq">FAQ</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 AI Text Audio Studio.</p>
        </div>
      </footer>
    </main>
  );
}
