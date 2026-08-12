"use client";

import { useMemo, useState } from "react";

import {
  AudioLines,
  Check,
  Heart,
  Play,
  Search,
  Volume2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Voice = {
  id: string;
  name: string;
  language: string;
  languageCode: string;
  gender: "Femme" | "Homme";
  description: string;
  favorite: boolean;
};

const voices: Voice[] = [
  {
    id: "voice-1",
    name: "Sophie",
    language: "Français",
    languageCode: "FR",
    gender: "Femme",
    description: "Voix naturelle et chaleureuse.",
    favorite: false,
  },
  {
    id: "voice-2",
    name: "Thomas",
    language: "Français",
    languageCode: "FR",
    gender: "Homme",
    description: "Voix claire adaptée à la narration.",
    favorite: true,
  },
  {
    id: "voice-3",
    name: "Emma",
    language: "Anglais",
    languageCode: "EN",
    gender: "Femme",
    description: "Voix douce et naturelle.",
    favorite: false,
  },
  {
    id: "voice-4",
    name: "James",
    language: "Anglais",
    languageCode: "EN",
    gender: "Homme",
    description: "Voix professionnelle pour les contenus audio.",
    favorite: false,
  },
  {
    id: "voice-5",
    name: "Amina",
    language: "Français",
    languageCode: "FR",
    gender: "Femme",
    description: "Voix expressive adaptée aux histoires.",
    favorite: true,
  },
  {
    id: "voice-6",
    name: "Lucas",
    language: "Espagnol",
    languageCode: "ES",
    gender: "Homme",
    description: "Voix dynamique et expressive.",
    favorite: false,
  },
];

export default function VoicesPage() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("Toutes");
  const [gender, setGender] = useState("Tous");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    null,
  );

  const filteredVoices = useMemo(() => {
    const value = search.toLowerCase().trim();

    return voices.filter((voice) => {
      const matchesSearch =
        !value ||
        voice.name.toLowerCase().includes(value) ||
        voice.language.toLowerCase().includes(value) ||
        voice.description.toLowerCase().includes(value);

      const matchesLanguage =
        language === "Toutes" ||
        voice.language === language;

      const matchesGender =
        gender === "Tous" ||
        voice.gender === gender;

      const matchesFavorites =
        !favoritesOnly || voice.favorite;

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesGender &&
        matchesFavorites
      );
    });
  }, [search, language, gender, favoritesOnly]);

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
      {/* =========================================
          HEADER
          ========================================= */}
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
          Voix
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
          Choisissez une voix naturelle pour vos générations audio.
        </p>
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
            placeholder="Rechercher une voix..."
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
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* Language */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            "Toutes",
            "Français",
            "Anglais",
            "Espagnol",
          ].map((item) => {
            const isActive = language === item;

            return (
              <Button
                key={item}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => setLanguage(item)}
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
                {item}
              </Button>
            );
          })}
        </div>

        {/* Gender */}
        <div className="flex gap-2 overflow-x-auto">
          {["Tous", "Femme", "Homme"].map((item) => {
            const isActive = gender === item;

            return (
              <Button
                key={item}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => setGender(item)}
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
                {item}
              </Button>
            );
          })}
        </div>

        {/* Favorites */}
        <Button
          type="button"
          variant={favoritesOnly ? "secondary" : "ghost"}
          onClick={() =>
            setFavoritesOnly((value) => !value)
          }
          className={`
            w-fit
            rounded-lg

            ${
              favoritesOnly
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
          <Heart
            className="mr-2 size-4"
            fill={
              favoritesOnly
                ? "currentColor"
                : "none"
            }
          />

          Favoris
        </Button>
      </div>

      {/* =========================================
          RESULTS COUNT
          ========================================= */}
      <div className="mt-7 flex items-center justify-between">
        <p
          className="
            text-sm
            font-medium
            text-slate-600
            dark:text-slate-400
          "
        >
          {filteredVoices.length}{" "}
          {filteredVoices.length > 1
            ? "voix"
            : "voix"}
        </p>
      </div>

      {/* =========================================
          VOICE GRID
          ========================================= */}
      {filteredVoices.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredVoices.map((voice) => {
            const isSelected =
              selectedVoice === voice.id;

            return (
              <div
                key={voice.id}
                className={`
                  rounded-2xl
                  border
                  p-5
                  shadow-sm
                  transition-all

                  ${
                    isSelected
                      ? `
                        border-sky-400
                        bg-white
                        ring-2
                        ring-sky-500/10

                        dark:border-sky-500
                        dark:bg-[#0b1830]
                        dark:ring-sky-500/20
                        dark:shadow-lg
                        dark:shadow-sky-950/20
                      `
                      : `
                        border-slate-200
                        bg-white
                        hover:border-sky-200
                        hover:shadow-md

                        dark:border-[#1e3354]
                        dark:bg-[#0b1830]
                        dark:hover:border-sky-800
                        dark:hover:shadow-lg
                        dark:hover:shadow-sky-950/20
                      `
                  }
                `}
              >
                {/* =================================
                    TOP
                    ================================= */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        size-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-50

                        dark:bg-sky-950/50
                        dark:shadow-sm
                        dark:shadow-sky-950/30
                      "
                    >
                      <AudioLines
                        className="
                          size-5
                          text-sky-600
                          dark:text-sky-400
                        "
                      />
                    </div>

                    <div>
                      <h3
                        className="
                          font-semibold
                          text-slate-900
                          dark:text-slate-100
                        "
                      >
                        {voice.name}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {voice.language} · {voice.gender}
                      </p>
                    </div>
                  </div>

                  {/* Favorite */}
                  <button
                    type="button"
                    aria-label={
                      voice.favorite
                        ? `Retirer ${voice.name} des favoris`
                        : `Ajouter ${voice.name} aux favoris`
                    }
                    className="
                      rounded-lg
                      p-2
                      text-slate-400
                      transition-colors
                      hover:bg-slate-50
                      hover:text-rose-500

                      dark:text-slate-500
                      dark:hover:bg-[#10213d]
                      dark:hover:text-rose-400
                    "
                  >
                    <Heart
                      className="size-4"
                      fill={
                        voice.favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* =================================
                    DESCRIPTION
                    ================================= */}
                <p
                  className="
                    mt-4
                    text-sm
                    leading-6
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {voice.description}
                </p>

                {/* =================================
                    AUDIO PREVIEW
                    ================================= */}
                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-slate-50
                    p-3

                    dark:border
                    dark:border-[#1e3354]
                    dark:bg-[#071a33]
                  "
                >
                  {/* Play */}
                  <button
                    type="button"
                    aria-label={`Écouter ${voice.name}`}
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-sky-600
                      shadow-sm
                      transition-all
                      hover:bg-sky-50
                      hover:shadow-md

                      dark:bg-sky-950/60
                      dark:text-sky-400
                      dark:hover:bg-sky-900/70
                      dark:hover:text-sky-300
                    "
                  >
                    <Play
                      className="
                        ml-0.5
                        size-4
                        fill-current
                      "
                    />
                  </button>

                  {/* Waveform */}
                  <div className="flex flex-1 items-center gap-1">
                    {Array.from({ length: 24 }).map(
                      (_, index) => (
                        <span
                          key={index}
                          className="
                            h-3
                            w-1
                            rounded-full
                            bg-sky-200

                            dark:bg-sky-700/70
                          "
                          style={{
                            height: `${
                              8 +
                              ((index * 7) % 15)
                            }px`,
                          }}
                        />
                      ),
                    )}
                  </div>

                  {/* Volume */}
                  <Volume2
                    className="
                      size-4
                      shrink-0
                      text-slate-400
                      dark:text-slate-500
                    "
                  />
                </div>

                {/* =================================
                    SELECT
                    ================================= */}
                <Button
                  type="button"
                  onClick={() =>
                    setSelectedVoice(
                      isSelected
                        ? null
                        : voice.id,
                    )
                  }
                  variant={
                    isSelected
                      ? "secondary"
                      : "default"
                  }
                  className={`
                    mt-4
                    w-full
                    rounded-xl

                    ${
                      isSelected
                        ? `
                          bg-sky-950/60
                          text-sky-400
                          hover:bg-sky-900/70
                          hover:text-sky-300

                          dark:bg-sky-950/70
                          dark:text-sky-300
                          dark:hover:bg-sky-900/80
                        `
                        : `
                          shadow-sm
                          shadow-sky-500/10
                        `
                    }
                  `}
                >
                  {isSelected ? (
                    <>
                      <Check className="mr-2 size-4" />
                      Voix sélectionnée
                    </>
                  ) : (
                    "Sélectionner"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================
           EMPTY STATE
           ========================================= */
        <div
          className="
            mt-8
            flex
            min-h-[400px]
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
            <AudioLines
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
            Aucune voix trouvée
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
            Essayez une autre recherche ou modifiez vos filtres.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearch("");
              setLanguage("Toutes");
              setGender("Tous");
              setFavoritesOnly(false);
            }}
            className="
              mt-5
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
            "
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}