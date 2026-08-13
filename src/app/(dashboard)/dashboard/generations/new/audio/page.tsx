"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  AudioLines,
  Check,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

export default function NewAudioGenerationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================
  // Paramètres URL
  // =========================================

  const projectId =
    mounted
      ? searchParams.get("projectId") ?? ""
      : "";

  const documentId =
    mounted
      ? searchParams.get("documentId") ?? ""
      : "";

  // =========================================
  // États
  // =========================================

  const [title, setTitle] = useState("");

  const [prompt, setPrompt] = useState(
    "Transformez le contenu de ce document en une narration audio naturelle et agréable à écouter.",
  );

  const [voiceId, setVoiceId] = useState("");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  // =========================================
  // Document
  // =========================================

  const documentQuery =
    api.document.getById.useQuery(
      {
        documentId,
      },
      {
        enabled: Boolean(documentId),
      },
    );

  // =========================================
  // Voix
  // =========================================

  const voicesQuery =
    api.voice.getFree.useQuery();

  const voices = voicesQuery.data ?? [];

  // =========================================
  // Création génération
  // =========================================

  const createGeneration =
    api.generation.create.useMutation({
      onSuccess: (generation) => {
        router.push(
          `/dashboard/generations/${generation.id}`,
        );
      },

      onError: (error) => {
        console.error(
          "Erreur lors de la création de la génération :",
          error,
        );

        setErrorMessage(
          error.message ||
            "Impossible de créer la génération.",
        );
      },
    });

  // =========================================
  // Générer
  // =========================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(null);

    if (!projectId) {
      setErrorMessage(
        "Aucun projet n'a été sélectionné.",
      );

      return;
    }

    if (!documentId) {
      setErrorMessage(
        "Aucun document n'a été sélectionné.",
      );

      return;
    }

    if (!voiceId) {
      setErrorMessage(
        "Veuillez sélectionner une voix.",
      );

      return;
    }

    if (!prompt.trim()) {
      setErrorMessage(
        "Veuillez saisir une instruction.",
      );

      return;
    }

    try {
      await createGeneration.mutateAsync({
        title:
          title.trim() ||
          "Nouvelle génération audio",

        prompt: prompt.trim(),

        provider: "OPENAI",

        documentId,

        voiceId,
      });
    } catch {
      // L'erreur est déjà traitée par onError.
    }
  }

  // =========================================
  // Aucun document
  // =========================================

  if (!documentId) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
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
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-amber-50
            dark:bg-amber-950/30
          "
        >
          <FileText
            className="
              size-7
              text-amber-600
              dark:text-amber-400
            "
          />
        </div>

        <h2
          className="
            mt-5
            text-xl
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          Aucun document sélectionné
        </h2>

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
          Sélectionnez un document avant de
          générer un audio.
        </p>

        <Button
          asChild
          className="mt-6 rounded-xl"
        >
          <Link
            href={
              projectId
                ? `/dashboard/projects/${projectId}`
                : "/dashboard/projects"
            }
          >
            <ArrowLeft className="mr-2 size-4" />

            Retour au projet
          </Link>
        </Button>
      </div>
    );
  }

  // =========================================
  // Chargement document
  // =========================================

  if (documentQuery.isLoading) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-3xl
          items-center
          justify-center
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
          <Loader2 className="size-5 animate-spin" />

          Chargement du document...
        </div>
      </div>
    );
  }

  // =========================================
  // Document introuvable
  // =========================================

  if (
    documentQuery.isError ||
    !documentQuery.data
  ) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
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
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-red-50
            dark:bg-red-950/30
          "
        >
          <FileText
            className="
              size-7
              text-red-500
              dark:text-red-400
            "
          />
        </div>

        <h2
          className="
            mt-5
            text-xl
            font-semibold
            text-slate-900
            dark:text-slate-100
          "
        >
          Document introuvable
        </h2>

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
          Ce document n&apos;existe pas ou vous
          n&apos;avez pas accès à celui-ci.
        </p>

        <Button
          asChild
          className="mt-6 rounded-xl"
        >
          <Link
            href={
              projectId
                ? `/dashboard/projects/${projectId}`
                : "/dashboard/projects"
            }
          >
            <ArrowLeft className="mr-2 size-4" />

            Retour au projet
          </Link>
        </Button>
      </div>
    );
  }

  const document = documentQuery.data;

  // =========================================
  // Interface
  // =========================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-5xl
        px-4
        py-6
        text-slate-900
        dark:text-slate-100
        sm:px-6
        lg:px-8
      "
    >
      {/* =====================================
          HEADER
          ===================================== */}

      <div className="mb-8">
        <Link
          href={
            projectId
              ? `/dashboard/projects/${projectId}`
              : "/dashboard/projects"
          }
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

          Retour au projet
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-cyan-50
              dark:bg-cyan-950/40
            "
          >
            <AudioLines
              className="
                size-6
                text-cyan-600
                dark:text-cyan-400
              "
            />
          </div>

          <div className="min-w-0">
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
              Générer un audio
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Transformez votre document en une
              narration audio naturelle.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          FORM
          ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="
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
        {/* ===================================
            DOCUMENT
            =================================== */}

        <div
          className="
            border-b
            border-slate-100
            p-5
            dark:border-[#1e3354]
            sm:p-6
          "
        >
          <h2
            className="
              text-sm
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            Document source
          </h2>

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
              dark:border-[#1e3354]
              dark:bg-[#071a33]
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
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {document.content?.length ?? 0}{" "}
                caractères
              </p>
            </div>
          </div>
        </div>

        {/* ===================================
            OPTIONS
            =================================== */}

        <div className="space-y-6 p-5 sm:p-6">
          {/* Titre */}

          <div>
            <label
              htmlFor="generation-title"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Nom de la génération
            </label>

            <Input
              id="generation-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrorMessage(null);
              }}
              placeholder="Ex. Chapitre 1 - Audio"
              maxLength={255}
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white
                dark:border-[#1e3354]
                dark:bg-[#071a33]
              "
            />
          </div>

          {/* Voix */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="generation-voice"
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Voix
              </label>

              {voiceId && (
                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-medium
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <Check className="size-3.5" />

                  Sélectionnée
                </span>
              )}
            </div>

            {voicesQuery.isLoading ? (
              <div
                className="
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  text-slate-500
                  dark:border-[#1e3354]
                  dark:text-slate-400
                "
              >
                <Loader2 className="size-4 animate-spin" />

                Chargement des voix...
              </div>
            ) : voicesQuery.isError ? (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                  dark:border-red-900/50
                  dark:bg-red-950/20
                  dark:text-red-400
                "
              >
                Impossible de charger les voix.
              </div>
            ) : voices.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  px-4
                  py-3
                  text-sm
                  text-amber-700
                  dark:border-amber-900/50
                  dark:bg-amber-950/20
                  dark:text-amber-400
                "
              >
                Aucune voix active n&apos;est
                disponible.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {voices.map((voice) => {
                  const selected =
                    voiceId === voice.id;

                  return (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => {
                        setVoiceId(voice.id);
                        setErrorMessage(null);
                      }}
                      className={`
                        relative
                        rounded-xl
                        border
                        p-4
                        text-left
                        transition-all

                        ${
                          selected
                            ? `
                              border-cyan-500
                              bg-cyan-50
                              ring-2
                              ring-cyan-500/20
                              dark:border-cyan-400
                              dark:bg-cyan-950/30
                            `
                            : `
                              border-slate-200
                              bg-white
                              hover:border-cyan-300
                              hover:bg-slate-50
                              dark:border-[#1e3354]
                              dark:bg-[#071a33]
                              dark:hover:border-cyan-700
                              dark:hover:bg-[#0e1f38]
                            `
                        }
                      `}
                    >
                      {selected && (
                        <div
                          className="
                            absolute
                            right-3
                            top-3
                            flex
                            size-5
                            items-center
                            justify-center
                            rounded-full
                            bg-cyan-600
                            text-white
                            dark:bg-cyan-400
                            dark:text-slate-950
                          "
                        >
                          <Check className="size-3.5" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div
                          className={`
                            flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg

                            ${
                              selected
                                ? "bg-cyan-100 dark:bg-cyan-900/50"
                                : "bg-slate-100 dark:bg-slate-800"
                            }
                          `}
                        >
                          <AudioLines
                            className={`
                              size-5

                              ${
                                selected
                                  ? "text-cyan-600 dark:text-cyan-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }
                            `}
                          />
                        </div>

                        <div className="min-w-0 pr-5">
                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-slate-900
                              dark:text-slate-100
                            "
                          >
                            {voice.name}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                              dark:text-slate-400
                            "
                          >
                            {voice.language}

                            {voice.gender
                              ? ` • ${voice.gender}`
                              : ""}
                          </p>

                          {voice.description && (
                            <p
                              className="
                                mt-2
                                line-clamp-2
                                text-xs
                                leading-5
                                text-slate-400
                                dark:text-slate-500
                              "
                            >
                              {voice.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instruction */}

          <div>
            <label
              htmlFor="generation-prompt"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Instruction audio
            </label>

            <textarea
              id="generation-prompt"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setErrorMessage(null);
              }}
              rows={5}
              placeholder="Indiquez comment le texte doit être interprété..."
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                text-slate-900
                outline-none

                placeholder:text-slate-400

                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20

                dark:border-[#1e3354]
                dark:bg-[#071a33]
                dark:text-slate-100
                dark:placeholder:text-slate-500
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-slate-400
                dark:text-slate-500
              "
            >
              Le contenu du document sera utilisé
              comme source de la narration.
            </p>
          </div>

          {/* Provider */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Fournisseur
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
                p-4
                dark:border-sky-900/40
                dark:bg-sky-950/20
              "
            >
              <div
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  dark:bg-[#0b1830]
                "
              >
                <Sparkles
                  className="
                    size-4
                    text-sky-600
                    dark:text-sky-400
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  OpenAI
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Génération audio avec OpenAI
                </p>
              </div>
            </div>
          </div>

          {/* Erreur */}

          {errorMessage && (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700

                dark:border-red-900/50
                dark:bg-red-950/20
                dark:text-red-400
              "
            >
              {errorMessage}
            </div>
          )}
        </div>

        {/* ===================================
            ACTIONS
            =================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-slate-100
            p-5
            dark:border-[#1e3354]
            sm:flex-row
            sm:justify-end
            sm:p-6
          "
        >
          <Button
            type="button"
            variant="outline"
            asChild
            className="
              rounded-xl
              dark:border-[#244166]
              dark:bg-[#0b1830]
            "
          >
            <Link
              href={
                projectId
                  ? `/dashboard/projects/${projectId}`
                  : "/dashboard/projects"
              }
            >
              Annuler
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={
              createGeneration.isPending ||
              voicesQuery.isLoading ||
              voices.length === 0
            }
            className="
              rounded-xl
              bg-cyan-600
              text-white
              shadow-sm
              hover:bg-cyan-500
              dark:bg-cyan-500
              dark:hover:bg-cyan-400
            "
          >
            {createGeneration.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />

                Création...
              </>
            ) : (
              <>
                <AudioLines className="mr-2 size-4" />

                Générer l&apos;audio
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}