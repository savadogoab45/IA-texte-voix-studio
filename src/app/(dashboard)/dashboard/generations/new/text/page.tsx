"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  Loader2,
  Sparkles,
  Volume2,
} from "lucide-react";

import { api } from "@/trpc/react";

export default function NewTextGenerationPage() {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  // ─────────────────────────────────────
  // PROJETS
  // ─────────────────────────────────────

  const projectsQuery = api.project.getAll.useQuery();

  // ─────────────────────────────────────
  // DOCUMENTS
  // Les documents ne sont récupérés
  // qu'après sélection d'un projet.
  // ─────────────────────────────────────

  const documentsQuery = api.document.getAll.useQuery(
    {
      projectId,
    },
    {
      enabled: Boolean(projectId),
    },
  );

  // ─────────────────────────────────────
  // VOIX
  // ─────────────────────────────────────

  const voicesQuery = api.voice.getAll.useQuery();

  // ─────────────────────────────────────
  // CRÉATION DE LA GÉNÉRATION
  // ─────────────────────────────────────

  const createGeneration =
    api.generation.create.useMutation({
      onSuccess: (generation) => {
        setError("");

        router.push(
          `/dashboard/generations/${generation.id}`,
        );
      },

      onError: (mutationError) => {
        setError(mutationError.message);
      },
    });

  const projects = projectsQuery.data ?? [];
  const documents = documentsQuery.data ?? [];
  const voices = voicesQuery.data ?? [];

  // Pour l'instant nous utilisons uniquement
  // les voix associées à OpenAI.
  const openAiVoices = voices.filter(
    (voice) => voice.provider === "OPENAI",
  );

  const isLoading =
    projectsQuery.isLoading ||
    voicesQuery.isLoading;

  const isSubmitting =
    createGeneration.isPending;

  // ─────────────────────────────────────
  // CHANGEMENT DE PROJET
  // ─────────────────────────────────────

  function handleProjectChange(
    value: string,
  ) {
    setProjectId(value);

    // Le document sélectionné appartient
    // potentiellement à l'ancien projet.
    // On le réinitialise.
    setDocumentId("");

    setError("");
  }

  // ─────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!projectId) {
      setError(
        "Veuillez sélectionner un projet.",
      );
      return;
    }

    if (!documentId) {
      setError(
        "Veuillez sélectionner un document.",
      );
      return;
    }

    if (!voiceId) {
      setError(
        "Veuillez sélectionner une voix.",
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Veuillez saisir un titre.",
      );
      return;
    }

    if (!prompt.trim()) {
      setError(
        "Veuillez saisir une instruction.",
      );
      return;
    }

    createGeneration.mutate({
      documentId,
      voiceId,
      title: title.trim(),
      prompt: prompt.trim(),
      provider: "OPENAI",
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ─────────────────────────────── */}
      {/* HEADER */}
      {/* ─────────────────────────────── */}

      <div className="mb-8">
        <Link
          href="/dashboard/generations/new"
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition-colors
            hover:text-sky-600
            dark:text-slate-400
            dark:hover:text-sky-400
          "
        >
          <ArrowLeft className="size-4" />
          Retour
        </Link>

        <div className="flex items-start gap-4">
          <div
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-sky-50
              dark:bg-sky-950/40
            "
          >
            <Sparkles className="size-6 text-sky-600 dark:text-sky-400" />
          </div>

          <div>
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-slate-100
                sm:text-3xl
              "
            >
              Générer du texte
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Créez du contenu avec l&apos;IA à
              partir de votre document.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────── */}
      {/* FORMULAIRE */}
      {/* ─────────────────────────────── */}

      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
          sm:p-8
        "
      >
        {/* ─────────────────────────── */}
        {/* PROJET */}
        {/* ─────────────────────────── */}

        <div>
          <label
            htmlFor="project"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Projet
          </label>

          <div className="relative">
            <FolderOpen
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              id="project"
              value={projectId}
              onChange={(event) =>
                handleProjectChange(
                  event.target.value,
                )
              }
              disabled={
                projectsQuery.isLoading ||
                isSubmitting
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-sky-400
                focus:ring-2
                focus:ring-sky-400/20
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-slate-100
              "
            >
              <option value="">
                {projectsQuery.isLoading
                  ? "Chargement des projets..."
                  : "Sélectionner un projet"}
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {projectsQuery.isError && (
            <p className="mt-2 text-sm text-red-500">
              Impossible de charger les projets.
            </p>
          )}

          {!projectsQuery.isLoading &&
            !projectsQuery.isError &&
            projects.length === 0 && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Aucun projet disponible.
              </p>
            )}
        </div>

        {/* ─────────────────────────── */}
        {/* DOCUMENT */}
        {/* ─────────────────────────── */}

        <div className="mt-6">
          <label
            htmlFor="document"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Document
          </label>

          <div className="relative">
            <FileText
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              id="document"
              value={documentId}
              onChange={(event) =>
                setDocumentId(
                  event.target.value,
                )
              }
              disabled={
                !projectId ||
                documentsQuery.isLoading ||
                isSubmitting
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-sky-400
                focus:ring-2
                focus:ring-sky-400/20
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-slate-100
              "
            >
              <option value="">
                {!projectId
                  ? "Sélectionnez d'abord un projet"
                  : documentsQuery.isLoading
                    ? "Chargement des documents..."
                    : "Sélectionner un document"}
              </option>

              {documents.map((document) => (
                <option
                  key={document.id}
                  value={document.id}
                >
                  {document.title}
                </option>
              ))}
            </select>
          </div>

          {documentsQuery.isError && (
            <p className="mt-2 text-sm text-red-500">
              Impossible de charger les documents.
            </p>
          )}

          {projectId &&
            !documentsQuery.isLoading &&
            !documentsQuery.isError &&
            documents.length === 0 && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Aucun document dans ce projet.
              </p>
            )}
        </div>

        {/* ─────────────────────────── */}
        {/* TITRE */}
        {/* ─────────────────────────── */}

        <div className="mt-6">
          <label
            htmlFor="title"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Titre
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Ex. Mon histoire fantastique"
            disabled={isSubmitting}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-sky-400
              focus:ring-2
              focus:ring-sky-400/20
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-slate-100
            "
          />
        </div>

        {/* ─────────────────────────── */}
        {/* PROMPT */}
        {/* ─────────────────────────── */}

        <div className="mt-6">
          <label
            htmlFor="prompt"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Instruction
          </label>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) =>
              setPrompt(event.target.value)
            }
            placeholder="Décrivez précisément le contenu que vous souhaitez générer..."
            rows={8}
            disabled={isSubmitting}
            className="
              w-full
              resize-y
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3
              text-sm
              leading-6
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-sky-400
              focus:ring-2
              focus:ring-sky-400/20
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-slate-100
            "
          />
        </div>

        {/* ─────────────────────────── */}
        {/* VOIX */}
        {/* ─────────────────────────── */}

        <div className="mt-6">
          <label
            htmlFor="voice"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Voix
          </label>

          <div className="relative">
            <Volume2
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <select
              id="voice"
              value={voiceId}
              onChange={(event) =>
                setVoiceId(
                  event.target.value,
                )
              }
              disabled={
                voicesQuery.isLoading ||
                isSubmitting
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-sky-400
                focus:ring-2
                focus:ring-sky-400/20
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-slate-100
              "
            >
              <option value="">
                {voicesQuery.isLoading
                  ? "Chargement des voix..."
                  : "Sélectionner une voix"}
              </option>

              {openAiVoices.map((voice) => (
                <option
                  key={voice.id}
                  value={voice.id}
                  disabled={!voice.isActive}
                >
                  {voice.name}
                  {voice.language
                    ? ` — ${voice.language}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {voicesQuery.isError && (
            <p className="mt-2 text-sm text-red-500">
              Impossible de charger les voix.
            </p>
          )}

          {!voicesQuery.isLoading &&
            !voicesQuery.isError &&
            openAiVoices.length === 0 && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Aucune voix OpenAI disponible.
              </p>
            )}
        </div>

        {/* ─────────────────────────── */}
        {/* FOURNISSEUR */}
        {/* ─────────────────────────── */}

        <div className="mt-6">
          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-900
              dark:text-slate-100
            "
          >
            Fournisseur IA
          </label>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-sky-200
              bg-sky-50
              px-4
              py-3
              dark:border-sky-900
              dark:bg-sky-950/30
            "
          >
            <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />

            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                OpenAI
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Génération avec OpenAI
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────── */}
        {/* ERREUR */}
        {/* ─────────────────────────── */}

        {error && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* ─────────────────────────── */}
        {/* BOUTON */}
        {/* ─────────────────────────── */}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              projectsQuery.isLoading ||
              voicesQuery.isLoading ||
              !projectId ||
              !documentId ||
              !voiceId ||
              !title.trim() ||
              !prompt.trim()
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-sky-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-sky-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Générer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}