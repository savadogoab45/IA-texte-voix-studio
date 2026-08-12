"use client";

import { useState } from "react";
import { FileAudio, Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GenerationsPage() {
  const [search, setSearch] = useState("");

  return (
    <div
      className="
        relative
        mx-auto
        w-full
        max-w-7xl
        text-slate-900
        dark:text-slate-100
      "
    >
      <div className="relative z-10">

        {/* =========================================
            HEADER
            ========================================= */}
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
          <div>
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
              Générations
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
                sm:text-base
              "
            >
              Créez et gérez vos contenus générés avec l&apos;IA.
            </p>
          </div>

          <Button
            asChild
            className="
              w-full
              rounded-xl
              shadow-sm
              shadow-sky-500/10
              sm:w-auto
            "
          >
            <Link href="/dashboard/generations/new">
              <Plus className="mr-2 size-4" />
              Nouvelle génération
            </Link>
          </Button>
        </div>

        {/* =========================================
            SEARCH
            ========================================= */}
        <div className="mt-6">
          <div className="relative max-w-xl">
            <Search
              className="
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-slate-400
                dark:text-slate-500
              "
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une génération..."
              className="
                h-11
                rounded-xl
                border-slate-200
                bg-white
                pl-10
                text-slate-900
                shadow-sm
                placeholder:text-slate-400

                focus-visible:border-sky-500
                focus-visible:ring-sky-500/20

                dark:border-[#1e3354]
                dark:bg-[#071a33]
                dark:text-slate-100
                dark:placeholder:text-slate-500
                dark:focus-visible:border-sky-500
                dark:focus-visible:ring-sky-500/20
              "
            />
          </div>
        </div>

        {/* =========================================
            FILTERS
            ========================================= */}
        <div className="mt-6 flex flex-wrap gap-2">

          {/* Toutes */}
          <Button
            variant="secondary"
            className="
              rounded-lg
              bg-sky-50
              text-sky-700
              hover:bg-sky-100
              hover:text-sky-700

              dark:bg-sky-950/50
              dark:text-sky-400
              dark:hover:bg-sky-900/60
              dark:hover:text-sky-300
            "
          >
            Toutes
          </Button>

          {/* Terminées */}
          <Button
            variant="ghost"
            className="
              rounded-lg
              text-slate-600
              hover:bg-slate-100
              hover:text-slate-900

              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100
            "
          >
            Terminées
          </Button>

          {/* En cours */}
          <Button
            variant="ghost"
            className="
              rounded-lg
              text-slate-600
              hover:bg-slate-100
              hover:text-slate-900

              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100
            "
          >
            En cours
          </Button>

          {/* Échecs */}
          <Button
            variant="ghost"
            className="
              rounded-lg
              text-slate-600
              hover:bg-slate-100
              hover:text-slate-900

              dark:text-slate-400
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100
            "
          >
            Échecs
          </Button>
        </div>

        {/* =========================================
            EMPTY STATE
            ========================================= */}
        <div
          className="
            mt-8
            flex
            min-h-[420px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            px-6
            text-center
            shadow-sm

            dark:border-[#244166]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          {/* Icon */}
          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-2xl
              bg-sky-50
              shadow-sm
              shadow-sky-500/10

              dark:bg-sky-950/50
              dark:shadow-sky-500/10
            "
          >
            <FileAudio
              className="
                size-7
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          {/* Title */}
          <h3
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            Aucune génération
          </h3>

          {/* Description */}
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
            {search
              ? `Aucune génération ne correspond à « ${search} ».`
              : "Vous n'avez encore créé aucune génération. Commencez par créer votre premier contenu."}
          </p>

          {/* CTA */}
          {!search && (
            <Button
              asChild
              className="
                mt-6
                rounded-xl
                shadow-sm
                shadow-sky-500/10
              "
            >
              <Link href="/dashboard/generations/new">
                <Sparkles className="mr-2 size-4" />
                Créer ma première génération
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}