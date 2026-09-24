"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FileAudio,
  FileText,
  FileType,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { DocumentDto } from "@/server/document/dtos/document.dto";

type DocumentFormat = "TXT" | "PDF" | "DOCX";
type DocumentFilter = "Tous" | DocumentFormat;

function getDocumentFormat(title: string): DocumentFormat {
  const extension = title.split(".").pop()?.toUpperCase();
  return extension === "PDF" || extension === "DOCX" ? extension : "TXT";
}

function getDocumentIcon(format: DocumentFormat) {
  switch (format) {
    case "PDF":
      return FileType;

    case "DOCX":
      return FileText;

    default:
      return FileAudio;
  }
}

export default function DocumentsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DocumentFilter>("Tous");
  const [importOpen, setImportOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const documentsQuery = api.document.getAllByUser.useQuery();
  const projectsQuery = api.project.getAll.useQuery();
  const utils = api.useUtils();

  const documents = documentsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase().trim();

    return documents.filter((document) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const format = getDocumentFormat(document.title);
      const matchesSearch =
        !value ||
        document.title
          .toLowerCase()
          .includes(value);

      const matchesType =
        type === "Tous" ||
        format === type;

      return matchesSearch && matchesType;
    });
  }, [documents, search, type]);

  function openImport() {
    setImportError(null);
    setSelectedFile(null);
    setSelectedProjectId(projects[0]?.id ?? "");
    setImportOpen(true);
  }

  function closeImport() {
    if (isImporting) return;
    setImportOpen(false);
  }

  function selectFile(file: File | undefined) {
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      setImportError("Format non pris en charge. Utilisez un fichier PDF, DOCX ou TXT.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setImportError("Le fichier ne doit pas dépasser 20 Mo.");
      setSelectedFile(null);
      return;
    }

    setImportError(null);
    setSelectedFile(file);
  }

  async function importDocument() {
    if (!selectedFile || !selectedProjectId) {
      setImportError("Sélectionnez un projet et un fichier.");
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", selectedProjectId);

      const response = await fetch("/api/documents/import", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        document?: { id: string; projectId?: string };
      };

      if (!response.ok || !payload.success || !payload.document?.id) {
        throw new Error(payload.message ?? "Impossible d'importer le document.");
      }

      await utils.document.getAllByUser.invalidate();
      setImportOpen(false);
      router.push(`/dashboard/projects/${selectedProjectId}/documents/${payload.document.id}`);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Impossible d'importer le document.");
    } finally {
      setIsImporting(false);
    }
  }

  function formatUpdatedAt(value: Date | string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  return (
    <div
      className="mx-auto w-full max-w-7xl px-1 pb-10 text-slate-900 dark:text-slate-100"
    >
      {/* =========================================
          HEADER
          ========================================= */}
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/80 px-6 py-7 shadow-[0_20px_70px_-35px_rgba(37,99,235,0.35)] dark:border-[#203a5f] dark:bg-gradient-to-br dark:from-[#0b1830] dark:via-[#0c1c38] dark:to-[#17153c] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-28 size-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-sky-700 backdrop-blur dark:border-sky-400/20 dark:bg-white/5 dark:text-sky-300">
              <Sparkles className="size-3.5" />
              Bibliothèque SonaGen
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Vos documents,
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                {" "}prêts à devenir de l’audio.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Importez vos scripts, articles et contenus pour les transformer
              rapidement en voix et en créations audio avec SonaGen.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button type="button" onClick={openImport} className="h-11 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500">
                <Upload className="mr-2 size-4" />
                Importer un document
              </Button>

              <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 bg-white/80 px-5 font-semibold text-slate-700 backdrop-blur hover:bg-white dark:border-[#2a456c] dark:bg-[#10213d]/70 dark:text-slate-200 dark:hover:bg-[#142846]">
                <Link href="/dashboard/generations/new">
                  <Plus className="mr-2 size-4" />
                  Nouvelle génération
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden shrink-0 lg:block">
            <div className="relative flex size-40 items-center justify-center rounded-[28px] border border-white/70 bg-white/60 shadow-xl shadow-blue-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="absolute size-28 rounded-full bg-gradient-to-br from-sky-400/20 to-violet-500/20 blur-xl" />
              <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg shadow-blue-600/25">
                <FileText className="size-9" />
              </div>
              <div className="absolute -right-2 top-5 flex size-9 items-center justify-center rounded-xl border border-white/80 bg-white text-sky-600 shadow-md dark:border-[#29476f] dark:bg-[#10213d] dark:text-sky-300">
                <Upload className="size-4" />
              </div>
              <div className="absolute -bottom-2 -left-2 flex size-10 items-center justify-center rounded-xl border border-white/80 bg-white text-violet-600 shadow-md dark:border-[#29476f] dark:bg-[#10213d] dark:text-violet-300">
                <FileAudio className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SEARCH
          ========================================= */}
      <div className="mt-7 rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-[#1e3354] dark:bg-[#0b1830]/90 sm:p-5">
        <div className="relative w-full max-w-2xl">
          <Search
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-slate-400
              dark:text-slate-500
            "
          />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher un document..."
            className="
              h-11
              rounded-xl
              border-slate-200
              bg-white
              pl-10
              text-slate-900
              shadow-sm
              placeholder:text-slate-400
              focus-visible:border-sky-500
              focus-visible:ring-sky-500/20

              dark:border-[#1e3354]
              dark:bg-[#0b1830]
              dark:text-slate-100
              dark:placeholder:text-slate-500
              dark:focus-visible:border-sky-500
              dark:focus-visible:ring-sky-500/20
            "
          />
        </div>
      </div>

      {/* =========================================
          FILTERS
          ========================================= */}
      <div
        className="
          mt-5
          flex
          gap-2
          overflow-x-auto
          pb-1
        "
      >
        {(["Tous", "TXT", "PDF", "DOCX"] as const).map((item) => {
          const isActive = type === item;

          return (
            <Button
              key={item}
              type="button"
              variant={
                isActive
                  ? "secondary"
                  : "ghost"
              }
              onClick={() => setType(item)}
              className={`
                shrink-0
                rounded-lg

                ${
                  isActive
                    ? `
                      bg-sky-50
                      text-sky-700
                      hover:bg-sky-100
                      hover:text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                      dark:hover:bg-sky-900/60
                      dark:hover:text-sky-300
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100
                      hover:text-slate-900

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                      dark:hover:text-slate-100
                    `
                }
              `}
            >
              {item === "Tous"
                ? "Tous"
                : item}
            </Button>
          );
        })}
      </div>

      {/* =========================================
          DOCUMENTS
          ========================================= */}
      {documentsQuery.isLoading ? (
        <div className="mt-6 flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-[#1e3354] dark:bg-[#0b1830]">
          <Loader2 className="size-6 animate-spin text-sky-600" />
        </div>
      ) : documentsQuery.isError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          Impossible de charger vos documents. Actualisez la page et réessayez.
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div
          className="
            mt-6
            overflow-hidden
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
          {/* Desktop header */}
          <div
            className="
              hidden
              grid-cols-[1fr_120px_140px_48px]
              items-center
              gap-4
              border-b
              border-slate-100
              bg-slate-50
              px-5
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-400

              dark:border-[#1e3354]
              dark:bg-[#071a33]
              dark:text-slate-500

              md:grid
            "
          >
            <span>Document</span>
            <span>Type</span>
            <span>Modifié</span>
            <span />
          </div>

          {/* Document rows */}
          <div
            className="
              divide-y
              divide-slate-100
              dark:divide-[#1e3354]
            "
          >
            {filteredDocuments.map(
              (document) => {
                const format = getDocumentFormat(document.title);
                const Icon = getDocumentIcon(format);

                return (
                  <div
                    key={document.id}
                    onClick={() => router.push(`/dashboard/projects/${document.projectId}/documents/${document.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        router.push(`/dashboard/projects/${document.projectId}/documents/${document.id}`);
                      }
                    }}
                    className="
                      flex
                      flex-col
                      gap-4
                      px-4
                      py-4
                      transition-colors

                      hover:bg-slate-50

                      dark:hover:bg-[#0e1f38]

                      sm:px-5

                      md:grid
                      md:grid-cols-[1fr_120px_140px_48px]
                      md:items-center
                      md:gap-4
                    "
                  >
                    {/* =========================
                        NAME
                        ========================= */}
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          size-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-sky-50

                          dark:bg-sky-950/50
                          dark:shadow-sm
                          dark:shadow-sky-950/20
                        "
                      >
                        <Icon
                          className="
                            size-5
                            text-sky-600
                            dark:text-sky-400
                          "
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-slate-100
                          "
                        >
                          {document.title}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {projects.find((project) => project.id === document.projectId)?.name ?? "Projet"}
                        </p>
                      </div>
                    </div>

                    {/* =========================
                        TYPE
                        ========================= */}
                    <div>
                      <span
                        className="
                          inline-flex
                          rounded-md
                          bg-slate-100
                          px-2
                          py-1
                          text-xs
                          font-medium
                          text-slate-600

                          dark:bg-[#10213d]
                          dark:text-slate-300
                        "
                      >
                        {format}
                      </span>
                    </div>

                    {/* =========================
                        UPDATED
                        ========================= */}
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {formatUpdatedAt(document.updatedAt)}
                    </p>

                    {/* =========================
                        ACTIONS
                        ========================= */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="
                        size-8
                        self-end
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-100
                        hover:text-slate-700

                        dark:text-slate-500
                        dark:hover:bg-[#10213d]
                        dark:hover:text-slate-100

                        md:self-auto
                      "
                      aria-label={`Ouvrir ${document.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/dashboard/projects/${document.projectId}/documents/${document.id}`);
                      }}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                );
              },
            )}
          </div>
        </div>
      ) : (
        /* =========================================
           EMPTY STATE
           ========================================= */
        <div
          className="
            mt-6
            flex
            min-h-[420px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            px-6
            text-center
            shadow-sm

            dark:border-[#244166]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-2xl
              bg-sky-50

              dark:bg-sky-950/50
              dark:shadow-lg
              dark:shadow-sky-950/20
            "
          >
            <FileText
              className="
                size-7
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            {search
              ? "Aucun document trouvé"
              : "Aucun document"}
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {search
              ? `Aucun document ne correspond à « ${search} ».`
              : "Importez votre premier document pour commencer à travailler avec vos contenus."}
          </p>

          {!search && (
              <Button
              type="button"
              onClick={openImport}
              className="
                mt-6
                rounded-xl
                shadow-sm
                shadow-sky-500/10
              "
            >
              <Upload className="mr-2 size-4" />
              Importer un document
            </Button>
          )}
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-[#29476f] dark:bg-[#0b1830]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Importer un document</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ajoutez un fichier à l’un de vos projets.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={closeImport} aria-label="Fermer" className="rounded-lg">
                <X className="size-4" />
              </Button>
            </div>

            <label className="mt-6 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Projet
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-[#1e3354] dark:bg-[#10213d] dark:text-slate-100"
              >
                {projects.length === 0 && <option value="">Aucun projet disponible</option>}
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>

            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 flex min-h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-sky-300 bg-sky-50/60 px-4 text-center text-sm text-sky-700 transition-colors hover:bg-sky-50 dark:border-sky-800 dark:bg-sky-950/20 dark:text-sky-300 dark:hover:bg-sky-950/40">
              <Upload className="mb-2 size-5" />
              {selectedFile ? selectedFile.name : "Choisir un fichier PDF, DOCX ou TXT"}
            </button>

            {importError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{importError}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeImport} disabled={isImporting}>Annuler</Button>
              <Button type="button" onClick={importDocument} disabled={isImporting || !selectedFile || !selectedProjectId}>
                {isImporting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Importer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}