"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileAudio,
  FileText,
  FolderOpen,
  Headphones,
  Loader2,
  Mic2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/trpc/react";
import type { DocumentDto } from "@/server/document/dtos/document.dto";
import { AudioMiniPlayer } from "@/components/audio/audio-mini-player";

type GenerationStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const utils = api.useUtils();

  const [search, setSearch] = useState("");
  const [generationModalOpen, setGenerationModalOpen] = useState(false);
  const [generationSource, setGenerationSource] = useState<
    "document" | "audio"
  >("document");
  const [selectedGenerationDocumentId, setSelectedGenerationDocumentId] =
    useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<{
    action: "document" | "generation";
    id: string;
    title: string;
  } | null>(null);

  const projectQuery = api.project.get.useQuery(
    { projectId },
    { enabled: Boolean(projectId) },
  );

  const documentsQuery = api.document.getAll.useQuery(
    { projectId },
    { enabled: Boolean(projectId) },
  );

  const generationsQuery = api.generation.getAllByProject.useQuery(
    { projectId },
    {
      enabled: Boolean(projectId),
      refetchInterval: 3000,
    },
  );

  const deleteDocument = api.document.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.document.getAll.invalidate({ projectId }),
        utils.project.get.invalidate({ projectId }),
        utils.project.getAll.invalidate(),
      ]);
    },
  });

  const deleteGeneration = api.generation.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.generation.getAllByProject.invalidate({ projectId }),
        utils.generation.getAll.invalidate(),
      ]);
    },
  });

  const documents = useMemo<DocumentDto[]>(
    () => documentsQuery.data ?? [],
    [documentsQuery.data],
  );

  const generations = useMemo(
    () => generationsQuery.data ?? [],
    [generationsQuery.data],
  );

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return documents;
    }

    return documents.filter((document) => {
      const title = document.title?.toLowerCase() ?? "";
      const content = document.content?.toLowerCase() ?? "";

      return title.includes(value) || content.includes(value);
    });
  }, [documents, search]);

  const completedGenerations = useMemo(
    () =>
      generations.filter(
        (generation) => generation.status === "COMPLETED",
      ).length,
    [generations],
  );

  const totalDuration = useMemo(
    () =>
      generations.reduce(
        (total, generation) => total + (generation.duration ?? 0),
        0,
      ),
    [generations],
  );

  function openGenerationModal(
    source: "document" | "audio" = "document",
    documentId: string | null = null,
  ) {
    setGenerationSource(source);
    setSelectedGenerationDocumentId(documentId);
    setGenerationModalOpen(true);
  }

  function requestDeleteDocument(documentId: string, title: string) {
    setConfirmation({
      action: "document",
      id: documentId,
      title,
    });
  }

  function requestDeleteGeneration(generationId: string, title: string) {
    setConfirmation({
      action: "generation",
      id: generationId,
      title,
    });
  }

  async function confirmDelete() {
    if (!confirmation) {
      return;
    }

    try {
      if (confirmation.action === "document") {
        await deleteDocument.mutateAsync({
          documentId: confirmation.id,
        });
      } else {
        await deleteGeneration.mutateAsync({
          id: confirmation.id,
        });
      }

      setConfirmation(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  }

  function formatDateTime(date: Date | string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(date));
  }

  function formatDuration(seconds: number) {
    if (seconds <= 0) {
      return "0 s";
    }

    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = Math.round(seconds % 60);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
    }

    if (seconds < 60) {
      return `${Math.round(seconds)} s`;
    }

    return `${minutes} min ${remainingSeconds.toString().padStart(2, "0")} s`;
  }

  function getContentPreview(content: string | null) {
    if (!content?.trim()) {
      return "Aucun contenu";
    }

    const cleanContent = content.replace(/\s+/g, " ").trim();

    if (cleanContent.length <= 110) {
      return cleanContent;
    }

    return `${cleanContent.slice(0, 110)}...`;
  }

  function getGenerationStatusLabel(status: GenerationStatus) {
    switch (status) {
      case "COMPLETED":
        return "Terminée";
      case "RUNNING":
        return "En cours";
      case "PENDING":
        return "En attente";
      case "FAILED":
        return "Échec";
      default:
        return status;
    }
  }

  function getGenerationStatusClass(status: GenerationStatus) {
    switch (status) {
      case "COMPLETED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "RUNNING":
        return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-400";
      case "PENDING":
        return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400";
      case "FAILED":
        return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400";
      default:
        return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  }

  function getGenerationStatusIcon(status: GenerationStatus) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="size-3.5" />;
      case "RUNNING":
        return <Loader2 className="size-3.5 animate-spin" />;
      case "PENDING":
        return <Clock3 className="size-3.5" />;
      case "FAILED":
        return <XCircle className="size-3.5" />;
      default:
        return <Clock3 className="size-3.5" />;
    }
  }

  if (projectQuery.isLoading) {
    return (
      <div className="mx-auto flex min-h-[520px] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830] dark:text-slate-400">
          <Loader2 className="size-5 animate-spin text-sky-500" />
          Chargement du projet...
        </div>
      </div>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div className="mx-auto flex min-h-[520px] w-full max-w-3xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
            <FolderOpen className="size-7 text-red-500 dark:text-red-400" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            Projet introuvable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Ce projet n&apos;existe pas ou vous n&apos;avez pas accès à celui-ci.
          </p>

          <Button asChild className="mt-6 rounded-xl">
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 size-4" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const project = projectQuery.data;

  return (
    <div className="min-h-full w-full text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* TOP NAVIGATION */}
        <div className="mb-5 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="-ml-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#0b1830] dark:hover:text-slate-100"
          >
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 size-4" />
              Retour aux projets
            </Link>
          </Button>

          <div className="hidden items-center gap-2 sm:flex">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-200 bg-white shadow-sm dark:border-[#244166] dark:bg-[#0b1830]"
            >
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Pencil className="mr-2 size-4" />
                Modifier
              </Link>
            </Button>

            <Button
              type="button"
              className="rounded-xl shadow-sm shadow-sky-500/10"
              onClick={() => openGenerationModal()}
            >
              <Sparkles className="mr-2 size-4" />
              Nouvelle génération
            </Button>
          </div>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-sky-100/70 blur-3xl dark:bg-sky-950/20" />
          <div className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-950/20" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:items-center lg:p-10">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Projet actif
                </span>

                {project.isFavorite && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-[#244166] dark:bg-[#10213d] dark:text-slate-300">
                    Favori
                  </span>
                )}

                {project.isArchived && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                    Archivé
                  </span>
                )}
              </div>

              <h1 className="mt-4 max-w-3xl break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px] lg:leading-[1.1] dark:text-white">
                {project.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                {project.description ?? "Centralisez vos documents et transformez-les en expériences audio grâce à votre espace de génération IA."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-400 dark:text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  Créé le {formatDate(project.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  Modifié le {formatDate(project.updatedAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  Espace personnel
                </span>
              </div>

              <div className="mt-7 flex flex-col gap-2 sm:hidden">
                <Button
                  type="button"
                  className="w-full rounded-xl"
                  onClick={() => openGenerationModal()}
                >
                  <Sparkles className="mr-2 size-4" />
                  Nouvelle génération
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 bg-white dark:border-[#244166] dark:bg-[#10213d]"
                >
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    <Pencil className="mr-2 size-4" />
                    Modifier le projet
                  </Link>
                </Button>
              </div>
            </div>

            {/* HERO ILLUSTRATION */}
            <div className="relative mx-auto w-full max-w-[440px]">
              <div className="relative aspect-[1.12/1] overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 dark:border-[#244166] dark:from-[#0d2544] dark:via-[#0b1830] dark:to-[#171536]">
                <div className="absolute -right-12 -top-12 size-36 rounded-full bg-sky-200/50 blur-2xl dark:bg-sky-500/10" />
                <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-violet-200/50 blur-2xl dark:bg-violet-500/10" />

                <div className="absolute left-5 top-5 rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  AI AUDIO WORKSPACE
                </div>

                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <div className="absolute size-44 rounded-full border border-sky-200/70 dark:border-sky-400/10" />
                  <div className="absolute size-32 rounded-full border border-sky-200/60 dark:border-sky-400/10" />
                  <div className="absolute size-24 rounded-full bg-sky-500/10 blur-xl dark:bg-sky-400/10" />

                  <div className="relative flex size-20 items-center justify-center rounded-[24px] border border-white bg-white shadow-xl shadow-sky-200/50 dark:border-[#31537c] dark:bg-[#10213d] dark:shadow-black/20">
                    <Mic2 className="size-9 text-sky-500" />
                  </div>
                </div>

                <div className="absolute bottom-7 left-7 right-7">
                  <div className="flex h-16 items-end justify-center gap-1.5 rounded-2xl border border-white/80 bg-white/70 px-5 pb-4 pt-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                    {[18, 32, 48, 26, 54, 38, 62, 42, 24, 50, 34, 58, 28, 44, 20, 36].map(
                      (height, index) => (
                        <span
                          key={index}
                          className="w-1.5 rounded-full bg-sky-400/70 dark:bg-sky-400/60"
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="size-5" />}
            label="Documents"
            value={documents.length}
            hint="dans ce projet"
            iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
          />

          <StatCard
            icon={<Sparkles className="size-5" />}
            label="Générations"
            value={generations.length}
            hint="créées au total"
            iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
          />

          <StatCard
            icon={<CheckCircle2 className="size-5" />}
            label="Terminées"
            value={completedGenerations}
            hint="audios disponibles"
            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
          />

          <StatCard
            icon={<Headphones className="size-5" />}
            label="Temps audio"
            value={formatDuration(totalDuration)}
            hint="générations du projet"
            iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
          />
        </section>

        {/* MAIN CONTENT */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-5">
            {/* DOCUMENTS CARD */}
            <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
              <div className="border-b border-slate-100 p-5 sm:p-6 dark:border-[#1e3354]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40">
                        <FileText className="size-4.5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        Documents
                      </h2>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-[#10213d] dark:text-slate-400">
                        {documents.length}
                      </span>
                    </div>

                    <p className="mt-1 pl-11 text-xs text-slate-400 dark:text-slate-500">
                      Les contenus utilisés pour vos générations audio.
                    </p>
                  </div>

                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="rounded-xl border-slate-200 bg-white dark:border-[#244166] dark:bg-[#10213d]"
                  >
                    <Link
                      href={`/dashboard/projects/${project.id}/documents/new`}
                    >
                      <Plus className="mr-2 size-4 text-sky-600" />
                      Nouveau document
                    </Link>
                  </Button>
                </div>

                <div className="relative mt-5">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un document..."
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 shadow-none dark:border-[#244166] dark:bg-[#071a33]"
                  />
                </div>
              </div>

              {documentsQuery.isLoading ? (
                <LoadingState label="Chargement des documents..." />
              ) : documentsQuery.isError ? (
                <ErrorState
                  label="Impossible de charger les documents."
                  onRetry={() => void documentsQuery.refetch()}
                />
              ) : filteredDocuments.length === 0 ? (
                <EmptyDocuments
                  search={search}
                  projectId={project.id}
                  onCreate={() =>
                    router.push(
                      `/dashboard/projects/${project.id}/documents/new`,
                    )
                  }
                />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#1e3354]">
                  {filteredDocuments.map((document) => (
                    <DocumentRow
                      key={document.id}
                      document={document}
                      projectId={project.id}
                      formatDate={formatDate}
                      getContentPreview={getContentPreview}
                      onGenerate={() =>
                        router.push(
                          `/dashboard/projects/${project.id}/generations/new?documentId=${document.id}`,
                        )
                      }
                      onEdit={() =>
                        router.push(
                          `/dashboard/projects/${project.id}/documents/${document.id}`,
                        )
                      }
                      onDelete={() =>
                        requestDeleteDocument(document.id, document.title)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {/* GENERATIONS CARD */}
            <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
              <div className="border-b border-slate-100 p-5 sm:p-6 dark:border-[#1e3354]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
                        <Headphones className="size-4.5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        Générations récentes
                      </h2>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-[#10213d] dark:text-slate-400">
                        {generations.length}
                      </span>
                    </div>

                    <p className="mt-1 pl-11 text-xs text-slate-400 dark:text-slate-500">
                      Suivez vos traitements audio et écoutez les résultats.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-slate-200 bg-white dark:border-[#244166] dark:bg-[#10213d]"
                    onClick={() => openGenerationModal()}
                  >
                    <Sparkles className="mr-2 size-4 text-violet-500" />
                    Nouvelle génération
                  </Button>
                </div>
              </div>

              {generationsQuery.isLoading ? (
                <LoadingState label="Chargement des générations..." />
              ) : generationsQuery.isError ? (
                <ErrorState
                  label="Impossible de charger les générations."
                  onRetry={() => void generationsQuery.refetch()}
                />
              ) : generations.length === 0 ? (
                <EmptyGenerations onCreate={() => openGenerationModal()} />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-[#1e3354]">
                  {generations.map((generation) => {
                    const progress = Math.min(
                      Math.max(generation.progress ?? 0, 0),
                      100,
                    );

                    return (
                      <article
                        key={generation.id}
                        className="group p-5 transition hover:bg-slate-50/70 sm:p-6 dark:hover:bg-[#0e1f38]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
                                <Headphones className="size-5 text-violet-600 dark:text-violet-400" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {generation.title}
                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  {generation.providerVoice && (
                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-[#10213d] dark:text-slate-300">
                                      {generation.providerVoice}
                                    </span>
                                  )}

                                  {generation.voiceId && (
                                    <span className="max-w-[220px] truncate text-[11px] text-slate-400 dark:text-slate-500">
                                      {generation.voiceId}
                                    </span>
                                  )}

                                  <span className="text-[11px] text-slate-300 dark:text-slate-600">
                                    •
                                  </span>

                                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                    {formatDateTime(generation.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getGenerationStatusClass(
                                  generation.status,
                                )}`}
                              >
                                {getGenerationStatusIcon(generation.status)}
                                {getGenerationStatusLabel(generation.status)}
                              </span>

                              {generation.status === "RUNNING" && (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {progress}% ·{" "}
                                  {generation.currentStep ?? "Traitement..."}
                                </span>
                              )}

                              {generation.duration ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                  <Clock3 className="size-3.5" />
                                  {formatDuration(generation.duration)}
                                </span>
                              ) : null}
                            </div>

                            {generation.status === "RUNNING" && (
                              <div className="mt-3 max-w-xl">
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#10213d]">
                                  <div
                                    className="h-full rounded-full bg-sky-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {generation.status === "FAILED" &&
                              generation.error && (
                                <div className="mt-3 max-w-2xl rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                                  {generation.error}
                                </div>
                              )}
                          </div>

                          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row xl:items-center">
                            {generation.audioUrl && (
                              <AudioMiniPlayer
                                controls
                                preload="none"
                                src={generation.audioUrl}
                                className="h-9 max-w-[260px]"
                              />
                            )}

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl border-slate-200 bg-white dark:border-[#244166] dark:bg-[#10213d]"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/projects/${project.id}/generations/${generation.id}`,
                                  )
                                }
                              >
                                Ouvrir
                                <ChevronRight className="ml-1 size-4" />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                className="rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                                onClick={() =>
                                  requestDeleteGeneration(
                                    generation.id,
                                    generation.title,
                                  )
                                }
                                aria-label={`Supprimer ${generation.title}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#10213d]">
                  <FolderOpen className="size-4 text-slate-500 dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Informations
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Vue d&apos;ensemble du projet
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <InfoRow
                  label="Création"
                  value={formatDateTime(project.createdAt)}
                  icon={<CalendarDays className="size-4" />}
                />

                <InfoRow
                  label="Dernière modification"
                  value={formatDateTime(project.updatedAt)}
                  icon={<Clock3 className="size-4" />}
                />

                <InfoRow
                  label="Documents"
                  value={`${documents.length}`}
                  icon={<FileText className="size-4" />}
                />

                <InfoRow
                  label="Générations terminées"
                  value={`${completedGenerations}`}
                  icon={<CheckCircle2 className="size-4" />}
                />

                <InfoRow
                  label="Temps audio généré"
                  value={formatDuration(totalDuration)}
                  icon={<Headphones className="size-4" />}
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-[26px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-sm dark:border-[#244166] dark:from-[#0d2544] dark:via-[#0b1830] dark:to-[#171536]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-[#10213d]">
                <Sparkles className="size-5 text-sky-500" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Besoin d&apos;inspiration ?
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Commencez avec un document existant ou créez un nouveau contenu
                et transformez-le en audio.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full rounded-xl border-slate-200 bg-white dark:border-[#31537c] dark:bg-[#10213d]"
                onClick={() => openGenerationModal()}
              >
                Explorer les options
                <ChevronRight className="ml-auto size-4" />
              </Button>
            </section>

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Espace de travail
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Ce projet contient ses propres documents et générations. Les
                éléments restent également accessibles depuis les vues globales
                du tableau de bord.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-[#071a33]">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Check className="size-3.5 text-emerald-500" />
                  Synchronisation active
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteDocument.isPending &&
            !deleteGeneration.isPending
          ) {
            setConfirmation(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-[24px] border-slate-200 bg-white dark:border-[#1e3354] dark:bg-[#0b1830]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
              {confirmation?.action === "document"
                ? "Supprimer le document ?"
                : "Supprimer la génération audio ?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              {confirmation ? (
                <>
                  Vous êtes sur le point de supprimer{" "}
                  <strong className="text-slate-700 dark:text-slate-200">
                    {confirmation.title}
                  </strong>
                  .
                  <br />
                  <br />
                  L&apos;élément sera déplacé vers la corbeille et pourra être
                  restauré depuis les paramètres.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deleteDocument.isPending || deleteGeneration.isPending
              }
              className="rounded-xl"
            >
              Annuler
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                confirmation === null ||
                deleteDocument.isPending ||
                deleteGeneration.isPending
              }
              className="rounded-xl bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              {deleteDocument.isPending || deleteGeneration.isPending
                ? "Suppression..."
                : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* GENERATION MODAL */}
      {generationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setGenerationModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-2xl dark:border-[#1e3354] dark:bg-[#0b1830]">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-[#1e3354]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40">
                    <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Nouvelle génération
                  </h2>
                </div>

                <p className="mt-2 pl-11 text-xs text-slate-500 dark:text-slate-400">
                  Choisissez la source à utiliser pour votre génération.
                </p>
              </div>

              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setGenerationModalOpen(false)}
                className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#10213d] dark:hover:text-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 pt-5 sm:px-6">
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-[#071a33]">
                <button
                  type="button"
                  onClick={() => {
                    setGenerationSource("document");
                    setSelectedGenerationDocumentId(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    generationSource === "document"
                      ? "bg-white text-sky-600 shadow-sm dark:bg-[#0b1830] dark:text-sky-400"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <FileText className="size-4" />
                  Document
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGenerationSource("audio");
                    setSelectedGenerationDocumentId(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    generationSource === "audio"
                      ? "bg-white text-sky-600 shadow-sm dark:bg-[#0b1830] dark:text-sky-400"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <FileAudio className="size-4" />
                  Audio
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
              {generationSource === "document" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Sélectionner un document
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Le texte du document sera utilisé pour générer l&apos;audio.
                    </p>
                  </div>

                  {documents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-[#244166]">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#10213d]">
                        <FileText className="size-6 text-slate-400" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Aucun document
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Créez d&apos;abord un document pour continuer.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((document) => {
                        const selected =
                          selectedGenerationDocumentId === document.id;

                        return (
                          <button
                            key={document.id}
                            type="button"
                            onClick={() =>
                              setSelectedGenerationDocumentId(document.id)
                            }
                            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                              selected
                                ? "border-sky-400 bg-sky-50 shadow-sm dark:border-sky-500 dark:bg-sky-950/20"
                                : "border-slate-200 hover:border-sky-200 hover:bg-slate-50 dark:border-[#1e3354] dark:hover:bg-[#0e1f38]"
                            }`}
                          >
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-white dark:bg-[#10213d]"
                                  : "bg-sky-50 dark:bg-sky-950/40"
                              }`}
                            >
                              <FileText className="size-5 text-sky-600 dark:text-sky-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {document.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                {getContentPreview(document.content)}
                              </p>
                            </div>

                            {selected && (
                              <CheckCircle2 className="size-5 shrink-0 text-sky-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 dark:border-[#244166]"
                    onClick={() => {
                      router.push(
                        `/dashboard/projects/${projectId}/documents/new?returnTo=${encodeURIComponent(
                          `/dashboard/projects/${projectId}/generations/new`,
                        )}`,
                      );
                    }}
                  >
                    <Plus className="mr-2 size-4" />
                    Créer un document
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Sélectionner un audio
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Sélectionnez un audio existant ou importez-en un nouveau.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center dark:border-[#244166] dark:bg-[#071a33]">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-[#10213d]">
                      <Upload className="size-6 text-sky-500" />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Importer un audio
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      MP3, WAV, M4A ou autres formats audio
                    </p>

                    <Button
                      type="button"
                      className="mt-5 rounded-xl"
                      onClick={() => {
                        // L'upload audio sera connecté à l'API dédiée.
                      }}
                    >
                      <Upload className="mr-2 size-4" />
                      Choisir un fichier
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#1e3354] dark:bg-[#071a33]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#10213d]">
                        <FileAudio className="size-5 text-slate-400" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Aucun audio sélectionné
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          Les audios du projet apparaîtront ici.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-[#1e3354]">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {generationSource === "document"
                  ? "Document → Audio"
                  : "Audio → Texte"}
              </span>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-200 dark:border-[#244166]"
                  onClick={() => setGenerationModalOpen(false)}
                >
                  Annuler
                </Button>

                <Button
                  type="button"
                  className="rounded-xl"
                  disabled={
                    generationSource === "document" &&
                    !selectedGenerationDocumentId
                  }
                  onClick={() => {
                    if (
                      generationSource === "document" &&
                      selectedGenerationDocumentId
                    ) {
                      router.push(
                        `/dashboard/projects/${projectId}/generations/new?documentId=${selectedGenerationDocumentId}`,
                      );
                    }
                  }}
                >
                  Continuer
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  iconClass,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1e3354] dark:bg-[#0b1830]">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {label}
          </p>
          <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 truncate text-[11px] text-slate-400 dark:text-slate-500">
        {hint}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Loader2 className="size-5 animate-spin text-sky-500" />
        {label}
      </div>
    </div>
  );
}

function ErrorState({
  label,
  onRetry,
}: {
  label: string;
  onRetry: () => void;
}) {
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <p className="text-sm text-red-700 dark:text-red-400">{label}</p>

        <Button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl"
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
}

function EmptyDocuments({
  search,
  projectId,
  onCreate,
}: {
  search: string;
  projectId: string;
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/40">
        <FileText className="size-7 text-sky-500" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        {search ? "Aucun document trouvé" : "Aucun document"}
      </h3>

      <p className="mt-2 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">
        {search
          ? `Aucun document ne correspond à « ${search} ».`
          : "Créez votre premier document pour commencer à travailler avec ce projet."}
      </p>

      {!search && (
        <Button
          type="button"
          className="mt-5 rounded-xl"
          onClick={onCreate}
        >
          <Plus className="mr-2 size-4" />
          Créer un document
        </Button>
      )}

      {search && (
        <Link
          href={`/dashboard/projects/${projectId}/documents/new`}
          className="mt-5 text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          Créer un nouveau document
        </Link>
      )}
    </div>
  );
}

function EmptyGenerations({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/40">
        <Headphones className="size-7 text-violet-500" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        Aucune génération
      </h3>

      <p className="mt-2 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">
        Créez votre première génération audio dans ce projet.
      </p>

      <Button
        type="button"
        className="mt-5 rounded-xl"
        onClick={onCreate}
      >
        <Sparkles className="mr-2 size-4" />
        Créer une génération
      </Button>
    </div>
  );
}

function DocumentRow({
  document,
  projectId,
  formatDate,
  getContentPreview,
  onGenerate,
  onEdit,
  onDelete,
}: {
  document: DocumentDto;
  projectId: string;
  formatDate: (date: Date | string) => string;
  getContentPreview: (content: string | null) => string;
  onGenerate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative px-5 py-4 transition hover:bg-slate-50/70 sm:px-6 dark:hover:bg-[#0e1f38]">
      <div className="flex items-start gap-3">
        <Link
          href={`/dashboard/projects/${projectId}/documents/${document.id}`}
          className="flex min-w-0 flex-1 items-start gap-3"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              document.type === "AUDIO"
                ? "bg-violet-50 dark:bg-violet-950/40"
                : "bg-sky-50 dark:bg-sky-950/40"
            }`}
          >
            {document.type === "AUDIO" ? (
              <FileAudio className="size-5 text-violet-600 dark:text-violet-400" />
            ) : (
              <FileText className="size-5 text-sky-600 dark:text-sky-400" />
            )}
          </div>

          <div className="min-w-0 flex-1 pr-10 sm:pr-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {document.title}
              </p>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#10213d] dark:text-slate-400">
                {document.type === "AUDIO" ? "Audio" : "Texte"}
              </span>
            </div>

            <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
              {getContentPreview(document.content)}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
              <span>{document.content?.length ?? 0} caractères</span>
              <span>•</span>
              <span>Modifié le {formatDate(document.updatedAt)}</span>
            </div>
          </div>
        </Link>

        <div className="absolute right-4 top-4 sm:right-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Options pour ${document.title}`}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 dark:text-slate-500 dark:hover:bg-[#10213d] dark:hover:text-slate-100"
              >
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border-slate-200 bg-white p-1.5 shadow-lg dark:border-[#1e3354] dark:bg-[#0b1830]"
            >
              <DropdownMenuItem
                onClick={onGenerate}
                className="gap-2 rounded-lg"
              >
                <Sparkles className="size-4 text-sky-500" />
                Générer
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onEdit}
                className="gap-2 rounded-lg"
              >
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={onDelete}
                className="gap-2 rounded-lg"
              >
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
