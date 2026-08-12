"use client";

import { api } from "@/trpc/react";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
  } = api.dashboard.getStats.useQuery();

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        text-slate-900
        dark:text-slate-100
      "
    >
      {/* =========================================
          HEADER
          ========================================= */}
      <div className="mb-8">
        <p
          className="
            mb-2
            text-sm
            font-medium
            text-sky-600
            dark:text-sky-400
          "
        >
          Bienvenue 👋
        </p>

        <h2
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-slate-100
            sm:text-3xl
          "
        >
          Votre espace de création
        </h2>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            text-slate-500
            dark:text-slate-400
            sm:text-base
          "
        >
          Créez du contenu avec l&apos;IA, générez des voix
          naturelles et gérez tous vos projets au même endroit.
        </p>
      </div>

      {/* =========================================
          STATS
          ========================================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Générations */}
        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Générations
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
              dark:text-slate-100
            "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              stats?.generations ?? 0
            )}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
              dark:text-slate-500
            "
          >
            Générations créées
          </p>
        </div>

        {/* Projets */}
        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Projets
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
              dark:text-slate-100
            "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              stats?.projects ?? 0
            )}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
              dark:text-slate-500
            "
          >
            Projets créés
          </p>
        </div>

        {/* Documents */}
        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Documents
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
              dark:text-slate-100
            "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              stats?.documents ?? 0
            )}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
              dark:text-slate-500
            "
          >
            Documents créés
          </p>
        </div>

        {/* Générations terminées */}
        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            dark:border-[#1e3354]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Générations terminées
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
              dark:text-slate-100
            "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              stats?.completedGenerations ?? 0
            )}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
              dark:text-slate-500
            "
          >
            Traitement terminé
          </p>
        </div>
      </div>

      {/* =========================================
          ERROR
          ========================================= */}
      {isError && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-600

            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          Impossible de récupérer les statistiques du Dashboard.
        </div>
      )}

      {/* =========================================
          EMPTY STATE
          ========================================= */}
      {!isLoading &&
        !isError &&
        stats?.generations === 0 &&
        stats?.projects === 0 && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-white
              p-10
              text-center

              dark:border-[#1e3354]
              dark:bg-[#0b1830]
              dark:shadow-lg
              dark:shadow-blue-950/10
            "
          >
            <h3
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-slate-100
              "
            >
              Commencez votre première génération
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Créez du texte avec l&apos;IA ou transformez
              votre contenu en audio naturel.
            </p>
          </div>
        )}
    </div>
  );
}