"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FolderKanban,
  Gem,
  Headphones,
  MoreHorizontal,
  Music2,
  Play,
  PlusSquare,
  Sparkles,
  Users,
  WandSparkles,
  Zap,
} from "lucide-react";

import { api } from "@/trpc/react";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
  } = api.dashboard.getStats.useQuery();

  const generationsQuery = api.generation.getAllMine.useQuery();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const recentActivities = useMemo(
    () => (generationsQuery.data ?? []).slice(0, 4).map((generation) => ({
      id: generation.id,
      audioUrl: generation.audioUrl ?? undefined,
      icon: generation.status === "COMPLETED" ? Music2 : FileText,
      title: generation.title,
      subtitle:
        generation.status === "COMPLETED"
          ? "Génération terminée"
          : generation.status === "FAILED"
            ? "Génération échouée"
            : "Génération en cours",
      time: formatRelativeDate(generation.createdAt),
      meta: generation.duration ? formatDuration(generation.duration) : "En cours",
      playable: generation.status === "COMPLETED" && Boolean(generation.audioUrl),
    })),
    [generationsQuery.data],
  );

  const togglePlayback = async (activityId: string, audioUrl?: string) => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    if (playingAudioId === activityId && !audio.paused) {
      audio.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audio.currentSrc !== audioUrl && audio.src !== audioUrl) {
      audio.src = audioUrl;
    }

    try {
      await audio.play();
      setPlayingAudioId(activityId);
    } catch (error) {
      console.error("Lecture audio impossible :", error);
    }
  };

  const isEmpty =
    !isLoading && !isError && stats?.generations === 0 && stats?.projects === 0;

  return (
    <div className="flex min-h-screen  text-slate-900 dark:text-slate-100">

      <div className="min-w-0 flex-1">
        <audio
          ref={audioRef}
          preload="metadata"
          onPause={() => setPlayingAudioId((current) => (current ? null : current))}
          onEnded={() => setPlayingAudioId(null)}
        />

        {/* =====================================================
            TOPBAR
            ===================================================== */}
        

        <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
          {/* =========================================================
              HERO
              ========================================================= */}
          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-blue-100/80 bg-white shadow-[0_24px_70px_-42px_rgba(37,99,235,0.25)] dark:border-[#1d3556] dark:bg-[#0b1830]">
            <div className="absolute -right-24 -top-28 size-72 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:items-center lg:p-10">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:border-[#294467] dark:bg-[#10213d] dark:text-sky-300">
                  <Sparkles className="size-3.5" />
                  Votre studio AI Text Audio
                </div>

                <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                  Bienvenue 👋
                  <br />
                  Votre espace de{" "}
                  <span className="bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    création audio IA
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                  Créez du contenu avec l&apos;IA, générez des voix naturelles
                  et gérez tous vos projets au même endroit.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-sky-500" />
                    Texte vers audio
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-sky-500" />
                    Voix naturelles
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-sky-500" />
                    Productivité boostée
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/projects"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700"
                  >
                    <WandSparkles className="size-4" />
                    Créer une génération
                    <ArrowRight className="size-4" />
                  </Link>

                  <Link
                    href="/dashboard/projects"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 dark:border-[#294467] dark:bg-[#10213d] dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-[#162946] dark:hover:text-sky-300"
                  >
                    <FolderKanban className="size-4" />
                    Voir mes projets
                  </Link>
                </div>
              </div>

              {/* Visuel audio */}
              <div className="relative hidden min-h-62.5 items-center justify-center lg:flex">
                <div className="absolute inset-8 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="relative flex size-56 items-center justify-center rounded-[2rem] border border-blue-100 bg-linear-to-br from-blue-50 via-white to-sky-50 shadow-xl shadow-blue-500/10 dark:border-[#294467] dark:from-[#10213d] dark:via-[#0b1830] dark:to-[#163b62]">
                  <div className="flex size-24 items-center justify-center rounded-full bg-linear-to-br from-sky-500 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/30">
                    <Headphones className="size-11" />
                  </div>

                  <div className="absolute inset-x-7 bottom-7 flex h-14 items-center justify-center gap-1.5">
                    {[18, 28, 38, 24, 46, 32, 54, 30, 44, 22, 50, 34, 42, 26, 48, 20, 36, 28].map(
                      (height, index) => (
                        <span
                          key={index}
                          className="w-1 rounded-full bg-linear-to-t from-indigo-600 to-sky-400"
                          style={{ height }}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="absolute right-0 top-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-[#294467] dark:bg-[#10213d]/90">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Audio IA
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Prêt à être créé
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              STATS
              ========================================================= */}
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStat
              icon={<Music2 className="size-5" />}
              label="Générations"
              value={stats?.generations ?? 0}
              growth="+12%"
              description="Générations créées"
              isLoading={isLoading}
              accent="indigo"
            />

            <DashboardStat
              icon={<FolderKanban className="size-5" />}
              label="Projets"
              value={stats?.projects ?? 0}
              growth="+33%"
              description="Projets créés"
              isLoading={isLoading}
              accent="violet"
            />

            <DashboardStat
              icon={<FileText className="size-5" />}
              label="Documents"
              value={stats?.documents ?? 0}
              growth="+25%"
              description="Documents créés"
              isLoading={isLoading}
              accent="sky"
            />

            <DashboardStat
              icon={<CheckCircle2 className="size-5" />}
              label="Générations terminées"
              value={stats?.completedGenerations ?? 0}
              growth="+20%"
              description="Traitement terminé"
              isLoading={isLoading}
              accent="emerald"
            />
          </section>

          {/* =========================================================
              ERROR
              ========================================================= */}
          {isError && (
            <div className="mb-6 flex items-start gap-3 rounded-[24px] border border-red-200 bg-white p-5 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50">
                <span className="text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-semibold">Impossible de charger le Dashboard</p>
                <p className="mt-1 text-red-600/80 dark:text-red-400">
                  Les statistiques ne peuvent pas être récupérées pour le
                  moment.
                </p>
              </div>
            </div>
          )}

          {isEmpty ? (
            /* =========================================================
                EMPTY STATE
                ========================================================= */
            <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_-35px_rgba(79,70,229,0.3)] sm:p-10 dark:border-slate-800 dark:bg-slate-950">
              <div className="absolute -right-20 -top-20 size-48 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative mx-auto max-w-2xl text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
                  <WandSparkles className="size-7" />
                </div>

                <div className="mt-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                  Première étape
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Commencez votre première génération
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Créez un projet, ajoutez votre contenu puis transformez-le
                  en audio naturel avec votre voix IA préférée.
                </p>

                <Link
                  href="/dashboard/projects"
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700"
                >
                  Créer mon premier projet
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>
          ) : (
            <>
              {/* =====================================================
                  ACTIONS RAPIDES
                  ===================================================== */}
              <section className="mb-6 grid gap-4 lg:grid-cols-3">
                <QuickAction
                  href="/dashboard/projects/new"
                  icon={<PlusSquare className="size-5" />}
                  title="Nouveau projet"
                  description="Créez un projet pour organiser vos contenus"
                />
                <QuickAction
                  href="/dashboard/projects"
                  icon={<FileText className="size-5" />}
                  title="Nouveau document"
                  description="Écrivez ou importez votre texte"
                />
                <QuickAction
                  href="/dashboard/projects"
                  icon={<Music2 className="size-5" />}
                  title="Nouvelle génération"
                  description="Transformez votre texte en audio"
                  accent="violet"
                />
              </section>

              {/* =====================================================
                  ACTIVITÉS RÉCENTES + PROMO
                  ===================================================== */}
              <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.35)] sm:p-6 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white">
                      Activités récentes
                    </h3>
                    <Link
                      href="/dashboard/generations"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      Voir tout
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {recentActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-[#10213d] dark:text-sky-300">
                          <activity.icon className="size-4.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {activity.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {activity.subtitle} · {activity.time}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm text-slate-400 dark:text-slate-500">
                          {activity.meta}
                        </span>

                        {activity.playable && (
                          <button
                            type="button"
                            aria-label={playingAudioId === activity.id ? "Pause" : "Écouter"}
                            onClick={() => void togglePlayback(activity.id, activity.audioUrl)}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                          >
                            {playingAudioId === activity.id ? (
                              <span className="block h-3.5 w-1 rounded-full bg-white" />
                            ) : (
                              <Play className="size-3.5 fill-current" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          aria-label="Plus d'options"
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </li>
                    ))}
                    {recentActivities.length === 0 && (
                      <li className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Aucune génération récente.
                      </li>
                    )}
                  </ul>
                </div>

                {/* Panneau promo */}
                <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-sky-600 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-7">
                  <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-white/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex items-center justify-center rounded-2xl bg-white/15 p-4 backdrop-blur">
                      <Headphones className="size-16 text-white/90" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold tracking-tight">
                      Commencez dès aujourd&apos;hui
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-blue-100">
                      Créez votre premier projet et donnez vie à vos idées
                      avec des voix naturelles.
                    </p>

                    <Link
                      href="/dashboard/projects/new"
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      Créer un projet
                      <ArrowRight className="size-4" />
                    </Link>

                    <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-blue-100">
                      <PromoFeature icon={<Zap className="size-4" />} label="Rapide et simple" />
                      <PromoFeature
                        icon={<Gem className="size-4" />}
                        label="Qualité professionnelle"
                      />
                      <PromoFeature
                        icon={<Users className="size-4" />}
                        label="Des voix incroyables"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  icon,
  label,
  value,
  growth,
  description,
  isLoading,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  growth?: string;
  description: string;
  isLoading: boolean;
  accent: "indigo" | "sky" | "violet" | "emerald";
}) {
  const accents = {
    indigo: {
      icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
      glow: "bg-indigo-500/10",
    },
    sky: {
      icon: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
      glow: "bg-sky-500/10",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
      glow: "bg-violet-500/10",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
      glow: "bg-emerald-500/10",
    },
  } as const;

  const current = accents[accent];

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950">
      <div
        className={`absolute -right-8 -top-8 size-24 rounded-full blur-2xl ${current.glow}`}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-10 items-center justify-center rounded-xl ${current.icon}`}
          >
            {icon}
          </div>

          {growth && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              {growth}
            </span>
          )}
        </div>

        <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {isLoading ? (
            <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ) : (
            value
          )}
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  accent = "indigo",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "indigo" | "violet";
}) {
  const iconStyle =
    accent === "violet"
      ? "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300";

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-800"
    >
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950 dark:text-white">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:border-slate-700 dark:text-slate-500 dark:group-hover:border-indigo-700 dark:group-hover:bg-indigo-950/40 dark:group-hover:text-indigo-300">
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}

function PromoFeature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
        {icon}
      </div>
      <span className="leading-tight">{label}</span>
    </div>
  );
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatRelativeDate(date: Date | string) {
  const difference = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(difference / 60000));

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;

  return `Il y a ${Math.floor(hours / 24)} j`;
}