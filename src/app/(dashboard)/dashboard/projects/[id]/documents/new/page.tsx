"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Bold,
  CheckCircle2,
  Clock3,
  FilePlus,
  FileText,
  Folder,
  Italic,
  Link2,
  List,
  ListOrdered,
  Lightbulb,
  Loader2,
  Redo2,
  Type,
  Underline,
  Undo2,
  Waves,
  Headphones,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

export default function NewDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const projectQuery = api.project.get.useQuery(
    { projectId },
    { enabled: Boolean(projectId) },
  );

  const utils = api.useUtils();

  const createDocument = api.document.create.useMutation({
    onSuccess: async (document) => {
      await utils.document.getAll.invalidate({ projectId });

      router.push(
        `/dashboard/projects/${projectId}/generations/new?documentId=${document.id}`,
      );
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Impossible de créer le document.",
      );
    },
  });

  async function handleSubmit() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("Le titre est obligatoire.");
      return;
    }

    setErrorMessage(null);

    await createDocument.mutateAsync({
      projectId,
      title: trimmedTitle,
      content,
    });
  }

  function getWordCount(text: string) {
    const trimmed = text.trim();

    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\s+/).length;
  }

  function getParagraphCount(text: string) {
    const trimmed = text.trim();

    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\n{2,}/).filter((p) => p.trim().length > 0).length;
  }

  const wordCount = getWordCount(content);
  const paragraphCount = getParagraphCount(content);

  function estimateAudioDuration(words: number) {
    if (words <= 0) {
      return 0;
    }

    return Math.ceil(words / 150);
  }

  const estimatedMinutes = estimateAudioDuration(wordCount);

  if (projectQuery.isLoading) {
    return (
      <div className="min-h-full ">
        <div className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="size-5 animate-spin text-blue-500" />
            Chargement du projet...
          </div>
        </div>
      </div>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div className="min-h-full  px-4 py-8 ">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-7 text-center shadow-sm dark:border-red-900/40 dark:bg-[#0f1b33]">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
              <FilePlus className="size-6" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-red-700 dark:text-red-400">
              Projet introuvable
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Impossible de charger ce projet.
            </p>

            <Button
              asChild
              className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/dashboard/projects">
                <ArrowLeft className="mr-2 size-4" />
                Retour aux projets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full  text-slate-900  dark:text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="size-4" />
          Retour au projet
        </Link>

        {/* Hero */}
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#eef1fd] via-[#eef1fd] to-[#e8ecfb] p-8 shadow-[0_20px_60px_rgba(99,102,241,0.10)] dark:border-[#1c2b4a] dark:from-[#101b36] dark:via-[#0f1a33] dark:to-[#141f3f] lg:min-h-[300px] lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10" />
          <div className="pointer-events-none absolute bottom-[-4rem] right-[30%] size-64 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />

          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm dark:border-indigo-900/60 dark:bg-[#131f3d] dark:text-indigo-300">
              <Folder className="size-3.5" />
              Projet : {projectQuery.data.name}
            </div>

            <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl dark:text-white">
              Nouveau{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                document
              </span>
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
              Écrivez, organisez et préparez votre contenu pour le
              transformer en une expérience audio unique.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {["Écriture fluide", "Estimation automatique", "Prêt pour la génération"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-4 lg:flex">
            <div className="relative flex size-16 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-[#152344]">
              <Type className="size-7 text-indigo-500 dark:text-indigo-300" />
            </div>
            <div className="relative -ml-6 flex size-24 rotate-3 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl">
              <Headphones className="size-10 text-white" />
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <span className="mt-0.5 size-2 shrink-0 rounded-full bg-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Formulaire principal */}
          <form
            className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.05)] dark:border-[#1c2b4a] dark:bg-[#0f1b33]"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <div className="p-6 sm:p-7">
              <label
                htmlFor="document-title"
                className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                Titre du document
              </label>

              <Input
                id="document-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ex : Chapitre 1 — Introduction"
                maxLength={255}
                className="h-12 rounded-xl border-slate-200 bg-white text-base font-medium shadow-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-white"
                disabled={createDocument.isPending}
                autoFocus
              />
            </div>

            <div className="px-6 sm:px-7">
              <label className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-200">
                Contenu
              </label>

              {/* Barre d'outils (visuelle, façon maquette) */}
              <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-slate-200 bg-slate-50/70 px-3 py-2 dark:border-[#25396092] dark:bg-[#0b162c]">
                <select
                  className="mr-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none dark:border-[#25396092] dark:bg-[#0f1b33] dark:text-slate-300"
                  defaultValue="paragraphe"
                  disabled
                >
                  <option value="paragraphe">Paragraphe</option>
                </select>

                <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-[#25396092]" />

                <ToolbarIcon icon={Bold} />
                <ToolbarIcon icon={Italic} />
                <ToolbarIcon icon={Underline} />

                <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-[#25396092]" />

                <ToolbarIcon icon={List} />
                <ToolbarIcon icon={ListOrdered} />

                <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-[#25396092]" />

                <ToolbarIcon icon={Link2} />

                <div className="ml-auto flex items-center gap-1">
                  <ToolbarIcon icon={Undo2} />
                  <ToolbarIcon icon={Redo2} />
                </div>
              </div>

              <textarea
                id="document-content"
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Écrivez ou collez le contenu de votre document ici..."
                className="min-h-[420px] w-full resize-y rounded-b-xl border border-slate-200 bg-white px-5 py-5 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-slate-100"
                disabled={createDocument.isPending}
              />

              <div className="mt-3 flex flex-col gap-2 pb-6 text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span>{wordCount.toLocaleString("fr-FR")} mots</span>
                  <span>•</span>
                  <span>
                    {content.length.toLocaleString("fr-FR")} caractères
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3" />~{estimatedMinutes} min
                    d&apos;audio
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Brouillon (non enregistré)
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:flex-row sm:justify-end dark:border-[#1c2b4a] dark:bg-[#0b162c] sm:p-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-slate-200 bg-white dark:border-[#25396092] dark:bg-[#0f1b33] dark:text-slate-200"
                disabled={createDocument.isPending}
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              >
                Annuler
              </Button>

              <Button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                disabled={createDocument.isPending}
              >
                {createDocument.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-2 size-4" />
                    Créer le document
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Sidebar droite */}
          <aside className="space-y-5">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#1c2b4a] dark:bg-[#0f1b33]">
              <div className="mb-4 flex items-center gap-2">
                <Waves className="size-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold">Aperçu du contenu</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniStat icon={FileText} value={wordCount} label="Mots" />
                <MiniStat icon={Type} value={content.length} label="Caractères" />
                <MiniStat
                  icon={Clock3}
                  value={estimatedMinutes}
                  label="min Durée audio estimée"
                  suffix="min"
                />
                <MiniStat
                  icon={List}
                  value={paragraphCount}
                  label="Paragraphes"
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-indigo-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#1c2b4a] dark:bg-[#0f1b33]">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300">
                  <Lightbulb className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold">Conseil d&apos;écriture</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Des phrases claires et courtes permettent un rendu audio
                    plus naturel et agréable à écouter.
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Voir plus de conseils →
                  </button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/20">
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
                  <Headphones className="size-5" />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  Prêt pour l&apos;audio ?
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/85">
                  Une fois votre document créé, vous pourrez le transformer en
                  audio avec nos voix IA naturelles.
                </p>

                <Button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-white font-semibold text-indigo-700 hover:bg-white/90"
                  disabled={createDocument.isPending}
                  onClick={() => void handleSubmit()}
                >
                  Créer le document →
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolbarIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <button
      type="button"
      disabled
      className="flex size-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-blue-600 disabled:cursor-default dark:text-slate-400 dark:hover:bg-[#0f1b33] dark:hover:text-blue-300"
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-[#0b162c]">
      <div className="mb-1.5 flex size-6 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-[#0f1b33] dark:text-blue-300">
        <Icon className="size-3.5" />
      </div>
      <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
        {value.toLocaleString("fr-FR")}
      </p>
      <p className="mt-0.5 text-[10px] font-medium leading-tight text-slate-400 dark:text-slate-500">
        {label}
      </p>
    </div>
  );
}