"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FolderOpen,
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  Clock3,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { api } from "@/trpc/react";


export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Récupération des vrais projets depuis l'API
  const projectsQuery = api.project.getAll.useQuery();

  const projects = projectsQuery.data ?? [];

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      void projectsQuery.refetch();
    },
  });

  const restoreProject = api.project.restore.useMutation({
    onSuccess: () => {
      void projectsQuery.refetch();
    },
  });

  async function handleDelete(projectId: string) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce projet ?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject.mutateAsync({
        projectId,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du projet :",
        error,
      );
    }
  }

  async function handleRestore(projectId: string) {
    try {
      await restoreProject.mutateAsync({
        projectId,
      });

    } catch (error) {
      console.error(
        "Erreur lors de la restauration du projet :",
        error,
      );
    }
  }


  // Recherche
  const filteredProjects = projects.filter((project) => {
    const value = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(value) ||
      (project.description ?? "").toLowerCase().includes(value)
    );
  });

  // ================================
  // Chargement
  // ================================
  if (projectsQuery.isLoading) {
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
          text-slate-500
          dark:text-slate-400
        "
      >
        <div className="flex items-center gap-3">
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

          Chargement des projets...
        </div>
      </div>
    );
  }

  // ================================
  // Erreur
  // ================================
  if (projectsQuery.isError) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[420px]
          w-full
          max-w-7xl
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-red-200
          bg-white
          px-6
          text-center
          dark:border-red-900/50
          dark:bg-[#0b1830]
        "
      >
        <h3
          className="
            text-lg
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          Impossible de charger les projets
        </h3>

        <p
          className="
            mt-2
            max-w-md
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Une erreur est survenue lors de la récupération de vos projets.
        </p>

        <Button
          type="button"
          onClick={() => void projectsQuery.refetch()}
          className="mt-5 rounded-xl"
        >
          Réessayer
        </Button>
      </div>
    );
  }

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
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-slate-100
              sm:text-3xl
            "
          >
            Projets
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
              sm:text-base
            "
          >
            Organisez vos générations et vos contenus
            dans des projets.
          </p>
        </div>

        {/* Nouveau projet */}
        <Button
          asChild
          className="
            w-full
            rounded-xl
            shadow-sm
            shadow-sky-500/10
            sm:w-auto
          "
        >
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 size-4" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {/* =========================================
          SEARCH
          ========================================= */}
      <div className="mt-6">
        <div className="relative max-w-xl">
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un projet..."
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
          PROJECTS
          ========================================= */}
      {filteredProjects.length > 0 ? (
        <div
          className="
            mt-8
            grid
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:border-sky-200
                hover:shadow-md
                dark:border-[#1e3354]
                dark:bg-[#0b1830]
                dark:hover:border-sky-800
                dark:hover:shadow-lg
                dark:hover:shadow-sky-950/20
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <Link
                  href={`/dashboard/projects/${project.id}/documents`}
                  className="flex min-w-0 flex-1 items-start gap-3"
                >
                  <div
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-50
                      dark:bg-sky-950/50
                      dark:shadow-sm
                      dark:shadow-sky-950/20
                    "
                  >
                    <FolderOpen
                      className="
                        size-5
                        text-sky-600
                        dark:text-sky-400
                      "
                    />
                  </div>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Modifier ${project.name}`}
                  onClick={() => {
                    router.push(`/dashboard/projects/${project.id}/edit`);
                  }}
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
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>

              <Link
                href={`/dashboard/projects/${project.id}/documents`}
                className="mt-5 block"
              >
                <h3
                  className="
                    truncate
                    font-semibold
                    text-slate-900
                    dark:text-slate-100
                  "
                >
                  {project.name}
                </h3>

                <p
                  className="
                    mt-1
                    line-clamp-2
                    text-sm
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {project.description ?? "Aucune description"}
                </p>
              </Link>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  border-t
                  border-slate-100
                  pt-4
                  text-xs
                  text-slate-400
                  dark:border-[#1e3354]
                  dark:text-slate-500
                "
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />

                  {project.isFavorite ? "Favori" : "Projet"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />

                  {new Date(project.createdAt).toLocaleDateString(
                    "fr-FR",
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =================================
           EMPTY STATE
           ========================================= */
        <div
          className="
            mt-8
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
          {/* Icon */}
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
            <FolderOpen
              className="
                size-7
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          {/* Title */}
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
              ? "Aucun projet trouvé"
              : "Aucun projet"}
          </h3>

          {/* Description */}
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
              ? `Aucun projet ne correspond à « ${search} ».`
              : "Créez votre premier projet pour organiser vos générations et vos contenus."}
          </p>

          {/* CTA */}
          {!search && (
            <Button
              asChild
              className="
                mt-6
                rounded-xl
                shadow-sm
                shadow-sky-500/10
              "
            >
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 size-4" />
                Créer mon premier projet
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}