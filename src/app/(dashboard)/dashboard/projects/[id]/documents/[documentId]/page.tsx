"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  BarChart3,
  Check,
  Clock3,
  FileText,
  Headphones,
  Save,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.id as string;
  const documentId = params.documentId as string;

  const utils = api.useUtils();

  // =========================================
  // États locaux
  // =========================================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isInitialized, setIsInitialized] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState<"saved" | "saving" | "error" | null>(
      null,
    );

  // =========================================
  // Récupération du document
  // =========================================

  const documentQuery =
    api.document.getById.useQuery(
      {
        documentId,
      },
      {
        enabled:
          Boolean(documentId) &&
          Boolean(projectId),
      },
    );

  // =========================================
  // Mise à jour
  // =========================================

  const updateDocument =
    api.document.update.useMutation({
      onSuccess: async (updatedDocument) => {
        setTitle(updatedDocument.title);
        setContent(
          updatedDocument.content ?? "",
        );

        setSaveMessage("saved");

        await utils.document.getById.invalidate({
          documentId,
        });

        await utils.document.getAll.invalidate({
          projectId,
        });
      },

      onError: (error) => {
        console.error(
          "Erreur lors de la sauvegarde :",
          error,
        );

        setSaveMessage("error");
      },
    });

  // =========================================
  // Suppression
  // =========================================

  const deleteDocument =
    api.document.delete.useMutation({
      onSuccess: async () => {
        await utils.document.getAll.invalidate({
          projectId,
        });

        await utils.project.get.invalidate({
          projectId,
        });

        await utils.project.getAll.invalidate();

        router.push(
          `/dashboard/projects/${projectId}`,
        );
      },
    });


    // =========================================
    // Estimation de la durée audio
    // =========================================

      function getWordCount(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

const wordCount = getWordCount(content);

function estimateAudioDuration(
  words: number,
) {
  if (words <= 0) {
    return 0;
  }

  return Math.ceil(
    words / 150,
  );
}

const estimatedMinutes =
  estimateAudioDuration(wordCount);

  // =========================================
  // Initialisation des données
  // =========================================

  useEffect(() => {
    if (
      documentQuery.data &&
      !isInitialized
    ) {
      setTitle(documentQuery.data.title);

      setContent(
        documentQuery.data.content ?? "",
      );

      setIsInitialized(true);
    }
  }, [
    documentQuery.data,
    isInitialized,
  ]);

  // =========================================
  // Sauvegarde
  // =========================================

  async function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setSaveMessage("error");
      return;
    }

    setSaveMessage("saving");

    try {
      await updateDocument.mutateAsync({
        id: documentId,
        title: trimmedTitle,
        content,
      });
    } catch {
      // onError gère l'affichage
    }
  }

  // =========================================
  // Suppression
  // =========================================

  async function handleDelete() {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer « ${title} » ?`,
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
        "Erreur lors de la suppression :",
        error,
      );
    }
  }

  // =========================================
  // Chargement
  // =========================================

  if (documentQuery.isLoading) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-6xl
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

          Chargement du document...
        </div>
      </div>
    );
  }

  // =========================================
  // Erreur
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
            href={`/dashboard/projects/${projectId}`}
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
    <div className="min-h-full bg-[#f7f9ff] text-slate-950 dark:bg-[#061225] dark:text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-5">
          <Link href={`/dashboard/projects/${projectId}`} className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white hover:text-blue-600 dark:text-slate-400 dark:hover:bg-[#0b1830] dark:hover:text-blue-300">
            <ArrowLeft className="size-3.5" /> Retour au projet
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 text-indigo-600 shadow-sm dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/30 dark:text-indigo-300">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300"><Headphones className="size-3" /> Studio de contenu</div>
                <h1 className="truncate text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl">Modifier le document</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500"><Clock3 className="size-3.5" /> Dernière modification : <span>{new Date(document.updatedAt).toLocaleString("fr-FR")}</span></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleDelete} disabled={deleteDocument.isPending || updateDocument.isPending} className="rounded-xl border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50 dark:border-red-900/50 dark:bg-[#0b1830] dark:text-red-400 dark:hover:bg-red-950/30"><Trash2 className="mr-2 size-4" /> Supprimer</Button>
              <Button type="button" onClick={() => void handleSave()} disabled={updateDocument.isPending || deleteDocument.isPending} className="rounded-xl bg-blue-600 px-5 shadow-lg shadow-blue-500/20 hover:bg-blue-700">
                {updateDocument.isPending ? <><span className="mr-2 size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Sauvegarde...</> : <><Save className="mr-2 size-4" /> Enregistrer</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-4 min-h-5">
          {saveMessage === "saved" && <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"><Check className="size-3.5" /> Modifications enregistrées</div>}
          {saveMessage === "saving" && <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-[#10213d] dark:text-slate-400">Sauvegarde des modifications...</div>}
          {saveMessage === "error" && <div className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">Impossible d&apos;enregistrer les modifications.</div>}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <section className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:border-[#203554] dark:bg-[#0b1830]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/70 p-5 dark:border-[#1e3354] dark:from-[#0b1830] dark:to-[#0d1b34] sm:p-6">
              <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-300">Document</p><h2 className="mt-1 text-sm font-bold">Informations principales</h2></div><div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"><FileText className="size-4" /></div></div>
              <label htmlFor="document-title" className="mb-2 mt-5 block text-xs font-bold text-slate-600 dark:text-slate-300">Titre du document</label>
              <Input id="document-title" value={title} onChange={(event) => { setTitle(event.target.value); setSaveMessage(null); }} placeholder="Titre du document..." maxLength={255} className="h-12 rounded-xl border-slate-200 bg-white text-base font-semibold shadow-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-[#244166] dark:bg-[#071a33] dark:text-slate-100" />
              <div className="mt-2 text-right text-[11px] text-slate-400">{title.length}/255</div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between"><label htmlFor="document-content" className="text-xs font-bold text-slate-600 dark:text-slate-300">Contenu</label><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-[#10213d] dark:text-slate-400">Éditeur texte</span></div>
              <textarea id="document-content" value={content} onChange={(event) => { setContent(event.target.value); setSaveMessage(null); }} placeholder="Commencez à écrire votre document..." className="min-h-[540px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-5 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 dark:border-[#244166] dark:bg-[#071a33] dark:text-slate-100 dark:focus:bg-[#081d38]" />
              <div className="mt-3 flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>{content.length.toLocaleString("fr-FR")} caractères {estimatedMinutes > 0 && <span className="ml-3 inline-flex items-center gap-1.5"><Headphones className="size-3" /> ~{estimatedMinutes} min d&apos;audio</span>}</span><span>Le contenu est enregistré dans votre projet.</span></div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#203554] dark:bg-[#0b1830]">
              <div className="mb-4 flex items-center gap-2"><BarChart3 className="size-4 text-blue-600 dark:text-blue-400" /><h3 className="text-sm font-bold">Aperçu du document</h3></div>
              <div className="grid grid-cols-2 gap-2"><MiniStat value={wordCount} label="mots" /><MiniStat value={content.length} label="caractères" /></div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-[#071a33]"><div className="flex items-center justify-between text-[10px] font-semibold text-slate-500"><span>Durée estimée</span><span className="font-bold text-indigo-600 dark:text-indigo-300">{estimatedMinutes > 0 ? `~${estimatedMinutes} min` : "—"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#1e3354]"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" style={{ width: `${Math.min(100, Math.max(4, estimatedMinutes * 5))}%` }} /></div></div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-[#0b1830] dark:to-violet-950/30">
              <div className="absolute -right-8 -top-8 size-28 rounded-full bg-violet-300/30 blur-2xl" /><div className="relative"><div className="flex size-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-[#142341] dark:text-indigo-300"><WandSparkles className="size-5" /></div><h3 className="mt-4 text-sm font-bold">Prêt à utiliser l&apos;IA ?</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Transformez ce document en expérience audio avec une voix naturelle et expressive.</p><Link href={`/dashboard/projects/${projectId}/generations/new?documentId=${documentId}`} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"><Sparkles className="mr-2 size-3.5" /> Générer avec l&apos;IA</Link></div>
            </div>

            <div className="rounded-[24px] border border-slate-200/90 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#203554] dark:bg-[#0b1830]"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300"><Headphones className="size-4" /></div><div><h3 className="text-xs font-bold">Conseil audio</h3><p className="mt-1.5 text-[11px] leading-5 text-slate-500 dark:text-slate-400">Des paragraphes courts et une ponctuation claire donnent généralement un rendu vocal plus naturel.</p></div></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-[#071a33]">
      <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">{value.toLocaleString("fr-FR")}</p>
      <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
}
