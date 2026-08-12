"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  FileAudio,
  FileText,
  FileType,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DocumentItem = {
  id: string;
  name: string;
  type: "TXT" | "PDF" | "DOCX";
  size: string;
  updatedAt: string;
};

const documents: DocumentItem[] = [
  {
    id: "1",
    name: "Mon histoire.txt",
    type: "TXT",
    size: "24 KB",
    updatedAt: "Il y a 2 heures",
  },
  {
    id: "2",
    name: "Script podcast.pdf",
    type: "PDF",
    size: "1.2 MB",
    updatedAt: "Hier",
  },
  {
    id: "3",
    name: "Article.docx",
    type: "DOCX",
    size: "86 KB",
    updatedAt: "Il y a 3 jours",
  },
];

function getDocumentIcon(type: DocumentItem["type"]) {
  switch (type) {
    case "PDF":
      return FileType;

    case "DOCX":
      return FileText;

    default:
      return FileAudio;
  }
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const [type, setType] = useState<
    "Tous" | DocumentItem["type"]
  >("Tous");

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase().trim();

    return documents.filter((document) => {
      const matchesSearch =
        !value ||
        document.name
          .toLowerCase()
          .includes(value);

      const matchesType =
        type === "Tous" ||
        document.type === type;

      return matchesSearch && matchesType;
    });
  }, [search, type]);

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
            Documents
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
            Importez et gérez les documents utilisés
            dans vos créations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Import */}
          <Button
            type="button"
            variant="outline"
            className="
              w-full
              rounded-xl
              border-slate-200
              bg-white
              text-slate-700
              hover:bg-slate-50
              hover:text-slate-900

              dark:border-[#244166]
              dark:bg-[#0b1830]
              dark:text-slate-300
              dark:hover:bg-[#10213d]
              dark:hover:text-slate-100

              sm:w-auto
            "
          >
            <Upload className="mr-2 size-4" />
            Importer
          </Button>

          {/* New generation */}
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
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher un document..."
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
              dark:bg-[#0b1830]
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
      <div
        className="
          mt-5
          flex
          gap-2
          overflow-x-auto
          pb-1
        "
      >
        {(
          ["Tous", "TXT", "PDF", "DOCX"] as const
        ).map((item) => {
          const isActive = type === item;

          return (
            <Button
              key={item}
              type="button"
              variant={
                isActive
                  ? "secondary"
                  : "ghost"
              }
              onClick={() => setType(item)}
              className={`
                shrink-0
                rounded-lg

                ${
                  isActive
                    ? `
                      bg-sky-50
                      text-sky-700
                      hover:bg-sky-100
                      hover:text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                      dark:hover:bg-sky-900/60
                      dark:hover:text-sky-300
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100
                      hover:text-slate-900

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                      dark:hover:text-slate-100
                    `
                }
              `}
            >
              {item === "Tous"
                ? "Tous"
                : item}
            </Button>
          );
        })}
      </div>

      {/* =========================================
          DOCUMENTS
          ========================================= */}
      {filteredDocuments.length > 0 ? (
        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm

            dark:border-[#1e3354]
            dark:bg-[#0b1830]
            dark:shadow-lg
            dark:shadow-blue-950/10
          "
        >
          {/* Desktop header */}
          <div
            className="
              hidden
              grid-cols-[1fr_120px_140px_48px]
              items-center
              gap-4
              border-b
              border-slate-100
              bg-slate-50
              px-5
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-400

              dark:border-[#1e3354]
              dark:bg-[#071a33]
              dark:text-slate-500

              md:grid
            "
          >
            <span>Document</span>
            <span>Type</span>
            <span>Modifié</span>
            <span />
          </div>

          {/* Document rows */}
          <div
            className="
              divide-y
              divide-slate-100
              dark:divide-[#1e3354]
            "
          >
            {filteredDocuments.map(
              (document) => {
                const Icon =
                  getDocumentIcon(
                    document.type,
                  );

                return (
                  <div
                    key={document.id}
                    className="
                      flex
                      flex-col
                      gap-4
                      px-4
                      py-4
                      transition-colors

                      hover:bg-slate-50

                      dark:hover:bg-[#0e1f38]

                      sm:px-5

                      md:grid
                      md:grid-cols-[1fr_120px_140px_48px]
                      md:items-center
                      md:gap-4
                    "
                  >
                    {/* =========================
                        NAME
                        ========================= */}
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
                          rounded-lg
                          bg-sky-50

                          dark:bg-sky-950/50
                          dark:shadow-sm
                          dark:shadow-sky-950/20
                        "
                      >
                        <Icon
                          className="
                            size-5
                            text-sky-600
                            dark:text-sky-400
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
                            dark:text-slate-100
                          "
                        >
                          {document.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          {document.size}
                        </p>
                      </div>
                    </div>

                    {/* =========================
                        TYPE
                        ========================= */}
                    <div>
                      <span
                        className="
                          inline-flex
                          rounded-md
                          bg-slate-100
                          px-2
                          py-1
                          text-xs
                          font-medium
                          text-slate-600

                          dark:bg-[#10213d]
                          dark:text-slate-300
                        "
                      >
                        {document.type}
                      </span>
                    </div>

                    {/* =========================
                        UPDATED
                        ========================= */}
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {document.updatedAt}
                    </p>

                    {/* =========================
                        ACTIONS
                        ========================= */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="
                        size-8
                        self-end
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-100
                        hover:text-slate-700

                        dark:text-slate-500
                        dark:hover:bg-[#10213d]
                        dark:hover:text-slate-100

                        md:self-auto
                      "
                      aria-label={`Options de ${document.name}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                );
              },
            )}
          </div>
        </div>
      ) : (
        /* =========================================
           EMPTY STATE
           ========================================= */
        <div
          className="
            mt-6
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
          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-2xl
              bg-sky-50

              dark:bg-sky-950/50
              dark:shadow-lg
              dark:shadow-sky-950/20
            "
          >
            <FileText
              className="
                size-7
                text-sky-600
                dark:text-sky-400
              "
            />
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
              dark:text-slate-100
            "
          >
            {search
              ? "Aucun document trouvé"
              : "Aucun document"}
          </h3>

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
              ? `Aucun document ne correspond à « ${search} ».`
              : "Importez votre premier document pour commencer à travailler avec vos contenus."}
          </p>

          {!search && (
            <Button
              type="button"
              className="
                mt-6
                rounded-xl
                shadow-sm
                shadow-sky-500/10
              "
            >
              <Upload className="mr-2 size-4" />
              Importer un document
            </Button>
          )}
        </div>
      )}
    </div>
  );
}