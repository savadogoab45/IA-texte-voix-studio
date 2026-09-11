"use client";

import { useMemo, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Italic,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Mic2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Underline,
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

  const projectId =
    (params.id as string | undefined) ?? searchParams.get("projectId") ?? "";

  const initialDocumentId = searchParams.get("documentId");

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    initialDocumentId,
  );
  const [editablePrompt, setEditablePrompt] = useState("");
  const [promptDocumentId, setPromptDocumentId] = useState<string | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(!initialDocumentId);
  const [documentSearch, setDocumentSearch] = useState("");
  const [title, setTitle] = useState("");
  const [providerVoice, setProviderVoice] = useState<VoiceProviderType>(
    VoiceProviderType.EDGE_TTS,
  );
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const projectQuery = api.project.get.useQuery(
    { projectId },
    { enabled: Boolean(projectId) },
  );

  const documentsQuery = api.document.getAll.useQuery(
    { projectId },
    { enabled: Boolean(projectId) },
  );

  const voicesQuery = api.voice.getByProvider.useQuery(
    { provider: providerVoice },
    { enabled: Boolean(providerVoice) },
  );

  const createGeneration = api.generation.create.useMutation({
    onSuccess: (generation) => {
      router.push(`/dashboard/projects/${projectId}/generations/${generation.id}`);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Impossible de créer la génération.");
    },
  });

  const project = projectQuery.data;
  const documents = useMemo(
    () => documentsQuery.data ?? [],
    [documentsQuery.data],
  );
  const voices = useMemo(
    () => voicesQuery.data ?? [],
    [voicesQuery.data],
  );

  const selectedDocument =
    documents.find((document) => document.id === selectedDocumentId) ?? null;

  const selectedVoice = voices.find((voice) => voice.id === voiceId) ?? null;

  useEffect(() => {
    previewAudioRef.current?.pause();
    previewAudioRef.current = null;
    window.speechSynthesis.cancel();
    setIsPreviewPlaying(false);
  }, [voiceId, providerVoice]);

  function toggleVoicePreview() {
    if (!selectedVoice) return;

    if (selectedVoice.previewUrl) {
      const audio = previewAudioRef.current ?? new Audio(selectedVoice.previewUrl);
      previewAudioRef.current = audio;

      if (audio.paused) {
        void audio.play().then(() => setIsPreviewPlaying(true)).catch(() => {
          setErrorMessage("Impossible de lire l'extrait de cette voix.");
        });
        audio.onended = () => setIsPreviewPlaying(false);
      } else {
        audio.pause();
        setIsPreviewPlaying(false);
      }
      return;
    }

    if (isPreviewPlaying) {
      window.speechSynthesis.cancel();
      setIsPreviewPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "Bonjour, ceci est un extrait de préécoute de la voix sélectionnée.",
    );
    utterance.lang = selectedVoice.language || "fr-FR";
    utterance.onend = () => setIsPreviewPlaying(false);
    utterance.onerror = () => {
      setIsPreviewPlaying(false);
      setErrorMessage("La préécoute vocale n'est pas disponible dans ce navigateur.");
    };
    window.speechSynthesis.speak(utterance);
    setIsPreviewPlaying(true);
  }

  useEffect(() => {
    if (!selectedDocument || promptDocumentId === selectedDocument.id) return;
    setEditablePrompt(selectedDocument.content ?? "");
    setPromptDocumentId(selectedDocument.id);
  }, [selectedDocument, promptDocumentId]);

  const filteredDocuments = useMemo(() => {
    const value = documentSearch.trim().toLowerCase();
    if (!value) return documents;
    return documents.filter((document) => {
      const docTitle = document.title?.toLowerCase() ?? "";
      const content = document.content?.toLowerCase() ?? "";
      return docTitle.includes(value) || content.includes(value);
    });
  }, [documents, documentSearch]);

  const wordCount = useMemo(() => {
    return editablePrompt.trim() ? editablePrompt.trim().split(/\s+/).length : 0;
  }, [editablePrompt]);

  const estimatedMinutes = Math.max(1, Math.round(wordCount / 140));

  function handleSelectDocument(documentId: string) {
    const document = documents.find((item) => item.id === documentId);
    if (!document) return;

    setSelectedDocumentId(document.id);
    setEditablePrompt(document.content ?? "");
    setPromptDocumentId(document.id);

    if (!title.trim()) setTitle(document.title);

    setDocumentModalOpen(false);
    setDocumentSearch("");
    setErrorMessage(null);
  }

  function openDocumentSelector() {
    setDocumentSearch("");
    setDocumentModalOpen(true);
  }

  function handleCreateDocument() {
    router.push(`/dashboard/projects/${projectId}/documents/new`);
  }

  function handleRestoreContent() {
    if (!selectedDocument) return;
    setEditablePrompt(selectedDocument.content ?? "");
  }

  async function handleGenerate() {
    setErrorMessage(null);

    if (!selectedDocument) {
      setErrorMessage("Veuillez sélectionner un document.");
      setDocumentModalOpen(true);
      return;
    }

    if (!editablePrompt.trim()) {
      setErrorMessage("Le document sélectionné ne contient aucun texte.");
      return;
    }

    if (!voiceId) {
      setErrorMessage("Veuillez sélectionner une voix.");
      return;
    }

    const generationTitle = title.trim() || selectedDocument.title;

    await createGeneration.mutateAsync({
      title: generationTitle,
      prompt: editablePrompt,
      providerVoice,
      documentId: selectedDocument.id,
      voiceId,
    });
  }

  if (projectQuery.isLoading || documentsQuery.isLoading) {
    return <LoadingPage />;
  }

  if (projectQuery.isError || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
        <div className="mx-auto flex min-h-[420px] max-w-md flex-col items-center justify-center rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-[#0f1533]">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
            <FileText className="size-7 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
            Projet introuvable
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Ce projet n&apos;existe pas ou vous n&apos;avez pas accès à celui-ci.
          </p>
          <Button asChild className="mt-6 rounded-xl bg-sky-600 hover:bg-sky-700">
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 size-4" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Retour au projet
        </Link>

        {/* ================= HERO ================= */}
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-blue-100/80 bg-gradient-to-br from-white via-[#f7f9ff] to-[#edf3ff] shadow-[0_18px_55px_rgba(37,99,235,0.08)] dark:border-[#1d3556] dark:from-[#0d1d36] dark:via-[#0b1830] dark:to-[#10213d]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.13),transparent_34%),radial-gradient(circle_at_55%_100%,rgba(59,130,246,0.10),transparent_38%)] dark:bg-[radial-gradient(circle_at_75%_15%,rgba(56,189,248,0.16),transparent_40%),radial-gradient(circle_at_100%_60%,rgba(37,99,235,0.16),transparent_45%)]" />

          <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur dark:border-[#294467] dark:bg-[#10213d]/80 dark:text-sky-300">
                <FileText className="size-3.5" />
                {project.name}
              </div>

              <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-[42px] dark:text-white">
                Nouvelle{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-blue-400">
                  génération audio
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-[15px] dark:text-slate-400">
                Transformez votre texte en une voix naturelle et expressive grâce à l&apos;IA.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
                <HeroCheck label="Qualité professionnelle" />
                <HeroCheck label="Voix naturelles" />
                <HeroCheck label="Génération rapide" />
              </div>
            </div>

            <div className="relative hidden shrink-0 lg:block lg:w-[420px]">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            <div className="mt-0.5 size-2 shrink-0 rounded-full bg-red-500" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {/* STEP 1 — DOCUMENT */}
            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-[#1d3556] dark:bg-[#0b1830]">
              <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <StepNumber number="1" />
                    <div>
                      <h2 className="font-semibold text-slate-900 dark:text-white">
                        Sélectionnez un document
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Choisissez le document que vous souhaitez transformer en audio.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCreateDocument}
                    className="rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-[#28527c] dark:bg-[#102d4d] dark:text-sky-300 dark:hover:bg-[#163b62]"
                  >
                    <Plus className="mr-2 size-4" />
                    Nouveau document
                  </Button>
                </div>

                {selectedDocument ? (
                  <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#294467] dark:bg-[#10213d]">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-[#163b62]">
                        <FileText className="size-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {selectedDocument.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {wordCount} mots • Document sélectionné
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={openDocumentSelector}
                      className="shrink-0 rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#294467] dark:bg-transparent dark:text-slate-200 dark:hover:bg-[#162946]"
                    >
                      <FileText className="mr-2 size-4" />
                      Changer
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openDocumentSelector}
                    className="mt-6 flex min-h-[190px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition-all hover:border-sky-400 hover:bg-sky-50 dark:border-[#294467] dark:bg-[#10213d] dark:hover:border-sky-600 dark:hover:bg-[#12304f]"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-[#162946]">
                      <FileText className="size-6 text-slate-400" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Sélectionner un document
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Choisissez un document existant dans ce projet
                    </p>
                  </button>
                )}
              </div>
            </section>

            {/* STEP 2 — CONTENT */}
            {selectedDocument && (
              <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-[#294467] dark:bg-[#10213d]">
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <StepNumber number="2" />
                      <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                          Vérifiez et modifiez le contenu
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                          Vous pouvez modifier le texte avant de lancer la génération.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRestoreContent}
                      className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#294467] dark:bg-transparent dark:text-slate-200 dark:hover:bg-[#162946]"
                    >
                      <RotateCcw className="mr-2 size-4" />
                      Restaurer le contenu original
                    </Button>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#294467] dark:bg-[#10213d]">
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-3 py-2 dark:border-[#294467]">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#162946]"
                      >
                        Paragraphe
                        <ChevronDown className="size-3.5" />
                      </button>
                      <ToolbarDivider />
                      <ToolbarIcon icon={<Bold className="size-4" />} />
                      <ToolbarIcon icon={<Italic className="size-4" />} />
                      <ToolbarIcon icon={<Underline className="size-4" />} />
                      <ToolbarDivider />
                      <ToolbarIcon icon={<List className="size-4" />} />
                      <ToolbarIcon icon={<ListOrdered className="size-4" />} />
                      <ToolbarDivider />
                      <ToolbarIcon icon={<Link2 className="size-4" />} />
                    </div>

                    <textarea
                      value={editablePrompt}
                      onChange={(event) => setEditablePrompt(event.target.value)}
                      className="min-h-56 w-full resize-y bg-white p-5 text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400 dark:bg-transparent dark:text-slate-200 dark:placeholder:text-slate-500"
                      aria-label="Contenu de la génération"
                      placeholder="Le contenu du document apparaîtra ici..."
                    />

                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-[#294467] dark:text-slate-400">
                      <span>
                        {wordCount} mots • {editablePrompt.length} caractères
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        Brouillon modifié
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* STEP 3 — VOICE */}
            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-[#1d3556] dark:bg-[#0b1830]">
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <StepNumber number="3" />
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      Choisissez une voix
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Sélectionnez un fournisseur puis une voix pour la génération.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Fournisseur
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setProviderModalOpen(true);
                        setErrorMessage(null);
                      }}
                      className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left transition-all hover:border-sky-300 dark:border-[#294467] dark:bg-[#10213d] dark:hover:border-sky-700"
                    >
                      <span className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                        <Volume2 className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                        <span className="truncate">
                          {VOICE_PROVIDER_LABELS[providerVoice]}
                        </span>
                      </span>
                      <ChevronDown className="size-4 shrink-0 text-slate-400" />
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Voix
                    </label>
                    <div className="relative">
                      <select
                        value={voiceId}
                        onChange={(event) => {
                          setVoiceId(event.target.value);
                          setErrorMessage(null);
                        }}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-9 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 dark:border-[#294467] dark:bg-[#10213d] dark:text-white dark:focus:border-sky-600"
                      >
                        <option value="" className="bg-white dark:bg-[#10213d]">
                          {voicesQuery.isLoading ? "Chargement..." : "Sélectionner une voix"}
                        </option>
                        {voices.map((voice) => (
                          <option
                            key={voice.id}
                            value={voice.id}
                            className="bg-white dark:bg-[#10213d]"
                          >
                            {voice.name}
                            {voice.gender ? ` (${voice.gender})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      disabled={!selectedVoice}
                      onClick={toggleVoicePreview}
                      className="h-12 w-full rounded-xl bg-sky-600 px-5 hover:bg-sky-700 disabled:opacity-40 sm:w-auto"
                    >
                      {isPreviewPlaying ? (
                        <Pause className="mr-2 size-4" />
                      ) : (
                        <Play className="mr-2 size-4 fill-current" />
                      )}
                      {isPreviewPlaying ? "Arrêter l'écoute" : "Écouter un extrait"}
                    </Button>
                  </div>
                </div>

                {voicesQuery.isError && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    Impossible de charger les voix.
                  </div>
                )}

                {!voicesQuery.isLoading && !voicesQuery.isError && voices.length === 0 && (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-[#294467] dark:bg-[#10213d]">
                    <Volume2 className="mx-auto size-7 text-slate-300 dark:text-slate-600" />
                    <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                      Aucune voix disponible
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Aucun enregistrement n&apos;est disponible pour ce fournisseur.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* TITLE */}
            <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-[#1d3556] dark:bg-[#0b1830] sm:p-7">
              <div className="flex items-center gap-3">
                <StepNumber number="4" />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Nom de la génération
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Donnez un nom à votre audio.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={selectedDocument?.title ?? "Ex : Chapitre 1 - Henri"}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 dark:border-[#294467] dark:bg-[#10213d] dark:text-white dark:placeholder:text-slate-500"
                />
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Si vous laissez ce champ vide, le titre du document sera utilisé.
                </p>
              </div>
            </section>
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="space-y-4 xl:sticky xl:top-6">
            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-[#1d3556] dark:bg-[#0b1830]">
              <div className="flex items-center gap-2.5 pb-4">
                <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aperçu de la génération
                </h3>
              </div>

              <div className="space-y-1">
                <PreviewItem
                  icon={<FileText className="size-4" />}
                  label="Document"
                  value={selectedDocument?.title ?? "Non sélectionné"}
                />
                <PreviewItem
                  icon={<FileText className="size-4" />}
                  label="Mots"
                  value={`${wordCount} mots`}
                />
                <PreviewItem
                  icon={<Clock3 className="size-4" />}
                  label="Durée estimée"
                  value={`≈ ${estimatedMinutes} min`}
                />
                <PreviewItem
                  icon={<Mic2 className="size-4" />}
                  label="Voix"
                  value={
                    selectedVoice
                      ? `${selectedVoice.name} (${VOICE_PROVIDER_LABELS[providerVoice]})`
                      : "Non sélectionnée"
                  }
                />
              </div>
            </section>

            <section className="rounded-[24px] border border-violet-100 bg-gradient-to-br from-white to-violet-50/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] dark:border-[#294467] dark:from-[#10213d] dark:to-[#162946]">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-[#243b63] dark:text-sky-300">
                  <Lightbulb className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Conseil du jour
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-300">
                    Des phrases claires et courtes permettent un rendu audio plus naturel et
                    agréable à écouter.
                  </p>
                  <Link
                    href="/dashboard/documents"
                    className="mt-3 inline-flex text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    Voir plus de conseils →
                  </Link>
                </div>
              </div>
            </section>

            

            <Button
              type="button"
              disabled={createGeneration.isPending || !editablePrompt.trim() || !voiceId}
              onClick={() => void handleGenerate()}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-950/20 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 dark:shadow-blue-950/40"
            >
              {createGeneration.isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Création de la génération...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-5" />
                  Créer la génération
                  <ArrowRight className="ml-2 size-5" />
                </>
              )}
            </Button>

            <p className="px-2 text-center text-xs leading-5 text-slate-500 dark:text-slate-500">
              La génération sera ajoutée à votre projet et vous pourrez la consulter une fois
              terminée.
            </p>
          </aside>
        </div>
      </div>

      {documentModalOpen && (
        <DocumentSelectorModal
          documents={filteredDocuments}
          search={documentSearch}
          selectedDocumentId={selectedDocumentId}
          onSearchChange={setDocumentSearch}
          onSelect={handleSelectDocument}
          onClose={() => setDocumentModalOpen(false)}
          onCreateDocument={handleCreateDocument}
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

function HeroCheck({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
        <Check className="size-3" />
      </span>
      {label}
    </span>
  );
}

function HeroIllustration() {
  return (
    <div className="relative flex h-[220px] items-center justify-center">
      <div className="absolute left-0 flex h-24 w-16 -rotate-6 flex-col justify-center gap-1.5 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 p-3 shadow-xl">
        <span className="h-1 w-full rounded-full bg-slate-500/60" />
        <span className="h-1 w-full rounded-full bg-slate-500/60" />
        <span className="h-1 w-3/4 rounded-full bg-slate-500/60" />
      </div>

      <ArrowRight className="mx-3 size-6 shrink-0 text-slate-400 dark:text-slate-500" />

      <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-900/30 dark:shadow-indigo-900/50">
        <Mic2 className="size-10 text-white" />
      </div>

      <div className="ml-3 flex h-10 items-end gap-[3px]">
        {[10, 22, 14, 28, 18, 24, 12].map((height, index) => (
          <span
            key={index}
            className="w-1 rounded-full bg-gradient-to-t from-sky-500 to-violet-400"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <div className="ml-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-500 shadow-lg shadow-sky-900/20 dark:shadow-sky-900/40">
        <Play className="ml-0.5 size-5 fill-current text-white" />
      </div>

      <span
        className="absolute -right-2 -top-6 hidden text-sm italic text-indigo-600/80 sm:block dark:text-indigo-200"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Des idées
        <br />
        aux voix
        <br />
        extraordinaires
      </span>
    </div>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-[#22305c]" />;
}

function ToolbarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#141c3f]"
    >
      {icon}
    </button>
  );
}

function StepNumber({ number }: { number: string }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-sm font-bold text-white">
      {number}
    </div>
  );
}

function PreviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-1 py-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-[#141c3f] dark:text-sky-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function PreviewPlayer() {
  const [playing, setPlaying] = useState(false);
  const bars = useMemo(
    () => Array.from({ length: 40 }, (_, i) => 20 + Math.round(Math.abs(Math.sin(i)) * 70)),
    [],
  );

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setPlaying((value) => !value)}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 shadow-sm hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-900/50"
        aria-label={playing ? "Pause" : "Lecture"}
      >
        {playing ? (
          <Pause className="size-4 fill-current" />
        ) : (
          <Play className="ml-0.5 size-4 fill-current" />
        )}
      </button>

      <div className="flex h-9 flex-1 items-center gap-px overflow-hidden">
        {bars.map((height, index) => (
          <span
            key={index}
            className={`w-[2px] shrink-0 rounded-full ${
              index < 10
                ? "bg-sky-500"
                : "bg-slate-200 dark:bg-[#22305c]"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <span className="shrink-0 text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
        0:00 / 0:15
      </span>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-[#0a0e27]">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <Loader2 className="size-5 animate-spin" />
        Chargement...
      </div>
    </div>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-[#22305c] dark:bg-[#0e1430]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-[#1e2a52]">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Fournisseur vocal</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Choisissez le moteur de synthèse.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#141c3f] dark:hover:text-white"
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
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100 dark:bg-sky-950/40 dark:ring-sky-900/40"
                    : "border-slate-200 hover:border-sky-300 hover:bg-slate-50 dark:border-[#22305c] dark:hover:border-sky-700 dark:hover:bg-[#141c3f]"
                }`}
              >
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-sky-600 text-white"
                      : "bg-sky-50 text-sky-600 dark:bg-[#141c3f] dark:text-sky-400"
                  }`}
                >
                  <Volume2 className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {VOICE_PROVIDER_LABELS[provider]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {VOICE_PROVIDER_DESCRIPTIONS[provider]}
                  </p>
                </div>
                {selected && (
                  <CheckCircle2 className="size-5 shrink-0 text-sky-600 dark:text-sky-400" />
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
  documents: Array<{ id: string; title: string; content: string | null }>;
  search: string;
  selectedDocumentId: string | null;
  onSearchChange: (value: string) => void;
  onSelect: (documentId: string) => void;
  onClose: () => void;
  onCreateDocument: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-[#22305c] dark:bg-[#0e1430]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-[#1e2a52]">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50">
              <FileText className="size-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Choisir un document
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Sélectionnez le document à transformer en audio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#141c3f] dark:hover:text-white"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Rechercher un document..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 dark:border-[#22305c] dark:bg-[#0b1029] dark:text-white dark:placeholder:text-slate-500"
              autoFocus
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((document) => {
                const selected = document.id === selectedDocumentId;
                return (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => onSelect(document.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      selected
                        ? "border-sky-500 bg-sky-50 ring-1 ring-sky-100 dark:bg-sky-950/30 dark:ring-sky-900/40"
                        : "border-slate-200 hover:border-sky-300 hover:bg-slate-50 dark:border-[#22305c] dark:hover:border-sky-700 dark:hover:bg-[#141c3f]"
                    }`}
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50">
                      <FileText className="size-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {document.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {document.content?.length ?? 0} caractères
                      </p>
                      {document.content && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {document.content.replace(/\s+/g, " ").trim()}
                        </p>
                      )}
                    </div>
                    {selected ? (
                      <CheckCircle2 className="size-5 shrink-0 text-sky-500 dark:text-sky-400" />
                    ) : (
                      <ChevronRight className="size-5 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#141c3f]">
                <FileText className="size-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Aucun document trouvé
              </h3>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400 dark:text-slate-500">
                Aucun document ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-[#1e2a52] dark:bg-[#0b1029]">
          <Button
            type="button"
            variant="outline"
            onClick={onCreateDocument}
            className="h-11 w-full rounded-xl border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800/60 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/40"
          >
            <Plus className="mr-2 size-4" />
            Créer un nouveau document
          </Button>
        </div>
      </div>
    </div>
  );
}