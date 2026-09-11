"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileAudio,
  FileText,
  FolderOpen,
  Headphones,
  Lightbulb,
  ListFilter,
  Loader2,
  Mic2,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RotateCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Users,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UserGenerationDto } from "@/server/generation/dtos/user-generation.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROW_ACCENTS = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-500 dark:text-blue-400" },
  { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-500 dark:text-rose-400" },
  { bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-500 dark:text-violet-400" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-500 dark:text-emerald-400" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-500 dark:text-amber-400" },
] as const;

export default function GenerationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [voiceFilter, setVoiceFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const generationsQuery = api.generation.getAllMine.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data ?? [];
      return data.some((g) => g.status === "RUNNING" || g.status === "PENDING")
        ? 500
        : false;
    },
  });

  const generations = generationsQuery.data ?? [];
  const utils = api.useUtils();

  const [confirmation, setConfirmation] = useState<{
    action: "delete" | "retry";
    generation: UserGenerationDto;
  } | null>(null);

  const deleteGeneration = api.generation.delete.useMutation({
    onSuccess: async () => {
      setConfirmation(null);
      await utils.generation.getAllMine.invalidate();
    },
  });

  const retryGeneration = api.generation.retry.useMutation({
    onSuccess: async () => {
      setConfirmation(null);
      await utils.generation.getAllMine.invalidate();
    },
  });

  async function confirmAction() {
    if (!confirmation) return;

    if (confirmation.action === "delete") {
      await deleteGeneration.mutateAsync({ id: confirmation.generation.id });
    } else {
      await retryGeneration.mutateAsync({ id: confirmation.generation.id });
    }
  }

  const projects = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const generation of generations) {
      const project = generation.document?.project;
      if (project) map.set(project.id, { id: project.id, name: project.name });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [generations]);

  const voices = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const generation of generations) {
      const voiceId = generation.voiceId;
      const voiceName = generation.voice?.name ?? generation.providerVoice;
      if (voiceId && voiceName) map.set(voiceId, { id: voiceId, name: voiceName });
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [generations]);

  const stats = useMemo(() => {
    const totalDuration = generations.reduce((sum, generation) => {
      return sum + (typeof generation.duration === "number" ? generation.duration : 0);
    }, 0);
    const voiceIds = new Set(
      generations.map((generation) => generation.voiceId).filter(Boolean),
    );

    return {
      totalDuration,
      projectCount: projects.length,
      voiceCount: voiceIds.size,
    };
  }, [generations, projects.length]);

  // Deltas "ce mois-ci" affichés sous chaque statistique (à la manière de la maquette).
  const monthStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const createdThisMonth = generations.filter(
      (generation) => new Date(generation.createdAt) >= startOfMonth,
    );

    const duration = createdThisMonth.reduce((sum, generation) => {
      return sum + (typeof generation.duration === "number" ? generation.duration : 0);
    }, 0);

    const projectIds = new Set(
      createdThisMonth
        .map((generation) => generation.document?.project?.id)
        .filter(Boolean),
    );

    const voiceIds = new Set(
      createdThisMonth.map((generation) => generation.voiceId).filter(Boolean),
    );

    return {
      count: createdThisMonth.length,
      duration,
      projectCount: projectIds.size,
      voiceCount: voiceIds.size,
    };
  }, [generations]);

  const filteredGenerations = useMemo(() => {
    const value = search.trim().toLowerCase();

    const result = generations.filter((generation) => {
      if (value) {
        const haystack = [
          generation.title,
          generation.document?.title,
          generation.document?.project?.name,
          generation.voice?.name,
          generation.providerVoice,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(value)) return false;
      }

      if (statusFilter !== "ALL" && generation.status !== statusFilter) {
        return false;
      }

      if (
        projectFilter !== "ALL" &&
        generation.document?.project?.id !== projectFilter
      ) {
        return false;
      }

      if (voiceFilter !== "ALL" && generation.voiceId !== voiceFilter) {
        return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      return sortOrder === "recent" ? second - first : first - second;
    });
  }, [generations, search, statusFilter, projectFilter, voiceFilter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setProjectFilter("ALL");
    setVoiceFilter("ALL");
  };

  if (generationsQuery.isLoading) return <LoadingState />;

  if (generationsQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-4">
        <div className="max-w-md rounded-[28px] border border-red-20 p-8 text-center shadow-sm dark:border-red-900/50 ">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
            <XCircle className="size-7 text-red-500" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Impossible de charger les générations
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Une erreur est survenue pendant le chargement de vos générations audio.
          </p>
          <Button
            type="button"
            onClick={() => void generationsQuery.refetch()}
            className="mt-5 rounded-xl bg-sky-600 hover:bg-sky-700"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <section className="relative mb-5 min-h-[250px] overflow-hidden rounded-[30px] border border-blue-100/80 bg-gradient-to-br from-white via-[#f7f9ff] to-[#edf3ff] shadow-[0_18px_55px_rgba(37,99,235,0.08)] dark:border-[#20385e] dark:bg-gradient-to-br dark:from-[#0d1c34] dark:via-[#0a1930] dark:to-[#101b3b]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.13),transparent_34%),radial-gradient(circle_at_55%_100%,rgba(59,130,246,0.10),transparent_38%)]" />

          <div className="relative grid min-h-[250px] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]">
            <div className="flex flex-col justify-center px-6 py-7 sm:px-8 lg:px-9">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm backdrop-blur dark:border-blue-900/50 dark:bg-[#122443]/80 dark:text-blue-400">
                <Headphones className="size-3.5" />
                Générations audio
              </div>

              <h1 className="max-w-2xl text-[32px] font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[42px] dark:text-white">
                Transformez vos textes
                <br className="hidden sm:block" />
                en <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">expériences audio</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px] dark:text-slate-400">
                Des voix naturelles, puissantes et expressives pour vos contenus.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
                <HeroCheck label="Qualité studio" />
                <HeroCheck label="Voix naturelles" />
                <HeroCheck label="Export facile" />
              </div>
            </div>

            <div className="relative hidden min-h-[250px] lg:block">
              <Image
                src="/images/hero.png"
                alt="Interface audio et waveform SonaGen"
                fill
                priority
                className="object-cover object-left"
                sizes="(min-width: 1024px) 48vw, 0px"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f7f9ff] to-transparent dark:from-[#0d1c34]" />
            </div>
          </div>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Générations"
            value={generations.length}
            icon={<FileAudio className="size-5" />}
            accent="violet"
            helper={`+${monthStats.count} ce mois`}
          />
          <StatCard
            label="Temps audio généré"
            value={formatDuration(stats.totalDuration)}
            icon={<Clock3 className="size-5" />}
            accent="blue"
            helper={`+${formatDurationShort(monthStats.duration)} ce mois`}
          />
          <StatCard
            label="Projets concernés"
            value={stats.projectCount}
            icon={<FileText className="size-5" />}
            accent="sky"
            helper={`+${monthStats.projectCount} ce mois`}
          />
          <StatCard
            label="Voix utilisées"
            value={stats.voiceCount}
            icon={<Users className="size-5" />}
            accent="amber"
            helper={`+${monthStats.voiceCount} ce mois`}
          />
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.045)] dark:border-[#1e3354] dark:bg-[#0b1830]">
            <div className="border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6 dark:border-[#1e3354]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                      Toutes les générations
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Recherchez, filtrez et gérez vos générations audio.
                    </p>
                  </div>
                </div>

                <div className="relative w-full lg:max-w-[310px]">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher une génération..."
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm shadow-none dark:border-[#294261] dark:bg-[#071a33]"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <FilterSelect value={statusFilter} onChange={setStatusFilter}>
                  <option value="ALL">Tous les statuts</option>
                  <option value="COMPLETED">Terminées</option>
                  <option value="RUNNING">En cours</option>
                  <option value="PENDING">En attente</option>
                  <option value="FAILED">Échec</option>
                </FilterSelect>

                <FilterSelect value={projectFilter} onChange={setProjectFilter}>
                  <option value="ALL">Tous les projets</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect value={voiceFilter} onChange={setVoiceFilter}>
                  <option value="ALL">Toutes les voix</option>
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </FilterSelect>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-[#294261] dark:bg-[#0b1830] dark:text-slate-300 dark:hover:bg-[#10213d]"
                >
                  <ListFilter className="size-3.5" />
                  Plus de filtres
                </button>

                <button
                  type="button"
                  onClick={() => setSortOrder((current) => current === "recent" ? "oldest" : "recent")}
                  className="ml-auto inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#294261] dark:bg-[#0b1830] dark:text-slate-300"
                >
                  <ArrowUpDown className="size-3.5" />
                  {sortOrder === "recent" ? "Plus récent" : "Plus ancien"}
                </button>
              </div>
            </div>

            {filteredGenerations.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  hasFilters={
                    Boolean(search) ||
                    statusFilter !== "ALL" ||
                    projectFilter !== "ALL" ||
                    voiceFilter !== "ALL"
                  }
                  onReset={resetFilters}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#1e3354]">
                {filteredGenerations.map((generation, index) => (
                  <GenerationRow
                    key={generation.id}
                    generation={generation}
                    accent={ROW_ACCENTS[index % ROW_ACCENTS.length]!}
                    onOpen={() => {
                      const projectId = generation.document?.project?.id;
                      if (projectId) {
                        router.push(`/dashboard/projects/${projectId}/generations/${generation.id}`);
                      }
                    }}
                    onRetry={() => setConfirmation({ action: "retry", generation })}
                    onDelete={() => setConfirmation({ action: "delete", generation })}
                  />
                ))}
              </div>
            )}

            {filteredGenerations.length > 0 && (
              <div className="flex justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400 sm:px-6 dark:border-[#1e3354] dark:text-slate-500">
                <span>{filteredGenerations.length} génération(s) affichée(s)</span>
                <span>{generations.length} au total</span>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <AssistantCard />
            <QuickActions />
            <AdviceCard />
            <InspirationCard />
          </aside>
        </div>
      </div>

      {confirmation && (
        <AlertDialog
          open={confirmation !== null}
          onOpenChange={(open) => {
            if (!open && !deleteGeneration.isPending && !retryGeneration.isPending) {
              setConfirmation(null);
            }
          }}
        >
          <AlertDialogContent className="rounded-[26px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmation.action === "delete" ? "Supprimer cette génération ?" : "Régénérer cette génération ?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmation.action === "delete"
                  ? `La génération « ${confirmation.generation.title} » sera déplacée vers la corbeille et pourra être restaurée depuis les paramètres.`
                  : `L'audio de « ${confirmation.generation.title} » sera régénéré avec les paramètres existants.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteGeneration.isPending || retryGeneration.isPending}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteGeneration.isPending || retryGeneration.isPending}
                className={confirmation.action === "delete" ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"}
                onClick={(event) => {
                  event.preventDefault();
                  void confirmAction();
                }}
              >
                {deleteGeneration.isPending || retryGeneration.isPending
                  ? confirmation.action === "delete" ? "Suppression..." : "Régénération..."
                  : confirmation.action === "delete" ? "Supprimer" : "Régénérer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

function HeroCheck({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
        <Check className="size-3" />
      </span>
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  helper: string;
  icon: ReactNode;
  accent: "violet" | "blue" | "sky" | "amber";
}) {
  const styles = {
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  }[accent];

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-[#1e3354] dark:bg-[#0b1830]">
      <div className="flex items-center gap-3">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${styles}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">↗ {helper}</p>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-[155px] appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-400 dark:border-[#294261] dark:bg-[#0b1830] dark:text-slate-300"
      >
        {children}
      </select>
    </div>
  );
}

function GenerationRow({
  generation,
  accent,
  onOpen,
  onRetry,
  onDelete,
}: {
  generation: UserGenerationDto;
  accent: { bg: string; text: string };
  onOpen: () => void;
  onRetry: () => void;
  onDelete: () => void;
}) {
  const isCompleted = generation.status === "COMPLETED";
  const isActive = generation.status === "RUNNING" || generation.status === "PENDING";
  const project = generation.document?.project;
  const document = generation.document;

  return (
    <article className="group px-4 py-3.5 transition hover:bg-[#fbfcff] sm:px-5 dark:hover:bg-[#0d1d36]">
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(240px,1fr)_minmax(240px,1.1fr)_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}>
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button type="button" onClick={onOpen} className="truncate text-left text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400">
                {generation.title}
              </button>
              <StatusBadge status={generation.status} />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {document?.title ?? "Document inconnu"}
            </p>
            <div className="mt-1.5 flex min-w-0 items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="truncate">{generation.voice?.name ?? generation.providerVoice ?? "Voix"}</span>
              <span>•</span>
              <span className="truncate">{project?.name ?? "Projet inconnu"}</span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          {isCompleted && generation.audioUrl ? (
            <InlineAudioPlayer audioUrl={generation.audioUrl} title={generation.title} initialDuration={generation.duration ?? 0} />
          ) : isActive ? (
            <GenerationProgress status={generation.status} progress={generation.progress ?? 0} currentStep={generation.currentStep} />
          ) : generation.status === "FAILED" ? (
            <div className="flex min-h-12 items-center gap-2 rounded-xl bg-red-50 px-3 dark:bg-red-950/20">
              <XCircle className="size-4 shrink-0 text-red-500" />
              <p className="line-clamp-1 text-xs font-medium text-red-700 dark:text-red-400">
                {generation.error ?? "La génération a échoué."}
              </p>
            </div>
          ) : (
            <div className="flex min-h-12 items-center gap-2 rounded-xl bg-amber-50 px-3 dark:bg-amber-950/20">
              <Clock3 className="size-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">En attente de traitement</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-1">
          {isCompleted && generation.audioUrl && (
            <Link
              href={generation.audioUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="hidden size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 sm:flex dark:hover:bg-blue-950/30"
              aria-label={`Télécharger ${generation.title}`}
            >
              <Download className="size-4" />
            </Link>
          )}

          {generation.status === "FAILED" && (
            <button
              type="button"
              onClick={onRetry}
              className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
              aria-label={`Régénérer ${generation.title}`}
            >
              <RotateCw className="size-4" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#10213d] dark:hover:text-white" aria-label={`Actions pour ${generation.title}`}>
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-2xl border-slate-200 bg-white p-1.5 shadow-xl dark:border-[#294261] dark:bg-[#0b1830]">
              <DropdownMenuItem onClick={onOpen} className="gap-2 rounded-xl">
                <FileText className="size-4" /> Ouvrir
              </DropdownMenuItem>
              {isCompleted && generation.audioUrl && (
                <DropdownMenuItem asChild>
                  <Link href={generation.audioUrl} download target="_blank" rel="noreferrer" className="gap-2 rounded-xl">
                    <Download className="size-4" /> Télécharger
                  </Link>
                </DropdownMenuItem>
              )}
              {(generation.status === "COMPLETED" || generation.status === "FAILED") && (
                <DropdownMenuItem onClick={onRetry} className="gap-2 rounded-xl">
                  <RotateCw className="size-4" /> Régénérer
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="gap-2 rounded-xl text-red-600 focus:text-red-600 dark:text-red-400">
                <Trash2 className="size-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}

function InlineAudioPlayer({ audioUrl, title, initialDuration = 0 }: { audioUrl: string; title: string; initialDuration?: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const bars = useMemo(() => createWaveform(title + audioUrl, 54), [title, audioUrl]);
  const progress = duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Lecture audio impossible :", error);
      }
    } else {
      audio.pause();
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />

      <button type="button" onClick={() => void togglePlay()} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400" aria-label={playing ? "Pause" : "Lecture"}>
        {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}
      </button>

      <div className="min-w-0 flex-1">
        <div role="slider" tabIndex={0} aria-label={`Position dans ${title}`} onClick={seek} className="flex h-9 cursor-pointer items-center gap-px overflow-hidden">
          {bars.map((height, index) => (
            <span
              key={index}
              className={`w-[2px] shrink-0 rounded-full transition-colors sm:w-[3px] ${index / bars.length <= progress ? "bg-blue-500" : "bg-blue-200 dark:bg-blue-900/70"}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <span className="w-11 shrink-0 text-right text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
        {formatTime(duration)}
      </span>
    </div>
  );
}

function GenerationProgress({ status, progress, currentStep }: { status: string; progress: number; currentStep: string | null }) {
  const safe = Math.min(Math.max(progress, 0), 100);
  return (
    <div className="min-h-12 rounded-xl bg-blue-50/80 px-3 py-2.5 dark:bg-blue-950/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
          <span className="truncate">{currentStep ?? (status === "PENDING" ? "En attente" : "Génération en cours")}</span>
        </div>
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{safe}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/40">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const fallback = {
    label: "En attente",
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    icon: <Clock3 className="size-3" />,
  } satisfies { label: string; cls: string; icon: ReactNode };
  const map: Record<string, { label: string; cls: string; icon: ReactNode }> = {
    COMPLETED: { label: "Terminé", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400", icon: <CheckCircle2 className="size-3" /> },
    RUNNING: { label: "En cours", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400", icon: <Loader2 className="size-3 animate-spin" /> },
    PENDING: { label: "En attente", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", icon: <Clock3 className="size-3" /> },
    FAILED: { label: "Échec", cls: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400", icon: <XCircle className="size-3" /> },
  };
  const item = map[status] ?? fallback;
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${item.cls}`}>{item.icon}{item.label}</span>;
}

function AssistantCard() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-[#f2f0ff] to-blue-50 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-indigo-900/40 dark:from-[#141033] dark:via-[#120f2c] dark:to-[#0b1830]">
      <div className="flex items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Bot className="size-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assistant IA</h3>
        <span className="ml-auto shrink-0 rounded-full bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
          Nouveau
        </span>
      </div>

      <p className="relative mt-3 max-w-[85%] text-sm font-semibold leading-5 text-slate-900 dark:text-white">
        Besoin d&apos;aide pour créer votre prochain contenu&nbsp;?
      </p>
      <p className="relative mt-2 max-w-[85%] text-xs leading-5 text-slate-500 dark:text-slate-400">
        Notre assistant vous accompagne dans la création de scripts et le choix des meilleures voix.
      </p>

      <Button className="relative mt-4 h-10 w-full rounded-xl bg-indigo-600 font-semibold hover:bg-indigo-700">
        Ouvrir l&apos;assistant →
      </Button>

      <Bot className="pointer-events-none absolute -bottom-3 -right-3 size-20 text-indigo-200/70 dark:text-indigo-900/40" />
    </section>
  );
}

function QuickActions() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-[#1e3354] dark:bg-[#0b1830]">
      <div className="flex items-center gap-2.5 px-1 pb-3">
        <Sparkles className="size-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Actions rapides</h3>
      </div>
      <div className="space-y-2">
        <ActionButton href="/dashboard/projects" primary icon={<Plus className="size-4" />} label="Nouvelle génération" />
        <ActionButton href="/dashboard/documents" icon={<Upload className="size-4" />} label="Importer un document" />
        <ActionButton href="/dashboard/projects" icon={<FolderOpen className="size-4" />} label="Explorer les projets" />
        <ActionButton href="/dashboard/voices" icon={<Mic2 className="size-4" />} label="Gérer les voix" />
      </div>
    </section>
  );
}

function ActionButton({ href, label, icon, primary = false }: { href: string; label: string; icon: ReactNode; primary?: boolean }) {
  return (
    <Link href={href} className={`flex h-10 items-center gap-2.5 rounded-xl px-3.5 text-xs font-semibold transition ${primary ? "bg-blue-600 text-white shadow-md shadow-blue-500/15 hover:bg-blue-700" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-[#294261] dark:bg-[#0b1830] dark:text-slate-300 dark:hover:bg-[#10213d]"}`}>
      {icon}
      {label}
    </Link>
  );
}

function AdviceCard() {
  return (
    <section className="rounded-[24px] border border-violet-100 bg-gradient-to-br from-white to-violet-50/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-violet-900/40 dark:from-[#0b1830] dark:to-violet-950/20">
      <div className="rounded-2xl bg-violet-50/80 p-4 dark:bg-violet-950/20">
        <Lightbulb className="size-6 text-violet-600 dark:text-violet-400" />
        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Conseil du jour</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Un script bien structuré permet d&apos;obtenir un rendu audio plus naturel et engageant.
        </p>
        <Link href="/dashboard/documents" className="mt-3 inline-flex text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Voir nos conseils →
        </Link>
      </div>
    </section>
  );
}

function InspirationCard() {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-[#1e3354] dark:bg-[#0b1830]">
      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
        <FileAudio className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Besoin d&apos;inspiration ?</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Découvrez des modèles, des scripts et des idées pour vos prochains contenus audio.
      </p>
      <Link href="/dashboard/documents" className="mt-3 inline-flex h-9 items-center rounded-lg border border-blue-200 px-3 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:border-blue-900/60 dark:text-blue-400 dark:hover:bg-blue-950/20">
        Explorer la bibliothèque
      </Link>
    </section>
  );
}

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/60 px-6 text-center dark:border-[#294261] dark:bg-[#071a33]">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400">
        <Headphones className="size-8" />
      </div>
      <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
        {hasFilters ? "Aucune génération trouvée" : "Aucune génération audio"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hasFilters ? "Essayez de modifier vos filtres ou votre recherche." : "Vos générations audio apparaîtront ici après leur création."}
      </p>
      {hasFilters ? (
        <Button type="button" variant="outline" onClick={onReset} className="mt-6 rounded-xl">Réinitialiser les filtres</Button>
      ) : (
        <Button asChild className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/projects"><Sparkles className="mr-2 size-4" /> Créer une génération</Link>
        </Button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center ">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Loader2 className="size-5 animate-spin text-sk" /> Chargement de vos générations...
      </div>
    </div>
  );
}

function createWaveform(seed: string, count: number) {
  let value = 0;
  for (let i = 0; i < seed.length; i++) value = (value * 31 + seed.charCodeAt(i)) % 2147483647;
  return Array.from({ length: count }, (_, index) => {
    value = (value * 48271 + index * 17) % 2147483647;
    return 20 + Math.round((value / 2147483647) * 75);
  });
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  if (!seconds) return "0m";
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatDurationShort(seconds: number) {
  if (!seconds) return "0h";
  const hours = seconds / 3600;
  if (hours >= 1) return `${Math.round(hours)}h`;
  const minutes = Math.round(seconds / 60);
  return `${minutes}m`;
}