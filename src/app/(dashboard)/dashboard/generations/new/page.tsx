"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  AudioLines,
  FileText,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NewGenerationPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projectId =
    mounted
      ? searchParams.get("projectId") ?? ""
      : "";

  const documentId =
    mounted
      ? searchParams.get("documentId") ?? ""
      : "";

  const projectHref = projectId
    ? `/dashboard/projects/${projectId}`
    : "/dashboard/projects";

  const textHref =
    projectId && documentId
      ? `/dashboard/generations/new/text?projectId=${encodeURIComponent(
          projectId,
        )}&documentId=${encodeURIComponent(
          documentId,
        )}`
      : "/dashboard/generations/new/text";

  const audioHref =
    projectId && documentId
      ? `/dashboard/generations/new/audio?projectId=${encodeURIComponent(
          projectId,
        )}&documentId=${encodeURIComponent(
          documentId,
        )}`
      : "/dashboard/generations/new/audio";

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-4xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}

      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="
            -ml-2
            mb-5
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:bg-[#10213d]
            dark:hover:text-slate-100
          "
        >
          <Link href={projectHref}>
            <ArrowLeft className="mr-2 size-4" />

            Retour au projet
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-sky-50
              dark:bg-sky-950/50
            "
          >
            <Sparkles
              className="
                size-6
                text-sky-600
                dark:text-sky-400
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
              Nouvelle génération
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
                sm:text-base
              "
            >
              Choisissez ce que vous souhaitez créer
              avec l&apos;IA.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          DOCUMENT INFO
          ========================================= */}

      {documentId ? (
        <div
          className="
            mb-6
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
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
              bg-slate-100
              dark:bg-slate-800
            "
          >
            <FileText
              className="
                size-5
                text-slate-600
                dark:text-slate-300
              "
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-slate-400
                dark:text-slate-500
              "
            >
              Document sélectionné
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-sm
                font-semibold
                text-slate-900
                dark:text-slate-100
              "
            >
              Le document sera utilisé pour la
              génération.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="
            mb-6
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
          Aucun document n&apos;est actuellement
          sélectionné. Sélectionnez une génération
          depuis un document pour conserver son
          contexte.
        </div>
      )}

      {/* =========================================
          OPTIONS
          ========================================= */}

      <div className="grid gap-5 md:grid-cols-2">
        {/* =======================================
            TEXT
            ======================================= */}

        <Link
          href={textHref}
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition-all

            hover:-translate-y-0.5
            hover:border-sky-300
            hover:shadow-md

            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-sky-800
          "
        >
          <div
            className="
              flex
              size-12
              items-center
              justify-center
              rounded-xl
              bg-sky-50
              dark:bg-sky-950/40
            "
          >
            <Sparkles
              className="
                size-6
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <h2
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            Générer du texte
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            Utilisez l&apos;IA pour créer ou
            développer du contenu à partir de votre
            document et de votre instruction.
          </p>

          <div
            className="
              mt-5
              flex
              items-center
              text-sm
              font-medium
              text-sky-600
              dark:text-sky-400
            "
          >
            Commencer

            <ArrowLeft
              className="
                ml-2
                size-4
                rotate-180
                transition-transform
                group-hover:translate-x-1
              "
            />
          </div>
        </Link>

        {/* =======================================
            AUDIO
            ======================================= */}

        <Link
          href={audioHref}
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition-all

            hover:-translate-y-0.5
            hover:border-cyan-300
            hover:shadow-md

            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:border-cyan-800
          "
        >
          <div
            className="
              flex
              size-12
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

          <h2
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            Générer un audio
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            Transformez le contenu de votre document
            en une narration audio avec une voix
            sélectionnée.
          </p>

          <div
            className="
              mt-5
              flex
              items-center
              text-sm
              font-medium
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Configurer l&apos;audio

            <ArrowLeft
              className="
                ml-2
                size-4
                rotate-180
                transition-transform
                group-hover:translate-x-1
              "
            />
          </div>
        </Link>
      </div>
    </div>
  );
}