"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileAudio,
  FileText,
  FolderOpen,
  FolderPlus,
  GraduationCap,
  Headphones,
  Info,
  Layers3,
  Lightbulb,
  Mic2,
  PenLine,
  Plus,
  Radio,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";

type ProjectFormValues = {
  name: string;
  description: string;
};

const suggestions = [
  {
    label: "Podcast Marketing",
    icon: Mic2,
    className:
      "border-violet-100 bg-violet-50 text-violet-700 hover:border-violet-200 hover:bg-violet-100 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-300",
  },
  {
    label: "Formation Clients",
    icon: GraduationCap,
    className:
      "border-sky-100 bg-sky-50 text-sky-700 hover:border-sky-200 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-300",
  },
  {
    label: "Vidéo YouTube",
    icon: Video,
    className:
      "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-200 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300",
  },
  {
    label: "Narration Livre",
    icon: Headphones,
    className:
      "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300",
  },
  {
    label: "Publicité Radio",
    icon: Radio,
    className:
      "border-orange-100 bg-orange-50 text-orange-700 hover:border-orange-200 hover:bg-orange-100 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-300",
  },
  {
    label: "Interview Experts",
    icon: Users,
    className:
      "border-purple-100 bg-purple-50 text-purple-700 hover:border-purple-200 hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-300",
  },
  {
    label: "E-learning",
    icon: Layers3,
    className:
      "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300",
  },
];

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const name = form.watch("name");
  const description = form.watch("description");

  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setIsLoading(true);

    try {
      await createProject.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
      });

      form.reset();

      window.location.href = "/dashboard/projects";
    } catch (error) {
      console.error(
        "Erreur lors de la création du projet :",
        error,
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }

  function handleSuggestion(label: string) {
    if (!form.getValues("name")) {
      form.setValue("name", label, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      form.setValue("name", label, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  const previewName =
    name.trim() || "Mon nouveau projet";

  const previewDescription =
    description.trim() ||
    "Description de votre projet...";

  const nameLength = name.length;
  const descriptionLength = description.length;

  const canSubmit =
    name.trim().length > 0 && !isLoading;

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        pb-12
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* ===================================================== */}
      {/* BACK */}
      {/* ===================================================== */}

      <div className="mb-5">
        <Button
          asChild
          variant="ghost"
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
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux projets
          </Link>
        </Button>
      </div>

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
        {/* Decorative background */}

        <div
          className="
            absolute
            -right-24
            -top-28
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
            min-h-[290px]
            grid-cols-1
            lg:grid-cols-[1fr_430px]
          "
        >
          {/* Hero content */}

          <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-12">
            <div
              className="
                inline-flex
                w-fit
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
              <Sparkles className="size-3.5" />

              Nouveau projet
            </div>

            <h1
              className="
                mt-5
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-4xl
                lg:text-5xl
                dark:text-white
              "
            >
              Créez un nouveau projet
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
              Organisez vos documents, générez des voix
              et construisez votre contenu audio dans un
              espace dédié.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <FeatureBadge
                icon={<FolderOpen className="size-3.5" />}
                label="Documents"
              />

              <FeatureBadge
                icon={<Mic2 className="size-3.5" />}
                label="Voix IA"
              />

              <FeatureBadge
                icon={<Sparkles className="size-3.5" />}
                label="Générations"
              />
            </div>
          </div>

          {/* Hero image */}

          <div className="relative hidden min-h-[290px] lg:block">
            <div
              className="
                absolute
                inset-5
                rounded-3xl
                bg-white/30
                backdrop-blur-sm
                dark:bg-white/[0.02]
              "
            />

            <img
              src="/images/new-project-hero.png"
              alt="Créer un nouveau projet"
              className="
                relative
                z-10
                h-full
                w-full
                object-contain
                p-4
                drop-shadow-2xl
              "
            />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <div
        className="
          mt-6
          grid
          gap-6
          lg:grid-cols-[minmax(0,1fr)_340px]
        "
      >
        {/* =================================================== */}
        {/* FORM */}
        {/* =================================================== */}

        <div
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
          {/* Card header */}

          <div
            className="
              border-b
              border-slate-100
              px-6
              py-5
              dark:border-[#1d3556]
              sm:px-7
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-sky-50
                  text-sky-600
                  dark:bg-sky-950/30
                  dark:text-sky-400
                "
              >
                <PenLine className="size-5" />
              </div>

              <div>
                <h2
                  className="
                    text-base
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Informations du projet
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Donnez un nom et une description à votre
                  projet.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-7"
              >
                {/* ========================================= */}
                {/* NAME */}
                {/* ========================================= */}

                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required:
                      "Le nom du projet est obligatoire.",
                    maxLength: {
                      value: 100,
                      message:
                        "Le nom ne peut pas dépasser 100 caractères.",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel
                          className="
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          Nom du projet
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </FormLabel>

                        <span
                          className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {nameLength}/100
                        </span>
                      </div>

                      <FormControl>
                        <div className="relative">
                          <FolderOpen
                            className="
                              absolute
                              left-3.5
                              top-1/2
                              size-4
                              -translate-y-1/2
                              text-sky-500
                            "
                          />

                          <Input
                            {...field}
                            maxLength={100}
                            placeholder="Ex. Podcast Marketing 2024"
                            className="
                              h-12
                              rounded-xl
                              border-slate-200
                              bg-slate-50/50
                              pl-10
                              text-sm
                              font-medium
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
                      </FormControl>

                      <p
                        className="
                          text-xs
                          leading-5
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        Choisissez un nom clair et
                        descriptif pour retrouver facilement
                        votre projet.
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================= */}
                {/* DESCRIPTION */}
                {/* ========================================= */}

                <FormField
                  control={form.control}
                  name="description"
                  rules={{
                    maxLength: {
                      value: 500,
                      message:
                        "La description ne peut pas dépasser 500 caractères.",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel
                          className="
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          Description
                          <span
                            className="
                              ml-1
                              font-normal
                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            (facultatif)
                          </span>
                        </FormLabel>

                        <span
                          className="
                            text-[11px]
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {descriptionLength}/500
                        </span>
                      </div>

                      <FormControl>
                        <div className="relative">
                          <FileText
                            className="
                              absolute
                              left-3.5
                              top-4
                              size-4
                              text-slate-400
                            "
                          />

                          <textarea
                            {...field}
                            maxLength={500}
                            rows={6}
                            placeholder="Décrivez l'objectif de ce projet, son contenu, votre audience..."
                            className="
                              flex
                              min-h-[150px]
                              w-full
                              resize-none
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50/50
                              px-3
                              py-3
                              pl-10
                              text-sm
                              leading-6
                              text-slate-900
                              outline-none
                              transition
                              placeholder:text-slate-400
                              focus:border-sky-500
                              focus:ring-2
                              focus:ring-sky-500/20
                              dark:border-[#203858]
                              dark:bg-[#10213d]
                              dark:text-white
                              dark:placeholder:text-slate-500
                              dark:focus:border-sky-500
                            "
                          />
                        </div>
                      </FormControl>

                      <p
                        className="
                          text-xs
                          leading-5
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        Cette description vous aidera à
                        vous souvenir du but de ce projet.
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================= */}
                {/* SUGGESTIONS */}
                {/* ========================================= */}

                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="
                        size-4
                        text-violet-500
                      "
                    />

                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      Suggestions
                    </h3>
                  </div>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Vous manquez d&apos;inspiration ? Choisissez
                    un exemple pour commencer.
                  </p>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-1
                      gap-2
                      sm:grid-cols-2
                      xl:grid-cols-3
                    "
                  >
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon;

                      return (
                        <button
                          key={suggestion.label}
                          type="button"
                          onClick={() =>
                            handleSuggestion(
                              suggestion.label,
                            )
                          }
                          className={`
                            flex
                            items-center
                            gap-2.5
                            rounded-xl
                            border
                            px-3
                            py-2.5
                            text-left
                            text-xs
                            font-semibold
                            transition
                            ${suggestion.className}
                          `}
                        >
                          <Icon className="size-4 shrink-0" />

                          <span className="truncate">
                            {suggestion.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ========================================= */}
                {/* ACTIONS */}
                {/* ========================================= */}

                <div
                  className="
                    border-t
                    border-slate-100
                    pt-6
                    dark:border-[#1d3556]
                  "
                >
                  <div
                    className="
                      flex
                      flex-col-reverse
                      gap-3
                      sm:flex-row
                      sm:justify-end
                    "
                  >
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      disabled={isLoading}
                      className="
                        h-11
                        rounded-xl
                        border-slate-200
                        bg-white
                        px-5
                        text-slate-700
                        hover:bg-slate-50
                        dark:border-[#294467]
                        dark:bg-[#0b1830]
                        dark:text-slate-300
                        dark:hover:bg-[#10213d]
                      "
                    >
                      <Link href="/dashboard/projects">
                        Annuler
                      </Link>
                    </Button>

                    <Button
                      type="submit"
                      disabled={!canSubmit}
                      className="
                        h-11
                        rounded-xl
                        bg-sky-600
                        px-6
                        font-semibold
                        shadow-lg
                        shadow-sky-500/20
                        hover:bg-sky-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="
                              mr-2
                              size-4
                              animate-spin
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          Création...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 size-4" />

                          Créer le projet

                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <p
                    className="
                      mt-3
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      text-[11px]
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    <Check className="size-3.5 text-emerald-500" />

                    Votre projet sera créé en quelques
                    secondes.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* =================================================== */}
        {/* SIDEBAR */}
        {/* =================================================== */}

        <aside className="space-y-4">
          {/* =============================================== */}
          {/* FEATURES */}
          {/* =============================================== */}

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
                <Info className="size-5" />
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
                  Ce que vous pourrez faire
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Une fois votre projet créé
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <FeatureRow
                icon={<FolderOpen className="size-4" />}
                title="Ajouter des documents"
                description="Importez vos textes et contenus."
                iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400"
              />

              <FeatureRow
                icon={<Mic2 className="size-4" />}
                title="Générer des voix"
                description="Transformez vos textes en audio."
                iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
              />

              <FeatureRow
                icon={<Layers3 className="size-4" />}
                title="Organiser votre contenu"
                description="Structurez vos générations."
                iconClass="bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
              />

              <FeatureRow
                icon={<Users className="size-4" />}
                title="Collaborer"
                description="Travaillez en équipe prochainement."
                iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              />
            </div>
          </div>

          {/* =============================================== */}
          {/* TIP */}
          {/* =============================================== */}

          <div
            className="
              rounded-2xl
              border
              border-amber-100
              bg-amber-50/70
              p-5
              dark:border-amber-900/40
              dark:bg-amber-950/10
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
                  bg-amber-100
                  text-amber-600
                  dark:bg-amber-950/40
                  dark:text-amber-400
                "
              >
                <Lightbulb className="size-5" />
              </div>

              <div>
                <h3
                  className="
                    text-sm
                    font-bold
                    text-amber-900
                    dark:text-amber-300
                  "
                >
                  Conseil
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-amber-700/70
                    dark:text-amber-400/70
                  "
                >
                  Pour un projet réussi
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                rounded-xl
                border
                border-amber-200
                bg-white/60
                p-3.5
                dark:border-amber-900/40
                dark:bg-amber-950/20
              "
            >
              <p
                className="
                  text-xs
                  leading-5
                  text-amber-800
                  dark:text-amber-300
                "
              >
                Un bon nom et une description claire vous
                aideront à retrouver facilement votre projet
                dans le futur.
              </p>
            </div>
          </div>

          {/* ============================================== */}
          {/* PREVIEW */}
          {/* ============================================== */}

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
                  bg-indigo-50
                  text-indigo-600
                  dark:bg-indigo-950/30
                  dark:text-indigo-400
                "
              >
                <Headphones className="size-5" />
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
                  Aperçu
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Votre projet apparaîtra ainsi
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-slate-100
                bg-slate-50
                p-4
                dark:border-[#203858]
                dark:bg-[#10213d]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-50
                    text-violet-600
                    dark:bg-violet-950/30
                    dark:text-violet-400
                  "
                >
                  <FolderOpen className="size-5" />
                </div>

                <div className="min-w-0">
                  <h4
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-slate-800
                      dark:text-slate-100
                    "
                  >
                    {previewName}
                  </h4>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    {previewDescription}
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  gap-2
                  border-t
                  border-slate-200
                  pt-3
                  dark:border-[#203858]
                "
              >
                <PreviewStat
                  icon={<FileText className="size-3.5" />}
                  value="0"
                  label="docs"
                />

                <PreviewStat
                  icon={<FileAudio className="size-3.5" />}
                  value="0"
                  label="géné."
                />

                <PreviewStat
                  icon={<Sparkles className="size-3.5" />}
                  value="—"
                  label="audio"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FEATURE BADGE */
/* ========================================================= */

function FeatureBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-white/80
        bg-white/70
        px-3
        py-2
        text-xs
        font-medium
        text-slate-600
        backdrop-blur
        dark:border-[#263e5f]
        dark:bg-[#10213d]/70
        dark:text-slate-300
      "
    >
      <span className="text-sky-500">
        {icon}
      </span>

      {label}
    </div>
  );
}

/* ========================================================= */
/* FEATURE ROW */
/* ========================================================= */

function FeatureRow({
  icon,
  title,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h4
          className="
            text-xs
            font-semibold
            text-slate-800
            dark:text-slate-200
          "
        >
          {title}
        </h4>

        <p
          className="
            mt-0.5
            text-[11px]
            leading-4
            text-slate-400
            dark:text-slate-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PREVIEW STAT */
/* ========================================================= */

function PreviewStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div
        className="
          flex
          items-center
          justify-center
          gap-1
          text-slate-400
          dark:text-slate-500
        "
      >
        {icon}

        <span className="text-[10px]">
          {value}
        </span>
      </div>

      <p
        className="
          mt-0.5
          text-[9px]
          text-slate-400
          dark:text-slate-500
        "
      >
        {label}
      </p>
    </div>
  );
}