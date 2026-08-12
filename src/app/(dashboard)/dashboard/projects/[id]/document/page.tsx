"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  Pencil,
  Trash2,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

export default function ProjectDetailsPage() {
  const params = useParams();

  const projectId = params.id as string;
  const utils = api.useUtils();

  const [search, setSearch] = useState("");

  // =========================================
  // Projet
  // =========================================

  const projectQuery = api.project.get.useQuery(
    {
      projectId,
    },
    {
      enabled: Boolean(projectId),
    },
  );

  // =========================================
  // Documents du projet
  // =========================================

  const documentsQuery = api.document.getAll.useQuery(
    {
      projectId,
    },
    {
      enabled: Boolean(projectId),
    },
  );

  // =========================================
  // Suppression document
  // =========================================

  const deleteDocument = api.document.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.document.getAll.invalidate({ projectId }),
        utils.project.get.invalidate({ projectId }),
        utils.project.getAll.invalidate(),
      ]);
    },
  });

  // =========================================
  // Recherche
  // =========================================

  const documents = documentsQuery.data ?? [];

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return documents;
    }

    return documents.filter((document) => {
      return (
        document.title.toLowerCase().includes(value) ||
        (document.content ?? "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [documents, search]);

  // =========================================
  // Supprimer document
  // =========================================

  async function handleDeleteDocument(
    documentId: string,
  ) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce document ?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument.mutateAsync({
        documentId,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du document :",
        error,
      );
    }
  }

  // =========================================
  // Chargement projet
  // =========================================

  if (projectQuery.isLoading) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[420px]
          w-full
          max-w-7xl
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-slate-500
            dark:text-slate-400
          "
        >
          <span
            className="
              size-5
              animate-spin
              rounded-full
              border-2
              border-slate-300
              border-t-sky-500
              dark:border-slate-700
              dark:border-t-sky-400
            "
          />

          Chargement du projet...
        </div>
      </div>
    );
  }

  // =========================================
  // Projet introuvable
  // =========================================

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[420px]
          w-full
          max-w-3xl
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-6
          text-center
          dark:border-[#1e3354]
          dark:bg-[#0b1830]
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          Projet introuvable
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Ce projet n&apos;existe pas ou vous n&apos;avez
          pas accès à celui-ci.
        </p>

        <Button
          asChild
          className="mt-6 rounded-xl"
        >
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux projets
          </Link>
        </Button>
      </div>
    );
  }

  const project = projectQuery.data;

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}

      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="
            -ml-2
            mb-5
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:bg-[#10213d]
            dark:hover:text-slate-100
          "
        >
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux projets
          </Link>
        </Button>

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-sky-50

                  dark:bg-sky-950/50
                "
              >
                <FileText
                  className="
                    size-6
                    text-sky-600
                    dark:text-sky-400
                  "
                />
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    dark:text-slate-100
                    sm:text-3xl
                  "
                >
                  {project.name}
                </h1>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {project.description ??
                    "Aucune description"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}

          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
            "
          >
            <Button
              asChild
              variant="outline"
              className="
                rounded-xl
                border-slate-200
                bg-white

                dark:border-[#244166]
                dark:bg-[#0b1830]
              "
            >
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
              >
                <Pencil className="mr-2 size-4" />
                Modifier
              </Link>
            </Button>

            <Button
              asChild
              className="
                rounded-xl
                shadow-sm
                shadow-sky-500/10
              "
            >
              <Link
                href={`/dashboard/generations/new?projectId=${project.id}`}
              >
                <Sparkles className="mr-2 size-4" />
                Nouvelle génération
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================
          SEARCH + NEW DOCUMENT
          ========================================= */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="relative w-full max-w-xl">
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
              shadow-sm

              dark:border-[#1e3354]
              dark:bg-[#0b1830]
            "
          />
        </div>

        <Button
          asChild
          className="rounded-xl"
        >
          <Link
            href={`/dashboard/projects/${project.id}/document/new`}
          >
            <Plus className="mr-2 size-4" />
            Nouveau document
          </Link>
        </Button>
      </div>

      {/* =========================================
          DOCUMENTS
          ========================================= */}

      {documentsQuery.isLoading ? (
        <div
          className="
            mt-6
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            <span
              className="
                size-5
                animate-spin
                rounded-full
                border-2
                border-slate-300
                border-t-sky-500
              "
            />

            Chargement des documents...
          </div>
        </div>
      ) : documentsQuery.isError ? (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            text-center

            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <p
            className="
              text-sm
              text-red-700
              dark:text-red-400
            "
          >
            Impossible de charger les documents.
          </p>

          <Button
            type="button"
            onClick={() => documentsQuery.refetch()}
            className="mt-4 rounded-xl"
          >
            Réessayer
          </Button>
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
          "
        >
          {/* Header desktop */}

          <div
            className="
              hidden
              grid-cols-[1fr_180px_48px]
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
            <span>Modifié</span>
            <span />
          </div>

          <div
            className="
              divide-y
              divide-slate-100
              dark:divide-[#1e3354]
            "
          >
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="
                  flex
                  flex-col
                  gap-4
                  px-4
                  py-4
                  transition-colors
                  hover:bg-slate-50

                  dark:hover:bg-[#0e1f38]

                  md:grid
                  md:grid-cols-[1fr_180px_48px]
                  md:items-center
                  md:gap-4
                  md:px-5
                "
              >
                {/* Document */}

                <Link
                  href={`/dashboard/projects/${project.id}/document/${document.id}`}
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
                    "
                  >
                    <FileText
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
                        line-clamp-1
                        text-xs
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      {document.content ??
                        "Aucun contenu"}
                    </p>
                  </div>
                </Link>

                {/* Date */}

                <p
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <Clock3 className="size-3.5" />

                  {new Date(
                    document.updatedAt,
                  ).toLocaleDateString("fr-FR")}
                </p>

                {/* Actions */}

                <div className="relative self-end md:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="
                      size-8
                      rounded-lg
                      text-slate-400
                      hover:bg-slate-100
                      hover:text-slate-700
                      
                      dark:text-slate-500
                      dark:hover:bg-[#10213d]
                      dark:hover:text-slate-100
                    "
                    onClick={() => {
                      void handleDeleteDocument(
                        document.id,
                      );
                    }}
                    disabled={deleteDocument.isPending}
                    aria-label={`Supprimer ${document.title}`}
                  >
                    <Trash2 className="size-4 " />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* =========================================
           EMPTY
           ========================================= */

        <div
          className="
            mt-6
            flex
            min-h-[360px]
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
              : "Créez votre premier document pour commencer à travailler avec ce projet."}
          </p>

          {!search && (
            <Button
              asChild
              className="mt-6 rounded-xl"
            >
              <Link
                href={`/dashboard/projects/${project.id}/document/new`}
              >
                <Plus className="mr-2 size-4" />
                Créer un document
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}