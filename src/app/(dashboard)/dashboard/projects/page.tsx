"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  Clock3,
  FileAudio,
  FileText,
  FolderOpen,
  Layers3,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { api } from "@/trpc/react";

export default function ProjectsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // =========================================================
  // PROJECTS
  // =========================================================

  const projectsQuery = api.project.getAll.useQuery();

  const projects = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);

  const stats = useMemo(() => {
    return projects.reduce(
      (totals, project) => ({
        documentCount: totals.documentCount + project.documentCount,
        generationCount: totals.generationCount + project.generationCount,
        audioDuration: totals.audioDuration + project.audioDuration,
      }),
      { documentCount: 0, generationCount: 0, audioDuration: 0 },
    );
  }, [projects]);

  // =========================================================
  // DELETE
  // =========================================================

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      setProjectToDelete(null);
      void projectsQuery.refetch();
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la suppression du projet :",
        error,
      );
    },
  });

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredProjects = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(value) ||
        (project.description ?? "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [projects, search]);

  // =========================================================
  // DELETE HANDLER
  // =========================================================

  function handleDelete() {
    if (!projectToDelete) {
      return;
    }

    deleteProject.mutate({
      projectId: projectToDelete.id,
    });
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (projectsQuery.isLoading) {
    return (
      <div className="flex min-h-[520px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="
              flex
              size-12
              items-center
              justify-center
              rounded-2xl
              bg-sky-50
              dark:bg-sky-950/40
            "
          >
            <div
              className="
                size-5
                animate-spin
                rounded-full
                border-2
                border-slate-200
                border-t-sky-500
                dark:border-slate-700
                dark:border-t-sky-400
              "
            />
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Chargement de vos projets...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (projectsQuery.isError) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[520px]
          w-full
          max-w-7xl
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-red-200
          bg-white
          px-6
          text-center
          dark:border-red-900/50
        "
      >
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-red-50
            text-red-500
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          <FolderOpen className="size-6" />
        </div>

        <h3
          className="
            mt-5
            text-lg
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Impossible de charger les projets
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
          Une erreur est survenue lors de la récupération
          de vos projets.
        </p>

        <Button
          type="button"
          onClick={() => void projectsQuery.refetch()}
          className="mt-6 rounded-xl"
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
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        className="
          relative
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
        {/* Decorative circles */}

        <div
          className="
            absolute
            -right-24
            -top-32
            size-80
            rounded-full
            bg-sky-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            left-1/3
            size-72
            rounded-full
            bg-violet-400/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            grid
            min-h-[310px]
            grid-cols-1
            items-center
            lg:grid-cols-[1fr_420px]
          "
        >
          {/* Hero content */}

          <div className="px-6 py-10 sm:px-10 lg:px-12">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-200
                bg-white/70
                px-3
                py-1.5
                text-xs
                font-semibold
                text-violet-700
                backdrop-blur
                dark:border-violet-900/50
                dark:bg-violet-950/20
                dark:text-violet-300
              "
            >
              <WandSparkles className="size-3.5" />

              Donnez vie à vos idées
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-5xl
                dark:text-white
              "
            >
              Mes projets
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
              Créez, gérez et organisez tous vos contenus
              audio au même endroit.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                className="
                  rounded-xl
                  bg-sky-600
                  px-5
                  shadow-lg
                  shadow-sky-500/20
                  hover:bg-sky-700
                "
              >
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 size-4" />
                  Nouveau projet
                </Link>
              </Button>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/80
                  bg-white/70
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  backdrop-blur
                  dark:border-[#263e5f]
                  dark:bg-[#10213d]/70
                  dark:text-slate-300
                "
              >
                <FolderOpen className="size-4 text-sky-500" />

                {projects.length} projet
                {projects.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Hero illustration */}

          <div className="relative hidden h-full min-h-[310px] lg:block">
            <div
              className="
                absolute
                inset-6
                rounded-3xl
                bg-white/30
                backdrop-blur-sm
                dark:bg-white/[0.02]
              "
            />

            <img
              src="/images/projects-hero.png"
              alt="Illustration de projets audio"
              className="
                relative
                z-10
                h-full
                w-full
                object-contain
                p-5
                drop-shadow-2xl
              "
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STATISTICS */}
      {/* ===================================================== */}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FolderOpen className="size-5" />}
          value={projects.length}
          label="Projets actifs"
          description="Vos espaces de travail"
          iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400"
        />

        <StatCard
          icon={<FileText className="size-5" />}
          value={stats.documentCount}
          label="Documents"
          description="Dans vos projets"
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
        />

        <StatCard
          icon={<Sparkles className="size-5" />}
          value={stats.generationCount}
          label="Générations"
          description="Contenus générés"
          iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
        />

        <StatCard
          icon={<Clock3 className="size-5" />}
          value={formatDuration(stats.audioDuration)}
          label="Temps généré"
          description="Audio produit"
          iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
        />
      </section>

      {/* ===================================================== */}
      {/* TOOLBAR */}
      {/* ===================================================== */}

      <section
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-3
          shadow-sm
          dark:border-[#1d3556]
          dark:bg-[#0b1830]
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}

          <div className="relative w-full lg:max-w-xl">
            <Search
              className="
                absolute
                left-3.5
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
              placeholder="Rechercher un projet..."
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-slate-50/70
                pl-10
                text-slate-900
                shadow-none
                placeholder:text-slate-400
                focus-visible:border-sky-500
                focus-visible:ring-sky-500/20
                dark:border-[#203858]
                dark:bg-[#10213d]
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />
          </div>

          {/* Toolbar right */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="
                hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-50
                sm:block
                dark:border-[#203858]
                dark:bg-[#10213d]
                dark:text-slate-300
                dark:hover:bg-[#162946]
              "
            >
              Plus récent
            </button>

            <button
              type="button"
              className="
                rounded-xl
                border
                border-slate-200
                bg-sky-50
                px-4
                py-2.5
                text-sm
                font-semibold
                text-sky-600
                dark:border-sky-900/50
                dark:bg-sky-950/30
                dark:text-sky-400
              "
            >
              <span className="hidden sm:inline">
                Grille
              </span>
              <span className="sm:hidden">▦</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROJECT GRID */}
      {/* ===================================================== */}

      {filteredProjects.length > 0 ? (
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                Tous vos projets
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {filteredProjects.length} résultat
                {filteredProjects.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-sky-200
                  hover:shadow-xl
                  hover:shadow-sky-950/5
                  dark:border-[#1d3556]
                  dark:bg-[#0b1830]
                  dark:hover:border-sky-800
                  dark:hover:shadow-black/20
                "
              >
                {/* Top glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    size-32
                    rounded-full
                    bg-sky-400/5
                    blur-2xl
                    transition
                    group-hover:bg-sky-400/10
                  "
                />

                {/* Header */}

                <div className="relative flex items-start justify-between gap-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <ProjectIcon projectId={project.id} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className="
                            truncate
                            text-sm
                            font-bold
                            text-slate-900
                            dark:text-white
                          "
                        >
                          {project.name}
                        </h3>

                        {index === 0 && (
                          <span
                            className="
                              shrink-0
                              rounded-full
                              bg-violet-50
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold
                              text-violet-600
                              dark:bg-violet-950/30
                              dark:text-violet-400
                            "
                          >
                            Récent
                          </span>
                        )}
                      </div>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        Projet audio
                      </p>
                    </div>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Options pour ${project.name}`}
                        className="
                          size-8
                          shrink-0
                          rounded-lg
                          text-slate-400
                          hover:bg-slate-100
                          hover:text-slate-700
                          dark:text-slate-500
                          dark:hover:bg-[#10213d]
                          dark:hover:text-white
                        "
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="
                        w-48
                        rounded-xl
                        border-slate-200
                        bg-white
                        dark:border-[#1d3556]
                        dark:bg-[#0b1830]
                      "
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/projects/${project.id}`,
                          )
                        }
                      >
                        <ArrowUpRight className="mr-2 size-4" />
                        Ouvrir
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/projects/${project.id}/edit`,
                          )
                        }
                      >
                        Modifier
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="
                          text-red-600
                          focus:bg-red-50
                          focus:text-red-600
                          dark:text-red-400
                          dark:focus:bg-red-950/40
                          dark:focus:text-red-400
                        "
                        onClick={() =>
                          setProjectToDelete({
                            id: project.id,
                            name: project.name,
                          })
                        }
                      >
                        <Trash2 className="mr-2 size-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description */}

                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="relative mt-5 block"
                >
                  <p
                    className="
                      line-clamp-2
                      min-h-[40px]
                      text-sm
                      leading-5
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {project.description ??
                      "Organisez vos documents et générations audio dans ce projet."}
                  </p>
                </Link>

                {/* Stats */}

                <div
                  className="
                    relative
                    mt-5
                    grid
                    grid-cols-3
                    gap-2
                  "
                >
                  <ProjectStat
                    icon={<FileText className="size-3.5" />}
                    value={String(project.documentCount)}
                    label="Documents"
                  />

                  <ProjectStat
                    icon={<Sparkles className="size-3.5" />}
                    value={String(project.generationCount)}
                    label="Générations"
                  />

                  <ProjectStat
                    icon={<Clock3 className="size-3.5" />}
                    value={formatDuration(project.audioDuration)}
                    label="Temps audio"
                  />
                </div>

                {/* Footer */}

                <div
                  className="
                    relative
                    mt-4
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    pt-4
                    text-xs
                    text-slate-400
                    dark:border-[#1d3556]
                    dark:text-slate-500
                  "
                >
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5" />

                    Modifié{" "}
                    {formatRelativeDate(
                      project.updatedAt,
                    )}
                  </span>

                  <span
                    className="
                      flex
                      size-7
                      items-center
                      justify-center
                      rounded-lg
                      bg-slate-50
                      text-slate-400
                      transition
                      group-hover:bg-sky-50
                      group-hover:text-sky-500
                      dark:bg-[#10213d]
                      dark:group-hover:bg-sky-950/30
                      dark:group-hover:text-sky-400
                    "
                  >
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* =================================================== */
        /* EMPTY STATE */
        /* =================================================== */

        <section
          className="
            mt-6
            overflow-hidden
            rounded-3xl
            border
            border-dashed
            border-slate-300
            bg-white
            dark:border-[#294467]
            dark:bg-[#0b1830]
          "
        >
          <div
            className="
              relative
              flex
              min-h-[430px]
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div
              className="
                absolute
                left-1/2
                top-1/2
                size-72
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
                bg-gradient-to-br
                from-sky-50
                to-violet-50
                text-sky-600
                shadow-sm
                dark:from-sky-950/40
                dark:to-violet-950/30
                dark:text-sky-400
              "
            >
              {search ? (
                <Search className="size-8" />
              ) : (
                <Layers3 className="size-8" />
              )}
            </div>

            <h3
              className="
                relative
                mt-6
                text-xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
              "
            >
              {search
                ? "Aucun projet trouvé"
                : "Commencez votre premier projet"}
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
              {search
                ? `Aucun projet ne correspond à « ${search} ».`
                : "Créez un espace pour organiser vos documents, générer des voix et construire vos contenus audio."}
            </p>

            {!search && (
              <Button
                asChild
                className="
                  relative
                  mt-6
                  rounded-xl
                  bg-sky-600
                  px-5
                  shadow-lg
                  shadow-sky-500/20
                  hover:bg-sky-700
                "
              >
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 size-4" />
                  Créer mon premier projet
                </Link>
              </Button>
            )}
          </div>
        </section>
      )}

      {/* ===================================================== */}
      {/* BOTTOM CTA */}
      {/* ===================================================== */}

      {filteredProjects.length > 0 && (
        <section
          className="
            relative
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-sky-100
            bg-gradient-to-r
            from-sky-50
            via-white
            to-violet-50
            dark:border-[#203858]
            dark:from-[#0d1d36]
            dark:via-[#0b1830]
            dark:to-[#171536]
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-20
              size-48
              rounded-full
              bg-violet-400/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              items-start
              gap-5
              px-6
              py-6
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-8
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-violet-600
                  shadow-sm
                  dark:bg-[#162946]
                  dark:text-violet-400
                "
              >
                <WandSparkles className="size-5" />
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
                  Prêt à créer quelque chose ?
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Lancez un nouveau projet et commencez
                  à générer votre contenu audio.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="
                w-full
                rounded-xl
                bg-sky-600
                shadow-lg
                shadow-sky-500/20
                hover:bg-sky-700
                sm:w-auto
              "
            >
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 size-4" />
                Nouveau projet
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* ===================================================== */}
      {/* DELETE DIALOG */}
      {/* ===================================================== */}

      <AlertDialog
        open={projectToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteProject.isPending) {
            setProjectToDelete(null);
          }
        }}
      >
        <AlertDialogContent
          className="
            rounded-2xl
            border-slate-200
            bg-white
            dark:border-[#1d3556]
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

            <AlertDialogTitle
              className="
                text-slate-900
                dark:text-white
              "
            >
              Supprimer le projet ?
            </AlertDialogTitle>

            <AlertDialogDescription
              className="
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {projectToDelete ? (
                <>
                  Vous êtes sur le point de supprimer{" "}
                  <strong className="text-slate-700 dark:text-slate-200">
                    {projectToDelete.name}
                  </strong>
                  .
                  <br />
                  <br />
                  Le projet sera déplacé dans la corbeille
                  avec ses documents et ses générations.
                  Vous pourrez le restaurer depuis les
                  paramètres.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteProject.isPending}
            >
              Annuler
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                deleteProject.isPending ||
                projectToDelete === null
              }
              className="
                bg-red-600
                text-white
                hover:bg-red-700
                focus:ring-red-600
              "
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
            >
              {deleteProject.isPending
                ? "Suppression..."
                : "Déplacer vers la corbeille"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  icon,
  value,
  label,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-[#1d3556]
        dark:bg-[#0b1830]
      "
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            size-11
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {value}
            </span>

            <span
              className="
                truncate
                text-xs
                font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              {label}
            </span>
          </div>

          <p
            className="
              mt-0.5
              truncate
              text-[11px]
              text-slate-400
              dark:text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PROJECT ICON */
/* ========================================================= */

function ProjectIcon({ projectId }: { projectId: string }) {
  const styles = [
    "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    "bg-orange-50 text-orange-500 dark:bg-orange-950/30 dark:text-orange-400",
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    "bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400",
    "bg-pink-50 text-pink-500 dark:bg-pink-950/30 dark:text-pink-400",
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
  ];

  const icons = [
    <Sparkles key="sparkles" className="size-5" />,
    <WandSparkles key="wand" className="size-5" />,
    <FileAudio key="audio" className="size-5" />,
    <FolderOpen key="folder" className="size-5" />,
    <Sparkles key="sparkles-2" className="size-5" />,
    <Layers3 key="layers" className="size-5" />,
  ];

  const index = getStableIndex(projectId, icons.length);

  return (
    <div
      className={`
        flex
        size-12
        shrink-0
        items-center
        justify-center
        rounded-2xl
        ${styles[index % styles.length]}
      `}
    >
      {icons[index % icons.length]}
    </div>
  );
}

/* ========================================================= */
/* PROJECT STAT */
/* ========================================================= */

function formatDuration(seconds: number) {
  if (seconds <= 0) {
    return "0 min";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes.toString().padStart(2, "0")}`;
  }

  if (seconds < 60) {
    return `${Math.round(seconds)} s`;
  }

  return `${Math.max(1, minutes)} min`;
}

function ProjectStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-slate-50
        px-3
        py-2.5
        dark:bg-[#10213d]
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-slate-400
          dark:text-slate-500
        "
      >
        {icon}

        <span className="text-[11px]">
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          text-sm
          font-bold
          text-slate-700
          dark:text-slate-200
        "
      >
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* DATE */
/* ========================================================= */

function formatRelativeDate(
  date: unknown,
) {
  const parsedDate =
    date instanceof Date
      ? date
      : new Date(String(date));
  const value = parsedDate.getTime();
  const now = Date.now();

  const difference = now - value;

  const minutes = Math.floor(
    difference / (1000 * 60),
  );

  if (minutes < 1) {
    return "à l'instant";
  }

  if (minutes < 60) {
    return `il y a ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `il y a ${hours}h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `il y a ${days}j`;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getStableIndex(value: string, length: number) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash) % length;
}