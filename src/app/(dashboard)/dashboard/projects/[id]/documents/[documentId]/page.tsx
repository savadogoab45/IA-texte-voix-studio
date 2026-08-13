"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Clock3,
  FileText,
  Save,
  Sparkles,
  Trash2,
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
    <div
      className="
        mx-auto
        w-full
        max-w-6xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =====================================
          HEADER
          ===================================== */}

      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          className="
            -ml-2
            mb-4
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:bg-[#10213d]
            dark:hover:text-slate-100
          "
        >
          <Link
            href={`/dashboard/projects/${projectId}   `}
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour au projet
          </Link>
        </Button>

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
          {/* Titre */}

          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                size-11
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
                  size-5
                  text-sky-600
                  dark:text-sky-400
                "
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-slate-100
                  sm:text-2xl
                "
              >
                Modifier le document
              </h1>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-slate-400
                  dark:text-slate-500
                "
              >
                <Clock3 className="size-3.5" />

                Dernière modification :

                {new Date(
                  document.updatedAt,
                ).toLocaleString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Actions */}

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={
                deleteDocument.isPending ||
                updateDocument.isPending
              }
              className="
                rounded-xl
                border-red-200
                bg-white
                text-red-600
                hover:bg-red-50
                hover:text-red-700

                dark:border-red-900/50
                dark:bg-[#0b1830]
                dark:text-red-400
                dark:hover:bg-red-950/30
              "
            >
              <Trash2 className="mr-2 size-4" />

              Supprimer
            </Button>

            <Button
              type="button"
              onClick={() => {
                void handleSave();
              }}
              disabled={
                updateDocument.isPending ||
                deleteDocument.isPending
              }
              className="rounded-xl"
            >
              {updateDocument.isPending ? (
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

                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />

                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* =====================================
          SAVE STATUS
          ===================================== */}

      <div className="mb-4 min-h-5">
        {saveMessage === "saved" && (
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-emerald-600
              dark:text-emerald-400
            "
          >
            <Check className="size-4" />

            Modifications enregistrées
          </div>
        )}

        {saveMessage === "saving" && (
          <div
            className="
              text-xs
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            Sauvegarde des modifications...
          </div>
        )}

        {saveMessage === "error" && (
          <div
            className="
              text-xs
              font-medium
              text-red-600
              dark:text-red-400
            "
          >
            Impossible d&apos;enregistrer les
            modifications.
          </div>
        )}
      </div>

      {/* =====================================
          EDITOR
          ===================================== */}

      <div
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
        {/* Titre */}

        <div
          className="
            border-b
            border-slate-100
            p-5
            dark:border-[#1e3354]
            sm:p-6
          "
        >
          <label
            htmlFor="document-title"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Titre du document
          </label>

          <Input
            id="document-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaveMessage(null);
            }}
            placeholder="Titre du document..."
            maxLength={255}
            className="
              h-12
              rounded-xl
              border-slate-200
              bg-white
              text-base
              font-semibold
              text-slate-900
              shadow-sm

              focus-visible:border-sky-500
              focus-visible:ring-sky-500/20

              dark:border-[#1e3354]
              dark:bg-[#071a33]
              dark:text-slate-100
            "
          />

          <div
            className="
              mt-2
              text-right
              text-xs
              text-slate-400
              dark:text-slate-500
            "
          >
            {title.length}/255
          </div>
        </div>

        {/* Contenu */}

        <div className="p-5 sm:p-6">
          <label
            htmlFor="document-content"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Contenu
          </label>

          <textarea
            id="document-content"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setSaveMessage(null);
            }}
            placeholder="Commencez à écrire votre document..."
            className="
              min-h-[500px]
              w-full
              resize-y
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-4
              text-sm
              leading-7
              text-slate-800
              outline-none
              shadow-sm

              placeholder:text-slate-400

              focus:border-sky-500
              focus:ring-2
              focus:ring-sky-500/20

              dark:border-[#1e3354]
              dark:bg-[#071a33]
              dark:text-slate-100
              dark:placeholder:text-slate-500
              dark:focus:border-sky-500
              dark:focus:ring-sky-500/20
            "
          />

          <div
            className="
              mt-3
              flex
              flex-col
              gap-2
              text-xs
              text-slate-400
              dark:text-slate-500
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span>
              {content.length.toLocaleString(
                "fr-FR",
              )}{" "}
              caractères
            </span>

            <span>
              Le contenu est enregistré dans votre
              projet.
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          GENERATION IA
          ===================================== */}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-sky-100
          bg-sky-50/70
          p-5

          dark:border-sky-900/40
          dark:bg-sky-950/20

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-6
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              shadow-sm

              dark:bg-[#0b1830]
            "
          >
            <Sparkles
              className="
                size-5
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <div>
            <h2
              className="
                text-sm
                font-semibold
                text-slate-900
                dark:text-slate-100
              "
            >
              Prêt à utiliser l&apos;IA ?
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Générez du contenu ou transformez
              ce document en audio.
            </p>
          </div>
        </div>

        <Button
          asChild
          className="rounded-xl"
        >
          <Link
            href={`/dashboard/generations/new?projectId=${projectId}&documentId=${documentId}`}
          >
            <Sparkles className="mr-2 size-4" />

            Générer avec l&apos;IA
          </Link>
        </Button>
      </div>
    </div>
  );
}