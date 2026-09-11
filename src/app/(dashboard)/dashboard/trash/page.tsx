"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  AudioWaveform,
  CalendarDays,
  CheckCircle2,
  FileAudio,
  FileText,
  FolderKanban,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
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

type TrashTab = "projects" | "documents" | "generations";

type TrashItem = {
  id: string;
  name: string;
  deletedAt: string;
  type?: "TEXT" | "AUDIO";
};

export default function TrashPage() {
  const router = useRouter();
  const utils = api.useUtils();

  const [activeTab, setActiveTab] =
    useState<TrashTab>("projects");

  const [itemToDelete, setItemToDelete] =
    useState<TrashItem | null>(null);

  const [itemToRestore, setItemToRestore] =
    useState<TrashItem | null>(null);

  // =========================================================
  // QUERIES
  // =========================================================

  const deletedProjectsQuery =
    api.project.getDeleted.useQuery();

  const deletedDocumentsQuery =
    api.document.getDeleted.useQuery();

  const deletedGenerationsQuery =
    api.generation.getDeletedMine.useQuery();

  // =========================================================
  // MUTATIONS
  // =========================================================

  const restoreProject =
    api.project.restore.useMutation();

  const restoreDocument =
    api.document.restore.useMutation();

  const restoreGeneration =
    api.generation.restore.useMutation();

  const hardDeleteProject =
    api.project.hardDelete.useMutation();

  const hardDeleteDocument =
    api.document.hardDelete.useMutation();

  const hardDeleteGeneration =
    api.generation.hardDelete.useMutation();

  // =========================================================
  // DATA
  // =========================================================

  const deletedProjects: TrashItem[] = useMemo(
    () =>
      (deletedProjectsQuery.data ?? []).map(
        (project: {
          id: string;
          name: string;
          deletedAt: Date | string | null;
        }) => ({
          id: project.id,
          name: project.name,
          deletedAt: new Date(
            project.deletedAt ?? Date.now(),
          ).toISOString(),
        }),
      ),
    [deletedProjectsQuery.data],
  );

  const deletedDocuments: TrashItem[] = useMemo(
    () =>
      (deletedDocumentsQuery.data ?? []).map(
        (document: {
          id: string;
          title: string;
          type?: "TEXT" | "AUDIO";
          deletedAt: Date | string | null;
        }) => ({
          id: document.id,
          name: document.title,
          type: document.type,
          deletedAt: new Date(
            document.deletedAt ?? Date.now(),
          ).toISOString(),
        }),
      ),
    [deletedDocumentsQuery.data],
  );

  const deletedGenerations: TrashItem[] = useMemo(
    () =>
      (deletedGenerationsQuery.data ?? []).map(
        (generation: {
          id: string;
          title: string;
          deletedAt: Date | string | null;
        }) => ({
          id: generation.id,
          name: generation.title,
          deletedAt: new Date(
            generation.deletedAt ?? Date.now(),
          ).toISOString(),
        }),
      ),
    [deletedGenerationsQuery.data],
  );

  const items =
    activeTab === "projects"
      ? deletedProjects
      : activeTab === "documents"
        ? deletedDocuments
        : deletedGenerations;

  const totalItems =
    deletedProjects.length +
    deletedDocuments.length +
    deletedGenerations.length;

  const audioDocuments = deletedDocuments.filter(
    (document) => document.type === "AUDIO",
  ).length;

  // =========================================================
  // LOADING
  // =========================================================

  const isLoading =
    deletedProjectsQuery.isLoading ||
    deletedDocumentsQuery.isLoading ||
    deletedGenerationsQuery.isLoading;

  // =========================================================
  // MUTATION STATE
  // =========================================================

  const isRestoring =
    restoreProject.isPending ||
    restoreDocument.isPending ||
    restoreGeneration.isPending;

  const isDeleting =
    hardDeleteProject.isPending ||
    hardDeleteDocument.isPending ||
    hardDeleteGeneration.isPending;

  // =========================================================
  // LABELS
  // =========================================================

  const currentSectionTitle =
    activeTab === "projects"
      ? "Projets supprimés"
      : activeTab === "documents"
        ? "Documents supprimés"
        : "Générations supprimées";

  const currentSectionDescription =
    activeTab === "projects"
      ? "Vos projets déplacés dans la corbeille."
      : activeTab === "documents"
        ? "Vos documents texte et audio supprimés."
        : "Vos générations audio supprimées.";

  // =========================================================
  // RESTORE
  // =========================================================

  async function handleRestore() {
    if (!itemToRestore) {
      return;
    }

    try {
      if (activeTab === "projects") {
        await restoreProject.mutateAsync({
          id: itemToRestore.id,
        });
      } else if (activeTab === "documents") {
        await restoreDocument.mutateAsync({
          documentId: itemToRestore.id,
        });
      } else {
        await restoreGeneration.mutateAsync({
          id: itemToRestore.id,
        });
      }

      await Promise.all([
        utils.project.getDeleted.invalidate(),
        utils.document.getDeleted.invalidate(),
        utils.generation.getDeletedMine.invalidate(),
      ]);

      setItemToRestore(null);
    } catch {
      // Le serveur retourne l'erreur via tRPC.
      // Le dialog reste ouvert afin que l'utilisateur
      // puisse comprendre/corriger le problème.
    }
  }

  // =========================================================
  // PERMANENT DELETE
  // =========================================================

  async function handlePermanentDelete() {
    if (!itemToDelete) {
      return;
    }

    try {
      if (activeTab === "projects") {
        await hardDeleteProject.mutateAsync({
          projectId: itemToDelete.id,
        });
      } else if (activeTab === "documents") {
        await hardDeleteDocument.mutateAsync({
          documentId: itemToDelete.id,
        });
      } else {
        await hardDeleteGeneration.mutateAsync({
          id: itemToDelete.id,
        });
      }

      await Promise.all([
        utils.project.getDeleted.invalidate(),
        utils.document.getDeleted.invalidate(),
        utils.generation.getDeletedMine.invalidate(),
      ]);

      setItemToDelete(null);
    } catch {
      // L'erreur est gérée par tRPC.
    }
  }

  // =========================================================
  // DATE
  // =========================================================

  function formatDeletedDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  // =========================================================
  // ICON
  // =========================================================

  function getItemIcon(item: TrashItem) {
    if (activeTab === "projects") {
      return (
        <FolderKanban className="size-5" />
      );
    }

    if (activeTab === "generations") {
      return (
        <Sparkles className="size-5" />
      );
    }

    if (item.type === "AUDIO") {
      return (
        <FileAudio className="size-5" />
      );
    }

    return (
      <FileText className="size-5" />
    );
  }

  return (
    <div className="min-h-full w-full">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* TOP NAVIGATION */}
        {/* ================================================= */}

        <div className="flex items-center pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="
              -ml-2
              rounded-xl
              px-3
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-white
            "
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour au tableau de bord
          </Button>
        </div>

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200/80
            bg-gradient-to-br
            from-sky-50
            via-white
            to-violet-50
            shadow-sm
            dark:border-[#1d3556]
            dark:from-[#0d1d36]
            dark:via-[#0b1830]
            dark:to-[#171536]
          "
        >
          {/* Decorative background */}
          <div
            className="
              absolute
              -right-20
              -top-24
              size-72
              rounded-full
              bg-sky-400/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              right-40
              size-80
              rounded-full
              bg-violet-400/10
              blur-3xl
            "
          />

          <div className="relative grid min-h-[280px] grid-cols-1 items-center gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_360px] lg:px-12">
            {/* Hero text */}
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="
                    flex
                    size-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-sky-600
                    text-white
                    shadow-lg
                    shadow-sky-600/25
                  "
                >
                  <Trash2 className="size-6" />
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-sky-200
                    bg-white/70
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-sky-700
                    backdrop-blur
                    dark:border-sky-900
                    dark:bg-sky-950/30
                    dark:text-sky-300
                  "
                >
                  {totalItems} élément
                  {totalItems > 1 ? "s" : ""} supprimé
                  {totalItems > 1 ? "s" : ""}
                </span>
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-950
                  sm:text-4xl
                  lg:text-5xl
                  dark:text-white
                "
              >
                Votre corbeille
              </h1>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-600
                  sm:text-base
                  dark:text-slate-400
                "
              >
                Retrouvez vos projets, documents et
                générations supprimés. Vous pouvez les
                restaurer ou les supprimer définitivement.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/70
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600
                    backdrop-blur
                    dark:border-[#243c60]
                    dark:bg-[#10213d]/70
                    dark:text-slate-300
                  "
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Restauration disponible
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/70
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-600
                    backdrop-blur
                    dark:border-[#243c60]
                    dark:bg-[#10213d]/70
                    dark:text-slate-300
                  "
                >
                  <TriangleAlert className="size-4 text-amber-500" />
                  Suppression définitive irréversible
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden h-[240px] lg:block">
              <div
                className="
                  absolute
                  inset-0
                  rounded-3xl
                  bg-white/40
                  backdrop-blur-sm
                  dark:bg-white/[0.03]
                "
              />

              <img
                src="/images/trash-illustration.png"
                alt="Illustration de la corbeille"
                className="
                  relative
                  z-10
                  h-full
                  w-full
                  object-contain
                  drop-shadow-xl
                "
              />
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <section className="mt-6">
          <div
            className="
              grid
              grid-cols-1
              gap-2
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-2
              shadow-sm
              sm:grid-cols-3
              dark:border-[#1d3556]
              dark:bg-[#0b1830]
            "
          >
            {/* Projects */}
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`
                group
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-left
                transition-all
                ${
                  activeTab === "projects"
                    ? `
                      bg-sky-600
                      text-white
                      shadow-lg
                      shadow-sky-600/20
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-50
                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      activeTab === "projects"
                        ? "bg-white/15"
                        : "bg-slate-100 dark:bg-[#162946]"
                    }
                  `}
                >
                  <FolderKanban className="size-4 c" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    Projets
                  </span>
                  <span
                    className={`
                      hidden text-xs sm:block
                      ${
                        activeTab === "projects"
                          ? "text-blue-100"
                          : "text-slate-400"
                      }
                    `}
                  >
                    Espaces de travail
                  </span>
                </span>
              </span>

              <span
                className={`
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-bold
                  ${
                    activeTab === "projects"
                      ? "bg-white text-sky-600"
                      : "bg-slate-100 text-slate-600 dark:bg-[#162946] dark:text-slate-300"
                  }
                `}
              >
                {deletedProjects.length}
              </span>
            </button>

            {/* Documents */}
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`
                group
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-left
                transition-all
                ${
                  activeTab === "documents"
                    ? `
                      bg-sky-600
                      text-white
                      shadow-lg
                      shadow-sky-600/20
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-50
                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      activeTab === "documents"
                        ? "bg-sky-400/15"
                        : "bg-slate-100 dark:bg-[#162946]"
                    }
                  `}
                >
                  <FileText className="size-4" />
                </span> 

                <span>
                  <span className="block text-sm font-semibold">
                    Documents
                  </span>
                  <span
                    className={`
                      hidden text-xs sm:block
                      ${
                        activeTab === "documents"
                          ? "text-sky-100"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {audioDocuments} audio
                  </span>
                </span>
              </span>

              <span
                className={`
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-bold
                  ${
                    activeTab === "documents"
                      ? "bg-white text-sky-600"
                      : "bg-slate-100 text-slate-600 dark:bg-[#162946] dark:text-slate-300"
                  }
                `}
              >
                {deletedDocuments.length}
              </span>
            </button>

            {/* Generations */}
            <button
              type="button"
              onClick={() => setActiveTab("generations")}
              className={`
                group
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                text-left
                transition-all
                ${
                  activeTab === "generations"
                    ? `
                      bg-sky-600
                      text-white
                      shadow-lg
                      shadow-sky-600/20
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-50
                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      activeTab === "generations"
                        ? "bg-white/15"
                        : "bg-slate-100 dark:bg-[#162946]"
                    }
                  `}
                >
                  <Sparkles className="size-4" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    Générations
                  </span>
                  <span
                    className={`
                      hidden text-xs sm:block
                      ${
                        activeTab === "generations"
                          ? "text-sky-100"
                          : "text-slate-400"
                      }
                    `}
                  >
                    Contenu généré
                  </span>
                </span>
              </span>

              <span
                className={`
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-bold
                  ${
                    activeTab === "generations"
                      ? "bg-white text-sky-600"
                      : "bg-slate-100 text-slate-600 dark:bg-[#162946] dark:text-slate-300"
                  }
                `}
              >
                {deletedGenerations.length}
              </span>
            </button>
          </div>
        </section>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* LIST */}
          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              dark:border-[#1d3556]
              dark:bg-[#0b1830]
            "
          >
            {/* Section header */}
            <div
              className="
                border-b
                border-slate-200
                px-5
                py-5
                sm:px-6
                dark:border-[#1d3556]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="
                      text-lg
                      font-bold
                      tracking-tight
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {currentSectionTitle}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {currentSectionDescription}
                  </p>
                </div>

                <div
                  className="
                    hidden
                    rounded-xl
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-slate-500
                    sm:block
                    dark:bg-[#10213d]
                    dark:text-slate-400
                  "
                >
                  {items.length} élément
                  {items.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
              {isLoading ? (
                <div
                  className="
                    flex
                    min-h-[360px]
                    flex-col
                    items-center
                    justify-center
                  "
                >
                  <Loader2
                    className="
                      size-8
                      animate-spin
                      text-sky-600
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Chargement de la corbeille...
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div
                  className="
                    relative
                    flex
                    min-h-[360px]
                    flex-col
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-200
                    bg-gradient-to-b
                    from-slate-50
                    to-white
                    px-6
                    text-center
                    dark:border-[#243c60]
                    dark:from-[#0e1e36]
                    dark:to-[#0b1830]
                  "
                >
                  <div
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      size-64
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-sky-500/5
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      size-20
                      items-center
                      justify-center
                      rounded-3xl
                      bg-sky-50
                      text-sky-500
                      shadow-inner
                      dark:bg-sky-950/30
                      dark:text-sky-400
                    "
                  >
                    <Trash2 className="size-9" />
                  </div>

                  <h3
                    className="
                      relative
                      mt-6
                      text-lg
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    La corbeille est vide
                  </h3>

                  <p
                    className="
                      relative
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Aucun élément supprimé dans cette
                    catégorie. Les éléments que vous
                    supprimerez temporairement apparaîtront
                    ici.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        transition-all
                        hover:border-sky-200
                        hover:shadow-md
                        sm:p-5
                        dark:border-[#203858]
                        dark:bg-[#0d1c33]
                        dark:hover:border-sky-900
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        "
                      >
                        {/* Item information */}
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`
                              flex
                              size-12
                              shrink-0
                              items-center
                              justify-center
                              rounded-2xl
                              ${
                                activeTab === "projects"
                                  ? `
                                    bg-sky-50
                                    text-sky-600
                                    dark:bg-sky-950/30
                                    dark:text-sky-400
                                  `
                                  : activeTab === "generations"
                                    ? `
                                      bg-sky-50
                                      text-sky-600
                                      dark:bg-sky-950/30
                                      dark:text-sky-400
                                    `
                                    : item.type === "AUDIO"
                                      ? `
                                        bg-amber-50
                                        text-amber-600
                                        dark:bg-amber-950/30
                                        dark:text-amber-400
                                      `
                                      : `
                                        bg-slate-100
                                        text-slate-600
                                        dark:bg-slate-800
                                        dark:text-slate-300
                                      `
                              }
                            `}
                          >
                            {getItemIcon(item)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className="
                                  max-w-[360px]
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-slate-900
                                  dark:text-white
                                "
                              >
                                {item.name}
                              </h3>

                              {activeTab === "documents" &&
                                item.type && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-slate-100
                                      px-2
                                      py-0.5
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-wide
                                      text-slate-500
                                      dark:bg-[#182c49]
                                      dark:text-slate-400
                                    "
                                  >
                                    {item.type === "AUDIO"
                                      ? "Audio"
                                      : "Texte"}
                                  </span>
                                )}
                            </div>

                            <div
                              className="
                                mt-1.5
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="size-3.5" />
                                Supprimé le{" "}
                                {formatDeletedDate(
                                  item.deletedAt,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="
                            flex
                            w-full
                            gap-2
                            lg:w-auto
                          "
                        >
                          <Button
                            type="button"
                            variant="outline"
                            disabled={
                              isRestoring ||
                              isDeleting
                            }
                            onClick={() =>
                              setItemToRestore(item)
                            }
                            className="
                              flex-1
                              rounded-xl
                              border-slate-200
                              bg-white
                              font-semibold
                              text-sky-600
                              hover:border-sky-200
                              hover:bg-sky-50
                              hover:text-sky-700
                              lg:flex-none
                              dark:border-[#2a4262]
                              dark:bg-[#10213d]
                              dark:text-sky-400
                              dark:hover:bg-sky-950/30
                            "
                          >
                            <RotateCcw className="mr-2 size-4" />
                            Restaurer
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            disabled={
                              isRestoring ||
                              isDeleting
                            }
                            onClick={() =>
                              setItemToDelete(item)
                            }
                            className="
                              flex-1
                              rounded-xl
                              border-red-200
                              bg-white
                              font-semibold
                              text-red-600
                              hover:bg-red-50
                              hover:text-red-700
                              lg:flex-none
                              dark:border-red-900/60
                              dark:bg-[#10213d]
                              dark:text-red-400
                              dark:hover:bg-red-950/30
                            "
                          >
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-4">
            {/* Retention card */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-[#1d3556]
                dark:bg-[#0b1830]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                    dark:bg-sky-950/30
                    dark:text-sky-400
                  "
                >
                  <Trash2 className="size-5" />
                </div>

                <div>
                  <h3
                    className="
                      text-sm
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Votre corbeille
                  </h3>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {totalItems} élément
                    {totalItems > 1 ? "s" : ""} au total
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  rounded-xl
                  bg-slate-50
                  p-4
                  dark:bg-[#10213d]
                "
              >
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="
                      mt-0.5
                      size-4
                      shrink-0
                      text-sky-500
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      Conservation
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
                      Les éléments supprimés restent
                      disponibles dans la corbeille jusqu&apos;à
                      leur suppression définitive.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                dark:border-[#1d3556]
                dark:bg-[#0b1830]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                    text-amber-500
                    dark:bg-amber-950/30
                    dark:text-amber-400
                  "
                >
                  <Lightbulb className="size-5" />
                </div>

                <h3
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Conseils
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      size-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-sky-50
                      text-sky-600
                      dark:bg-sky-950/30
                      dark:text-sky-400
                    "
                  >
                    <FolderKanban className="size-3.5" />
                  </div>

                  <p
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Restaurer un projet peut également
                    restaurer les documents et générations
                    supprimés avec lui.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      size-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-violet-50
                      text-sky-600
                      dark:bg-sky-950/30
                      dark:text-sky-400
                    "
                  >
                    <FileText className="size-3.5" />
                  </div>

                  <p
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    La restauration d&apos;un document peut
                    également restaurer les générations
                    supprimées avec celui-ci.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      size-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-50
                      text-emerald-600
                      dark:bg-emerald-950/30
                      dark:text-emerald-400
                    "
                  >
                    <CheckCircle2 className="size-3.5" />
                  </div>

                  <p
                    className="
                      text-xs
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Une génération ne peut être restaurée
                    seule que lorsque son document et son
                    projet sont actifs.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50/60
                p-5
                dark:border-red-950/60
                dark:bg-red-950/10
              "
            >
              <div className="flex gap-3">
                <TriangleAlert
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                    text-red-500
                  "
                />

                <div>
                  <h3
                    className="
                      text-xs
                      font-bold
                      text-red-700
                      dark:text-red-400
                    "
                  >
                    Attention
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-red-600/80
                      dark:text-red-400/70
                    "
                  >
                    La suppression définitive est
                    irréversible. Vérifiez l&apos;élément avant
                    de confirmer.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =================================================== */}
      {/* RESTORE DIALOG */}
      {/* =================================================== */}

      <AlertDialog
        open={itemToRestore !== null}
        onOpenChange={(open) => {
          if (!open && !isRestoring) {
            setItemToRestore(null);
          }
        }}
      >
        <AlertDialogContent
          className="
            rounded-2xl
            border-slate-200
            bg-white
            dark:border-[#243c60]
            dark:bg-[#0b1830]
          "
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Restaurer cet élément ?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {itemToRestore ? (
                <>
                  <strong>{itemToRestore.name}</strong>{" "}
                  sera restauré et redeviendra disponible
                  dans votre espace.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isRestoring}
            >
              Annuler
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isRestoring}
              onClick={(event) => {
                event.preventDefault();
                void handleRestore();
              }}
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Restauration...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 size-4" />
                  Restaurer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* =================================================== */}
      {/* PERMANENT DELETE DIALOG */}
      {/* =================================================== */}

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setItemToDelete(null);
          }
        }}
      >
        <AlertDialogContent
          className="
            rounded-2xl
            border-slate-200
            bg-white
            dark:border-[#243c60]
            dark:bg-[#0b1830]
          "
        >
          <AlertDialogHeader>
            <div
              className="
                mb-2
                flex
                size-11
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-600
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              <Trash2 className="size-5" />
            </div>

            <AlertDialogTitle>
              Supprimer définitivement ?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {itemToDelete ? (
                <>
                  <strong>{itemToDelete.name}</strong>{" "}
                  sera définitivement supprimé.
                  <br />
                  <br />
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    Cette action est irréversible.
                  </span>
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
            >
              Annuler
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              className="
                bg-red-600
                text-white
                hover:bg-red-700
              "
              onClick={(event) => {
                event.preventDefault();
                void handlePermanentDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className=" " />
                  Supprimer définitivement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}