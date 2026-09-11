"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Headphones,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

import { VoiceProviderType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

const VOICE_PROVIDER_LABELS: Record<VoiceProviderType, string> = {
  OPENAI: "OpenAI",
  MICROSOFT: "Microsoft",
  GOOGLE: "Google Cloud",
  PIPER: "Piper",
  ELEVENLABS: "ElevenLabs",
  MINIMAX: "MiniMax",
  EDGE_TTS: "Edge TTS",
};

const VOICE_PROVIDER_DESCRIPTIONS: Record<VoiceProviderType, string> = {
  OPENAI: "Voix OpenAI TTS",
  MICROSOFT: "Voix Microsoft Azure",
  GOOGLE: "Voix Google Cloud",
  PIPER: "Synthèse locale et rapide",
  ELEVENLABS: "Voix premium ElevenLabs",
  MINIMAX: "Voix MiniMax",
  EDGE_TTS: "Synthèse vocale Microsoft",
};

export default function NewGenerationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // =========================================================
  // PROJECT ID
  // =========================================================

  const projectId =
    searchParams.get("projectId") ??
    (params.projectId as string | undefined) ??
    "";

  // =========================================================
  // INITIAL DOCUMENT
  // =========================================================

  const initialDocumentId =
    searchParams.get("documentId");

  // =========================================================
  // STATE
  // =========================================================

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<string | null>(
      initialDocumentId,
    );

  const [documentModalOpen, setDocumentModalOpen] =
    useState(
      !initialDocumentId,
    );

  const [documentSearch, setDocumentSearch] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [providerVoice, setProviderVoice] =
    useState<VoiceProviderType>(
      VoiceProviderType.EDGE_TTS,
    );

  const [providerModalOpen, setProviderModalOpen] =
    useState(false);

  const [voiceId, setVoiceId] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  // =========================================================
  // PROJECT
  // =========================================================

  const projectQuery =
    api.project.get.useQuery(
      {
        projectId,
      },
      {
        enabled: Boolean(projectId),
      },
    );

  // =========================================================
  // DOCUMENTS
  // =========================================================

  const documentsQuery =
    api.document.getAll.useQuery(
      {
        projectId,
      },
      {
        enabled: Boolean(projectId),
      },
    );

  // =========================================================
  // VOICES
  // =========================================================

  const voicesQuery =
    api.voice.getByProvider.useQuery(
      {
        provider: providerVoice,
      },
      {
        enabled: Boolean(providerVoice),
      },
    );

  // =========================================================
  // CREATE GENERATION
  // =========================================================

  const createGeneration =
    api.generation.create.useMutation({
      onSuccess: (generation) => {
        router.push(
          `/dashboard/projects/${projectId}/generations/${generation.id}`,
        );
      },

      onError: (error) => {
        setErrorMessage(
          error.message ||
            "Impossible de créer la génération.",
        );
      },
    });

  // =========================================================
  // DATA
  // =========================================================

  const project =
    projectQuery.data;

  const documents =
    documentsQuery.data ?? [];

  const voices =
    voicesQuery.data ?? [];

  // =========================================================
  // SELECTED DOCUMENT
  // =========================================================

  const selectedDocument =
    documents.find(
      (document) =>
        document.id ===
        selectedDocumentId,
    ) ?? null;

  // =========================================================
  // FILTER DOCUMENTS
  // =========================================================

  const filteredDocuments =
    useMemo(() => {
      const value =
        documentSearch
          .trim()
          .toLowerCase();

      if (!value) {
        return documents;
      }

      return documents.filter(
        (document) => {
          const title =
            document.title
              ?.toLowerCase() ?? "";

          const content =
            document.content
              ?.toLowerCase() ?? "";

          return (
            title.includes(value) ||
            content.includes(value)
          );
        },
      );
    }, [
      documents,
      documentSearch,
    ]);

  // =========================================================
  // SELECT DOCUMENT
  // =========================================================

  function handleSelectDocument(
    documentId: string,
  ) {
    const document =
      documents.find(
        (item) =>
          item.id === documentId,
      );

    if (!document) {
      return;
    }

    setSelectedDocumentId(
      document.id,
    );

    if (!title.trim()) {
      setTitle(
        document.title,
      );
    }

    setDocumentModalOpen(
      false,
    );

    setDocumentSearch("");

    setErrorMessage(null);
  }

  // =========================================================
  // OPEN DOCUMENT MODAL
  // =========================================================

  function openDocumentSelector() {
    setDocumentSearch("");

    setDocumentModalOpen(true);
  }

  // =========================================================
  // CREATE DOCUMENT
  // =========================================================

  function handleCreateDocument() {
    router.push(
      `/dashboard/projects/${projectId}/documents/new`,
    );
  }

  // =========================================================
  // GENERATE
  // =========================================================

  async function handleGenerate() {
    setErrorMessage(null);

    // -------------------------------------------------------
    // DOCUMENT
    // -------------------------------------------------------

    if (!selectedDocument) {
      setErrorMessage(
        "Veuillez sélectionner un document.",
      );

      setDocumentModalOpen(true);

      return;
    }

    // -------------------------------------------------------
    // CONTENT
    // -------------------------------------------------------

    if (
      !selectedDocument.content?.trim()
    ) {
      setErrorMessage(
        "Le document sélectionné ne contient aucun texte.",
      );

      return;
    }

    // -------------------------------------------------------
    // VOICE
    // -------------------------------------------------------

    if (!voiceId) {
      setErrorMessage(
        "Veuillez sélectionner une voix.",
      );

      return;
    }

    // -------------------------------------------------------
    // TITLE
    // -------------------------------------------------------

    const generationTitle =
      title.trim() ||
      selectedDocument.title;

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------

    await createGeneration.mutateAsync(
      {
        title:
          generationTitle,

        prompt:
          selectedDocument.content,

        providerVoice,

        documentId:
          selectedDocument.id,

        voiceId,
      },
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (
    projectQuery.isLoading ||
    documentsQuery.isLoading
  ) {
    return (
      <LoadingPage />
    );
  }

  // =========================================================
  // PROJECT ERROR
  // =========================================================

  if (
    projectQuery.isError ||
    !project
  ) {
    return (
      <div
        className="
          min-h-screen
          px-4
          py-10
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[420px]
            max-w-md
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-red-200
            p-8
            text-center
            shadow-sm
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
            "
          >
            <FileText
              className="
                size-7
                text-red-500
              "
            />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-semibold
              text-slate-900
            "
          >
            Projet introuvable
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Ce projet n&apos;existe pas ou
            vous n&apos;avez pas accès à
            celui-ci.
          </p>

          <Button
            asChild
            className="
              mt-6
              rounded-xl
            "
          >
            <Link
              href="/dashboard/projects"
            >
              <ArrowLeft className="mr-2 size-4" />

              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        text-slate-900
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        {/* ===================================================
            BACK
        =================================================== */}

        <Link
          href={`/dashboard/projects/${projectId}`}
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition-colors
            hover:text-slate-900
          "
        >
          <ArrowLeft className="size-4" />

          Retour au projet
        </Link>

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="mb-8">
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-sky-50
              "
            >
              <Sparkles
                className="
                  size-6
                  text-sky-600
                "
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-medium
                  text-sky-600
                "
              >
                {project.name}
              </p>

              <h1
                className="
                  mt-0.5
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  sm:text-3xl
                "
              >
                Nouvelle génération audio
              </h1>
            </div>
          </div>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Sélectionnez un document,
            choisissez une voix et lancez
            votre génération audio.
          </p>
        </header>

        {/* ===================================================
            ERROR
        =================================================== */}

        {errorMessage && (
          <div
            className="
              mb-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-4
              text-sm
              text-red-700
            "
          >
            <div
              className="
                mt-0.5
                size-2
                shrink-0
                rounded-full
                bg-red-500
              "
            />

            <p>
              {errorMessage}
            </p>
          </div>
        )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="space-y-5">
          {/* =================================================
              STEP 1 — DOCUMENT
          ================================================= */}

          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-slate-50/80
              shadow-sm
            "
          >
            <div className="p-6 sm:p-7">
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
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <StepNumber number="1" />

                  <div>
                    <h2
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      Choisir un document
                    </h2>

                    <p
                      className="
                        mt-0.5
                        text-sm
                        text-slate-500
                      "
                    >
                      Le contenu sera utilisé
                      pour générer l&apos;audio.
                    </p>
                  </div>
                </div>

                {selectedDocument && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      openDocumentSelector
                    }
                    className="
                      rounded-xl
                    "
                  >
                    Changer
                  </Button>
                )}
              </div>

              {selectedDocument ? (
                <SelectedDocumentCard
                  title={
                    selectedDocument.title
                  }
                  content={
                    selectedDocument.content
                  }
                  onChange={
                    openDocumentSelector
                  }
                />
              ) : (
                <button
                  type="button"
                  onClick={
                    openDocumentSelector
                  }
                  className="
                    mt-6
                    flex
                    min-h-[190px]
                    w-full
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    px-6
                    text-center
                    transition-all
                    hover:border-sky-400
                    hover:bg-sky-50
                  "
                >
                  <div
                    className="
                      flex
                      size-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      shadow-sm
                    "
                  >
                    <FileText
                      className="
                        size-6
                        text-slate-400
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Sélectionner un document
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    Choisissez un document
                    existant dans ce projet
                  </p>
                </button>
              )}
            </div>
          </section>

          {/* =================================================
              STEP 2 — TITLE
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              
              p-6
              shadow-sm
              sm:p-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <StepNumber number="2" />

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Nom de la génération
                </h2>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Donnez un nom à votre audio.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder={
                  selectedDocument?.title ??
                  "Ex : Chapitre 1 - Henri"
                }
                className="
                  h-12
                  rounded-xl
                  border-slate-200
                  bg-slate-50
                "
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                Si vous laissez ce champ
                vide, le titre du document
                sera utilisé.
              </p>
            </div>
          </section>

          {/* =================================================
              STEP 3 — PROVIDER
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-slate-50/80
              p-6
              shadow-sm
              sm:p-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <StepNumber number="3" />

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Fournisseur vocal
                </h2>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Choisissez le moteur de
                  synthèse vocale.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setProviderModalOpen(true);
                  setErrorMessage(null);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-sky-200
                  bg-sky-50
                  p-4
                  text-left
                  transition-all
                  hover:border-sky-300
                  hover:bg-sky-100/80
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      size-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-sky-100
                      text-sky-600
                    "
                  >
                    <Volume2 className="size-5" />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                      "
                    >
                      {VOICE_PROVIDER_LABELS[providerVoice]}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      Synthèse vocale Microsoft
                    </p>
                  </div>
                </div>

                <ChevronRight className="size-5 text-slate-400" />
              </button>
            </div>
          </section>

          {/* =================================================
              STEP 4 — VOICE
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-slate-50/80
              p-6
              shadow-sm
              sm:p-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <StepNumber number="4" />

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Choisir une voix
                </h2>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Sélectionnez la voix qui
                  sera utilisée pour votre
                  audio.
                </p>
              </div>
            </div>

            {voicesQuery.isLoading ? (
              <div
                className="
                  mt-5
                  flex
                  min-h-[120px]
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-50
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-slate-500
                  "
                >
                  <Loader2
                    className="
                      size-5
                      animate-spin
                    "
                  />

                  Chargement des voix...
                </div>
              </div>
            ) : voicesQuery.isError ? (
              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-red-50
                  p-4
                  text-sm
                  text-red-700
                "
              >
                Impossible de charger les
                voix.
              </div>
            ) : voices.length === 0 ? (
              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  p-8
                  text-center
                "
              >
                <Volume2
                  className="
                    mx-auto
                    size-7
                    text-slate-300
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  Aucune voix disponible
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Aucun enregistrement
                  n&apos;est disponible pour
                  ce fournisseur.
                </p>
              </div>
            ) : (
              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                {voices.map(
                  (voice) => {
                    const selected =
                      voice.id ===
                      voiceId;

                    return (
                      <button
                        key={
                          voice.id
                        }
                        type="button"
                        onClick={() => {
                          setVoiceId(
                            voice.id,
                          );

                          setErrorMessage(
                            null,
                          );
                        }}
                        className={`
                          group
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          border
                          p-4
                          text-left
                          transition-all
                          ${
                            selected
                              ? `
                                border-sky-500
                                bg-sky-50
                                ring-2
                                ring-sky-100
                              `
                              : `
                                border-slate-200
                                bg-white
                                hover:border-sky-300
                                hover:bg-slate-50
                              `
                          }
                        `}
                      >
                        <div
                          className={`
                            flex
                            size-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            ${
                              selected
                                ? "bg-sky-600 text-white"
                                : "bg-sky-50 text-sky-600"
                            }
                          `}
                        >
                          <Headphones
                            className="size-5"
                          />
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-slate-900
                            "
                          >
                            {voice.name}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {formatLanguage(
                              voice.language,
                            )}

                            {voice.gender
                              ? ` · ${voice.gender}`
                              : ""}
                          </p>

                          {voice.providerVoiceId && (
                            <p
                              className="
                                mt-1
                                truncate
                                text-[11px]
                                text-slate-400
                              "
                            >
                              {
                                voice.providerVoiceId
                              }
                            </p>
                          )}
                        </div>

                        {selected && (
                          <div
                            className="
                              flex
                              size-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-sky-600
                              text-white
                            "
                          >
                            <Check className="size-4" />
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-sky-100
              bg-sky-50/60
              p-6
              sm:p-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  shadow-sm
                "
              >
                <Sparkles
                  className="
                    size-5
                    text-sky-600
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  Résumé
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Vérifiez votre configuration
                  avant de lancer la génération.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <SummaryItem
                icon={
                  <FileText className="size-4" />
                }
                label="Document"
                value={
                  selectedDocument?.title ??
                  "Non sélectionné"
                }
              />

              <SummaryItem
                icon={
                  <Headphones className="size-4" />
                }
                label="Voix"
                value={
                  voices.find(
                    (voice) =>
                      voice.id ===
                      voiceId,
                  )?.name ??
                  "Non sélectionnée"
                }
              />

              <SummaryItem
                icon={
                  <Volume2 className="size-4" />
                }
                label="Provider"
                value={
                  providerVoice
                }
              />
            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              pt-2
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              type="button"
              variant="outline"
              disabled={
                createGeneration.isPending
              }
              onClick={() =>
                router.push(
                  `/dashboard/projects/${projectId}`,
                )
              }
              className="
                h-12
                rounded-xl
                px-6
              "
            >
              Annuler
            </Button>

            <Button
              type="button"
              disabled={
                createGeneration.isPending ||
                !selectedDocument?.content?.trim() ||
                !voiceId
              }
              onClick={() =>
                void handleGenerate()
              }
              className="
                h-12
                rounded-xl
                bg-sky-600
                px-7
                shadow-sm
                shadow-sky-600/20
                hover:bg-sky-700
              "
            >
              {createGeneration.isPending ? (
                <>
                  <Loader2
                    className="
                      mr-2
                      size-4
                      animate-spin
                    "
                  />

                  Création de la génération...
                </>
              ) : (
                <>
                  <Sparkles
                    className="
                      mr-2
                      size-4
                    "
                  />

                  Générer l&apos;audio
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* =====================================================
          DOCUMENT MODAL
      ===================================================== */}

      {documentModalOpen && (
        <DocumentSelectorModal
          documents={
            filteredDocuments
          }
          search={
            documentSearch
          }
          selectedDocumentId={
            selectedDocumentId
          }
          onSearchChange={
            setDocumentSearch
          }
          onSelect={
            handleSelectDocument
          }
          onClose={() =>
            router.push(
              `/dashboard/projects/${projectId}`,
            )
          }
          onCreateDocument={
            handleCreateDocument
          }
        />
      )}

      {providerModalOpen && (
        <ProviderSelectorModal
          selectedProvider={providerVoice}
          onClose={() => setProviderModalOpen(false)}
          onSelect={(nextProvider) => {
            setProviderVoice(nextProvider);
            setVoiceId("");
            setErrorMessage(null);
            setProviderModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// =========================================================
// LOADING PAGE
// =========================================================

function LoadingPage() {
  return (
    <div
      className="
        flex
        min-h-screen
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
        "
      >
        <Loader2
          className="
            size-5
            animate-spin
          "
        />

        Chargement...
      </div>
    </div>
  );
}

// =========================================================
// STEP NUMBER
// =========================================================

function StepNumber({
  number,
}: {
  number: string;
}) {
  return (
    <div
      className="
        flex
        size-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-sky-50
        text-sm
        font-bold
        text-sky-600
      "
    >
      {number}
    </div>
  );
}

// =========================================================
// SELECTED DOCUMENT
// =========================================================

function SelectedDocumentCard({
  title,
  content,
  onChange,
}: {
  title: string;
  content: string | null;
  onChange: () => void;
}) {
  return (
    <div
      className="
        mt-6
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-slate-200
          px-5
          py-4
        "
      >
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
              rounded-xl
              bg-sky-100
            "
          >
            <FileText
              className="
                size-5
                text-sky-600
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
              "
            >
              {title}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-400
              "
            >
              {content?.length ?? 0}{" "}
              caractères
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="
            shrink-0
            text-xs
            font-semibold
            text-sky-600
            hover:text-sky-700
          "
        >
          Modifier
        </button>
      </div>

      <div
        className="
          max-h-56
          overflow-y-auto
          bg-white
          p-5
        "
      >
        <p
          className="
            whitespace-pre-wrap
            break-words
            text-sm
            leading-7
            text-slate-600
          "
        >
          {content  ?? "Aucun contenu."}
        </p>
      </div>
    </div>
  );
}

// =========================================================
// SUMMARY ITEM
// =========================================================

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-sky-100
        bg-slate-50
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          text-slate-400
        "
      >
        {icon}

        {label}
      </div>

      <p
        className="
          mt-2
          truncate
          text-sm
          font-semibold
          text-slate-800
        "
      >
        {value}
      </p>
    </div>
  );
}

// =========================================================
// DOCUMENT SELECTOR MODAL
// =========================================================

function ProviderSelectorModal({
  selectedProvider,
  onClose,
  onSelect,
}: {
  selectedProvider: VoiceProviderType;
  onClose: () => void;
  onSelect: (provider: VoiceProviderType) => void;
}) {
  const providers = Object.values(VoiceProviderType);

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-6
            py-5
          "
        >
          <div>
            <h2
              className="
                font-semibold
                text-slate-900
              "
            >
              Fournisseur vocal
            </h2>

            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Choisissez le moteur de synthèse.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-xl
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto p-6">
          {providers.map((provider) => {
            const selected = provider === selectedProvider;

            return (
              <button
                key={provider}
                type="button"
                onClick={() => onSelect(provider)}
                className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  p-4
                  text-left
                  transition-all
                  ${
                    selected
                      ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
                      : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      selected
                        ? "bg-sky-600 text-white"
                        : "bg-sky-50 text-sky-600"
                    }
                  `}
                >
                  <Volume2 className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {VOICE_PROVIDER_LABELS[provider]}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {VOICE_PROVIDER_DESCRIPTIONS[provider]}
                  </p>
                </div>

                {selected && (
                  <CheckCircle2 className="size-5 shrink-0 text-sky-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DocumentSelectorModal({
  documents,
  search,
  selectedDocumentId,
  onSearchChange,
  onSelect,
  onClose,
  onCreateDocument,
}: {
  documents: Array<{
    id: string;
    title: string;
    content: string | null;
  }>;

  search: string;

  selectedDocumentId:
    | string
    | null;

  onSearchChange: (
    value: string,
  ) => void;

  onSelect: (
    documentId: string,
  ) => void;

  onClose: () => void;

  onCreateDocument: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-11
                items-center
                justify-center
                rounded-xl
                bg-sky-50
              "
            >
              <FileText
                className="
                  size-5
                  text-sky-600
                "
              />
            </div>

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900
                "
              >
                Choisir un document
              </h2>

              <p
                className="
                  mt-0.5
                  text-sm
                  text-slate-500
                "
              >
                Sélectionnez le document à
                transformer en audio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-xl
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* SEARCH */}

        <div className="px-6 pt-5">
          <div className="relative">
            <Search
              className="
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <Input
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              placeholder="Rechercher un document..."
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-slate-50
                pl-10
              "
              autoFocus
            />
          </div>
        </div>

        {/* DOCUMENTS */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-6
            py-5
          "
        >
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map(
                (document) => {
                  const selected =
                    document.id ===
                    selectedDocumentId;

                  return (
                    <button
                      key={
                        document.id
                      }
                      type="button"
                      onClick={() =>
                        onSelect(
                          document.id,
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all
                        ${
                          selected
                            ? `
                              border-sky-500
                              bg-sky-50
                              ring-1
                              ring-sky-100
                            `
                            : `
                              border-slate-200
                              hover:border-sky-300
                              hover:bg-slate-50
                            `
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          size-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            selected
                              ? "bg-violet-100"
                              : "bg-sky-50"
                          }
                        `}
                      >
                        <FileText
                          className={`
                            size-5
                            ${
                              selected
                                ? "text-sky-600"
                                : "text-sky-600"
                            }
                          `}
                        />
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                          "
                        >
                          {
                            document.title
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {
                            document.content
                              ?.length
                          }{" "}
                          caractères
                        </p>

                        {document.content && (
                          <p
                            className="
                              mt-1
                              line-clamp-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {document.content
                              .replace(
                                /\s+/g,
                                " ",
                              )
                              .trim()}
                          </p>
                        )}
                      </div>

                      {selected ? (
                        <div
                          className="
                            flex
                            size-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-violet-600
                            text-white
                          "
                        >
                          <Check className="size-4" />
                        </div>
                      ) : (
                        <ChevronRight
                          className="
                            size-5
                            shrink-0
                            text-slate-300
                          "
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-[250px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <FileText
                  className="
                    size-7
                    text-slate-400
                  "
                />
              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Aucun document trouvé
              </h3>

              <p
                className="
                  mt-1
                  max-w-xs
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                Aucun document ne
                correspond à votre
                recherche.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            border-slate-100
            bg-slate-50
            px-6
            py-4
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={
              onCreateDocument
            }
            className="
              h-11
              w-full
              rounded-xl
              border-sky-200
              bg-sky-50
              text-sky-700
              hover:bg-sky-100
            "
          >
            <Plus className="mr-2 size-4" />

            Créer un nouveau document
          </Button>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// LANGUAGE
// =========================================================

function formatLanguage(
  language: string,
) {
  const languages: Record<
    string,
    string
  > = {
    fr: "Français",

    "fr-FR":
      "Français (fr-FR)",

    en: "English",

    "en-US":
      "English (en-US)",

    "en-GB":
      "English (en-GB)",

    es: "Español",

    de: "Deutsch",

    it: "Italiano",

    ja: "日本語",

    ko: "한국어",

    zh: "中文",

    "zh-CN":
      "中文 (zh-CN)",
  };

  return (
    languages[language] ??
    language
  );
}