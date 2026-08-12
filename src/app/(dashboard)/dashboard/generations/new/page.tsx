"use client";

import Link from "next/link";

import {
  ArrowLeft,
  AudioLines,
  Sparkles,
} from "lucide-react";

export default function NewGenerationPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/generations"
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
          Retour aux générations
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Nouvelle génération
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Créez du contenu avec l&apos;IA et transformez-le en
          audio.
        </p>
      </div>

      {/* Generation options */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Text */}
        <Link
          href="/dashboard/generations/new/text"
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            text-left
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
            <Sparkles className="size-6 text-sky-600 dark:text-sky-400" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Générer du texte
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Utilisez l&apos;IA pour créer un texte à partir de
            votre idée ou de votre instruction.
          </p>
        </Link>

        {/* Audio */}
        <Link
          href="/dashboard/generations/new/audio"
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            text-left
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
            <AudioLines className="size-6 text-cyan-600 dark:text-cyan-400" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Générer un audio
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Transformez votre texte en voix naturelle avec
            les voix disponibles.
          </p>
        </Link>
      </div>
    </div>
  );
}