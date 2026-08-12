"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function GenerationDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const generationQuery = api.generation.getById.useQuery(
    { id },
    {
      refetchInterval: (query) => {
        const status = query.state.data?.status;

        if (
          status === "COMPLETED" ||
          status === "FAILED"
        ) {
          return false;
        }

        return 2000;
      },
    },
  );

  const generation = generationQuery.data;

  if (generationQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Chargement de la génération...
        </div>
      </div>
    );
  }

  if (generationQuery.isError || !generation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/dashboard/generations"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="size-4" />
          Retour aux générations
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <CircleAlert className="size-6 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900 dark:text-red-300">
                Génération introuvable
              </h2>

              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                Cette génération n&apos;existe pas ou vous n&apos;avez
                pas accès à celle-ci.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPending = generation.status === "PENDING";
  const isRunning = generation.status === "RUNNING";
  const isCompleted = generation.status === "COMPLETED";
  const isFailed = generation.status === "FAILED";

  const progress = generation.progress ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/generations"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="size-4" />
          Retour aux générations
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-sky-500" />

              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Génération
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {generation.title}
            </h1>
          </div>

          <StatusBadge status={generation.status} />
        </div>
      </div>

      {/* Progress */}
      {(isPending || isRunning) && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40">
              <Loader2 className="size-5 animate-spin text-sky-600 dark:text-sky-400" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Génération en cours
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {generation.currentStep ?? "Préparation..."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Progression
              </span>

              <span className="font-medium text-slate-900 dark:text-slate-100">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Failed */}
      {isFailed && (
        <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-6 shrink-0 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900 dark:text-red-300">
                La génération a échoué
              </h2>

              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {generation.error ??
                  "Une erreur est survenue pendant la génération."}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() => generationQuery.refetch()}
            >
              <RefreshCw className="mr-2 size-4" />
              Actualiser
            </Button>
          </div>
        </section>
      )}

      {/* Audio */}
      {isCompleted && generation.audioUrl && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Audio généré
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Votre génération est terminée.
              </p>
            </div>
          </div>

          <audio
            controls
            className="w-full"
            src={generation.audioUrl}
          />

          <div className="mt-5">
            <a
              href={generation.audioUrl}
              download
            >
              <Button variant="outline">
                Télécharger l&apos;audio
              </Button>
            </a>
          </div>
        </section>
      )}

      {/* Prompt */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Prompt
        </h2>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
            {generation.prompt}
          </p>
        </div>
      </section>

      {/* Result */}
      {isCompleted && generation.result && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Texte généré
          </h2>

          <div className="mt-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
              {generation.result}
            </p>
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoCard
          icon={<Clock3 className="size-4" />}
          label="Statut"
          value={generation.status}
        />

        <InfoCard
          icon={<Sparkles className="size-4" />}
          label="Provider"
          value={generation.provider}
        />
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
        <CheckCircle2 className="size-4" />
        Terminé
      </span>
    );
  }

  if (status === "RUNNING") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
        <Loader2 className="size-4 animate-spin" />
        En cours
      </span>
    );
  }

  if (status === "FAILED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
        <CircleAlert className="size-4" />
        Échec
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
      <Clock3 className="size-4" />
      En attente
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}