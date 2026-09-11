"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AudioLines,
  Check,
  ChevronDown,
  Heart,
  Play,
  Search,
  Volume2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { api } from "@/trpc/react";

/* =========================================================
   PROVIDERS
   ========================================================= */

const providerLabels: Record<string, string> = {
  PIPER: "Piper",
  EDGE_TTS: "Edge TTS",
  GOOGLE: "Google Cloud",
  ELEVENLABS: "ElevenLabs",
  OPENAI: "OpenAI",
  MINIMAX: "MiniMax",
  MICROSOFT: "Microsoft",
};

const providerOrder = [
  "PIPER",
  "EDGE_TTS",
  "GOOGLE",
  "ELEVENLABS",
  "OPENAI",
  "MINIMAX",
  "MICROSOFT",
];

/* =========================================================
   HELPERS
   ========================================================= */

function getProviderLabel(provider: string) {
  return providerLabels[provider] ?? provider;
}

function getLanguageLabel(language: string) {
  const labels: Record<string, string> = {
    "fr-FR": "Français",
    fr: "Français",

    "en-US": "Anglais",
    "en-GB": "Anglais",
    en: "Anglais",

    "es-ES": "Espagnol",
    es: "Espagnol",

    "de-DE": "Allemand",
    de: "Allemand",

    "it-IT": "Italien",
    it: "Italien",

    "pt-BR": "Portugais",
    pt: "Portugais",

    "ar-SA": "Arabe",
    ar: "Arabe",
  };

  return labels[language] ?? language;
}

function normalizeGender(gender: string | null) {
  if (!gender) {
    return "Non précisé";
  }

  const value = gender.toLowerCase();

  if (
    value === "female" ||
    value === "femme" ||
    value === "female_voice"
  ) {
    return "Femme";
  }

  if (
    value === "male" ||
    value === "homme" ||
    value === "male_voice"
  ) {
    return "Homme";
  }

  return gender;
}

/* =========================================================
   PAGE
   ========================================================= */

export default function VoicesPage() {
  /* =======================================================
     FILTERS
     ======================================================= */

  const [search, setSearch] = useState("");

  const [language, setLanguage] =
    useState("Toutes");

  const [gender, setGender] =
    useState("Tous");

  const [provider, setProvider] =
    useState("Tous");

  const [type, setType] =
    useState("Tous");

  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  /* =======================================================
     VOICE STATE
     ======================================================= */

  const [selectedVoice, setSelectedVoice] =
    useState<string | null>(null);

  const [playingVoiceId, setPlayingVoiceId] =
    useState<string | null>(null);

  const [previewError, setPreviewError] =
    useState<string | null>(null);

  const [favorites, setFavorites] =
    useState<Set<string>>(new Set());

  /* =======================================================
     DATABASE
     ======================================================= */

  const voicesQuery =
    api.voice.getAll.useQuery();

  const voices = voicesQuery.data ?? [];

  /* =======================================================
     LANGUAGES
     ======================================================= */

  const languages = useMemo(() => {
    const unique = new Set(
      voices.map(
        (voice) => voice.language,
      ),
    );

    return Array.from(unique).sort(
      (a, b) =>
        getLanguageLabel(a).localeCompare(
          getLanguageLabel(b),
          "fr",
        ),
    );
  }, [voices]);

  /* =======================================================
     PROVIDERS
     ======================================================= */

  const providers = useMemo(() => {
    const unique = new Set(
      voices.map(
        (voice) => voice.provider,
      ),
    );

    return Array.from(unique).sort(
      (a, b) => {
        const indexA =
          providerOrder.indexOf(a);

        const indexB =
          providerOrder.indexOf(b);

        if (
          indexA === -1 &&
          indexB === -1
        ) {
          return a.localeCompare(b);
        }

        if (indexA === -1) {
          return 1;
        }

        if (indexB === -1) {
          return -1;
        }

        return indexA - indexB;
      },
    );
  }, [voices]);

  /* =======================================================
     FILTERED VOICES
     ======================================================= */

  const filteredVoices = useMemo(() => {
    const value =
      search.toLowerCase().trim();

    return voices.filter((voice) => {
      const description =
        voice.description ?? "";

      const matchesSearch =
        !value ||
        voice.name
          .toLowerCase()
          .includes(value) ||
        voice.language
          .toLowerCase()
          .includes(value) ||
        voice.provider
          .toLowerCase()
          .includes(value) ||
        voice.providerVoiceId
          .toLowerCase()
          .includes(value) ||
        description
          .toLowerCase()
          .includes(value);

      const matchesLanguage =
        language === "Toutes" ||
        voice.language === language;

      const matchesGender =
        gender === "Tous" ||
        normalizeGender(
          voice.gender,
        ) === gender;

      const matchesProvider =
        provider === "Tous" ||
        voice.provider === provider;

      const matchesType =
        type === "Tous" ||
        voice.type === type;

      const matchesFavorites =
        !favoritesOnly ||
        favorites.has(voice.id);

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesGender &&
        matchesProvider &&
        matchesType &&
        matchesFavorites
      );
    });
  }, [
    voices,
    search,
    language,
    gender,
    provider,
    type,
    favoritesOnly,
    favorites,
  ]);

  /* =======================================================
     GROUP BY PROVIDER
     ======================================================= */

  const groupedVoices = useMemo(() => {
    const groups = new Map<
      string,
      typeof filteredVoices
    >();

    for (const voice of filteredVoices) {
      const current =
        groups.get(voice.provider);

      if (current) {
        current.push(voice);
      } else {
        groups.set(voice.provider, [
          voice,
        ]);
      }
    }

    return Array.from(
      groups.entries(),
    ).sort(
      ([providerA], [providerB]) => {
        const indexA =
          providerOrder.indexOf(
            providerA,
          );

        const indexB =
          providerOrder.indexOf(
            providerB,
          );

        if (
          indexA === -1 &&
          indexB === -1
        ) {
          return providerA.localeCompare(
            providerB,
          );
        }

        if (indexA === -1) {
          return 1;
        }

        if (indexB === -1) {
          return -1;
        }

        return indexA - indexB;
      },
    );
  }, [filteredVoices]);

  /* =======================================================
     FAVORITES
     ======================================================= */

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  /* =======================================================
     PREVIEW AUDIO
     ======================================================= */

  async function handlePreviewVoice(
    voiceId: string,
  ) {
    if (playingVoiceId) {
      return;
    }

    try {
      setPreviewError(null);
      setPlayingVoiceId(voiceId);

      const response = await fetch(
        "/api/voices/preview",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            voiceId,

            text:
              "Bonjour, ceci est un aperçu de cette voix. Vous pouvez écouter sa qualité avant de l'utiliser pour votre génération audio.",
          }),
        },
      );

      if (!response.ok) {
        let message =
          "Impossible de générer l'aperçu audio.";

        try {
          const data =
            await response.json();

          if (
            typeof data?.error ===
            "string"
          ) {
            message = data.error;
          }
        } catch {
          // La réponse n'est pas forcément du JSON.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      if (!blob.size) {
        throw new Error(
          "Le fichier audio généré est vide.",
        );
      }

      const url =
        URL.createObjectURL(blob);

      const audio =
        new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPlayingVoiceId(null);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setPlayingVoiceId(null);

        setPreviewError(
          "Impossible de lire l'audio généré.",
        );
      };

      await audio.play();
    } catch (error) {
      console.error(
        "❌ Erreur preview audio:",
        error,
      );

      setPlayingVoiceId(null);

      setPreviewError(
        error instanceof Error
          ? error.message
          : "Erreur pendant la lecture.",
      );
    }
  }

  /* =======================================================
     RESET
     ======================================================= */

  function resetFilters() {
    setSearch("");
    setLanguage("Toutes");
    setGender("Tous");
    setProvider("Tous");
    setType("Tous");
    setFavoritesOnly(false);
  }

  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      setPlayingVoiceId(null);
    };
  }, []);

  /* =======================================================
     LOADING
     ======================================================= */

  if (voicesQuery.isLoading) {
    return (
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-7xl
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

          Chargement des voix...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (voicesQuery.isError) {
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
          border-red-200
          bg-red-50
          px-6
          text-center

          dark:border-red-900/50
          dark:bg-red-950/20
        "
      >
        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-2xl
            bg-red-100

            dark:bg-red-950/40
          "
        >
          <AudioLines
            className="
              size-7
              text-red-600
              dark:text-red-400
            "
          />
        </div>

        <h3
          className="
            mt-5
            text-lg
            font-semibold
            text-red-800

            dark:text-red-300
          "
        >
          Impossible de charger les voix
        </h3>

        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-6
            text-red-600

            dark:text-red-400
          "
        >
          Une erreur est survenue pendant
          la récupération des voix depuis
          la base de données.
        </p>

        <Button
          type="button"
          onClick={() =>
            voicesQuery.refetch()
          }
          className="mt-5 rounded-xl"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

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
      {/* ===================================================
          HEADER
          =================================================== */}

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
          Choisissez une voix naturelle
          pour vos générations audio.
        </p>
      </div>

      {/* ===================================================
          SEARCH
          =================================================== */}

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
              setSearch(
                event.target.value,
              )
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
            "
          />
        </div>
      </div>

      {/* ===================================================
          PROVIDER FILTER
          =================================================== */}

      {providers.length > 0 && (
        <div className="mt-6">
          <div
            className="
              mb-2
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-400

              dark:text-slate-500
            "
          >
            Fournisseur
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              type="button"
              variant={
                provider === "Tous"
                  ? "secondary"
                  : "ghost"
              }
              onClick={() =>
                setProvider("Tous")
              }
              className={`
                shrink-0
                rounded-lg

                ${
                  provider === "Tous"
                    ? `
                      bg-sky-50
                      text-sky-700
                      hover:bg-sky-100

                      dark:bg-sky-950/50
                      dark:text-sky-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              Tous
            </Button>

            {providers.map((item) => {
              const active =
                provider === item;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={
                    active
                      ? "secondary"
                      : "ghost"
                  }
                  onClick={() =>
                    setProvider(item)
                  }
                  className={`
                    shrink-0
                    rounded-lg

                    ${
                      active
                        ? `
                          bg-sky-50
                          text-sky-700

                          dark:bg-sky-950/50
                          dark:text-sky-400
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100

                          dark:text-slate-400
                          dark:hover:bg-[#10213d]
                        `
                    }
                  `}
                >
                  {getProviderLabel(item)}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================
          LANGUAGE FILTER
          =================================================== */}

      {languages.length > 0 && (
        <div className="mt-5">
          <div
            className="
              mb-2
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-400

              dark:text-slate-500
            "
          >
            Langue
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              type="button"
              variant={
                language === "Toutes"
                  ? "secondary"
                  : "ghost"
              }
              onClick={() =>
                setLanguage("Toutes")
              }
              className={`
                shrink-0
                rounded-lg

                ${
                  language === "Toutes"
                    ? `
                      bg-sky-50
                      text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              Toutes
            </Button>

            {languages.map((item) => {
              const active =
                language === item;

              return (
                <Button
                  key={item}
                  type="button"
                  variant={
                    active
                      ? "secondary"
                      : "ghost"
                  }
                  onClick={() =>
                    setLanguage(item)
                  }
                  className={`
                    shrink-0
                    rounded-lg

                    ${
                      active
                        ? `
                          bg-sky-50
                          text-sky-700

                          dark:bg-sky-950/50
                          dark:text-sky-400
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100

                          dark:text-slate-400
                          dark:hover:bg-[#10213d]
                        `
                    }
                  `}
                >
                  {getLanguageLabel(item)}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================
          OTHER FILTERS
          =================================================== */}

      <div className="mt-5 flex flex-wrap gap-2">
        {/* Gender */}

        {[
          "Tous",
          "Femme",
          "Homme",
        ].map((item) => {
          const active =
            gender === item;

          return (
            <Button
              key={item}
              type="button"
              variant={
                active
                  ? "secondary"
                  : "ghost"
              }
              onClick={() =>
                setGender(item)
              }
              className={`
                rounded-lg

                ${
                  active
                    ? `
                      bg-sky-50
                      text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              {item}
            </Button>
          );
        })}

        {/* Type */}

        {[
          "Tous",
          "FREE",
          "PREMIUM",
        ].map((item) => {
          const active =
            type === item;

          return (
            <Button
              key={item}
              type="button"
              variant={
                active
                  ? "secondary"
                  : "ghost"
              }
              onClick={() =>
                setType(item)
              }
              className={`
                rounded-lg

                ${
                  active
                    ? `
                      bg-sky-50
                      text-sky-700

                      dark:bg-sky-950/50
                      dark:text-sky-400
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100

                      dark:text-slate-400
                      dark:hover:bg-[#10213d]
                    `
                }
              `}
            >
              {item === "Tous"
                ? "Tous"
                : item === "FREE"
                  ? "Gratuit"
                  : "Premium"}
            </Button>
          );
        })}

        {/* Favorites */}

        <Button
          type="button"
          variant={
            favoritesOnly
              ? "secondary"
              : "ghost"
          }
          onClick={() =>
            setFavoritesOnly(
              (value) => !value,
            )
          }
          className={`
            rounded-lg

            ${
              favoritesOnly
                ? `
                  bg-sky-50
                  text-sky-700

                  dark:bg-sky-950/50
                  dark:text-sky-400
                `
                : `
                  text-slate-600
                  hover:bg-slate-100

                  dark:text-slate-400
                  dark:hover:bg-[#10213d]
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

      {/* ===================================================
          PREVIEW ERROR
          =================================================== */}

      {previewError && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600

            dark:border-red-900/50
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          <div className="flex items-start gap-3">
            <AudioLines className="mt-0.5 size-4 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Erreur de lecture
              </p>

              <p className="mt-1">
                {previewError}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setPreviewError(null)
              }
              className="
                text-xs
                font-medium
                underline
              "
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          RESULT COUNT
          =================================================== */}

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

        {(search ||
          language !== "Toutes" ||
          gender !== "Tous" ||
          provider !== "Tous" ||
          type !== "Tous" ||
          favoritesOnly) && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="
              rounded-lg
              text-xs
              text-slate-500

              dark:text-slate-400
            "
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* ===================================================
          EMPTY
          =================================================== */}

      {filteredVoices.length === 0 ? (
        <div
          className="
            mt-5
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

            dark:border-[#244166]
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
              bg-sky-50

              dark:bg-sky-950/50
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
            {voices.length === 0
              ? "Aucune voix disponible"
              : "Aucune voix trouvée"}
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
            {voices.length === 0
              ? "Aucune voix active n'est actuellement enregistrée dans la base de données."
              : "Essayez une autre recherche ou modifiez vos filtres."}
          </p>

          {voices.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="
                mt-5
                rounded-xl
              "
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        /* =================================================
           GROUPS
           ================================================= */

        <div className="mt-5 space-y-10">
          {groupedVoices.map(
            ([providerName, providerVoices]) => (
              <section
                key={providerName}
              >
                {/* =========================================
                    PROVIDER HEADER
                    ========================================= */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-50

                        dark:bg-sky-950/50
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

                    <div className="min-w-0">
                      <h3
                        className="
                          truncate
                          text-lg
                          font-semibold
                          text-slate-900

                          dark:text-slate-100
                        "
                      >
                        {getProviderLabel(
                          providerName,
                        )}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {
                          providerVoices.length
                        }{" "}
                        {providerVoices.length >
                        1
                          ? "voix"
                          : "voix"}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className="
                      size-4
                      text-slate-400

                      dark:text-slate-500
                    "
                  />
                </div>

                {/* =========================================
                    VOICES
                    ========================================= */}

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {providerVoices.map(
                    (voice) => {
                      const isFavorite =
                        favorites.has(
                          voice.id,
                        );

                      const isPlaying =
                        playingVoiceId ===
                        voice.id;

                      const isSelected =
                        selectedVoice ===
                        voice.id;

                      return (
                        <div
                          key={voice.id}
                          className={`
                            rounded-2xl
                            border
                            bg-white
                            p-5
                            shadow-sm
                            transition-all

                            dark:bg-[#0b1830]

                            ${
                              isSelected
                                ? `
                                  border-sky-400
                                  ring-2
                                  ring-sky-500/10

                                  dark:border-sky-500
                                  dark:ring-sky-500/20
                                `
                                : `
                                  border-slate-200
                                  hover:border-sky-200
                                  hover:shadow-md

                                  dark:border-[#1e3354]
                                  dark:hover:border-sky-800
                                `
                            }
                          `}
                        >
                          {/* =================================
                              CARD HEADER
                              ================================= */}

                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
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
                                <AudioLines
                                  className="
                                    size-5
                                    text-sky-600

                                    dark:text-sky-400
                                  "
                                />
                              </div>

                              <div className="min-w-0">
                                <h4
                                  className="
                                    truncate
                                    font-semibold
                                    text-slate-900

                                    dark:text-slate-100
                                  "
                                >
                                  {voice.name}
                                </h4>

                                <p
                                  className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    text-slate-500

                                    dark:text-slate-400
                                  "
                                >
                                  {getLanguageLabel(
                                    voice.language,
                                  )}

                                  {" · "}

                                  {normalizeGender(
                                    voice.gender,
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* FAVORITE */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleFavorite(
                                  voice.id,
                                )
                              }
                              aria-label={
                                isFavorite
                                  ? `Retirer ${voice.name} des favoris`
                                  : `Ajouter ${voice.name} aux favoris`
                              }
                              className="
                                shrink-0
                                rounded-lg
                                p-2
                                text-slate-400
                                transition

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
                                  isFavorite
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>

                          {/* =================================
                              BADGES
                              ================================= */}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span
                              className="
                                rounded-full
                                bg-sky-50
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-sky-700

                                dark:bg-sky-950/50
                                dark:text-sky-300
                              "
                            >
                              {voice.type ===
                              "FREE"
                                ? "Gratuit"
                                : "Premium"}
                            </span>

                            <span
                              className="
                                rounded-full
                                bg-slate-100
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-slate-600

                                dark:bg-[#10213d]
                                dark:text-slate-300
                              "
                            >
                              {getLanguageLabel(
                                voice.language,
                              )}
                            </span>
                          </div>

                          {/* =================================
                              DESCRIPTION
                              ================================= */}

                          <p
                            className="
                              mt-4
                              min-h-[48px]
                              text-sm
                              leading-6
                              text-slate-500

                              dark:text-slate-400
                            "
                          >
                            {voice.description ??
                              "Aucune description disponible."}
                          </p>

                          {/* =================================
                              PROVIDER VOICE ID
                              ================================= */}

                          <p
                            className="
                              mt-3
                              truncate
                              text-[11px]
                              text-slate-400

                              dark:text-slate-500
                            "
                            title={
                              voice.providerVoiceId
                            }
                          >
                            ID :{" "}
                            {
                              voice.providerVoiceId
                            }
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
                            <button
                              type="button"
                              onClick={() =>
                                void handlePreviewVoice(
                                  voice.id,
                                )
                              }
                              disabled={
                                playingVoiceId !==
                                  null &&
                                !isPlaying
                              }
                              aria-label={
                                isPlaying
                                  ? `Lecture de ${voice.name}`
                                  : `Écouter ${voice.name}`
                              }
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
                                transition

                                hover:bg-sky-50

                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                dark:bg-[#10213d]
                                dark:text-sky-400
                                dark:hover:bg-[#153052]
                              "
                            >
                              {isPlaying ? (
                                <span
                                  className="
                                    size-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-sky-200
                                    border-t-sky-600

                                    dark:border-sky-900
                                    dark:border-t-sky-400
                                  "
                                />
                              ) : (
                                <Play
                                  className="
                                    ml-0.5
                                    size-4
                                    fill-current
                                  "
                                />
                              )}
                            </button>

                            {/* WAVEFORM */}

                            <div className="flex flex-1 items-center gap-1">
                              {Array.from({
                                length: 24,
                              }).map(
                                (_, index) => (
                                  <span
                                    key={
                                      index
                                    }
                                    className={`
                                      w-1
                                      rounded-full
                                      transition-all

                                      ${
                                        isPlaying
                                          ? `
                                            bg-sky-500
                                            animate-pulse
                                          `
                                          : `
                                            bg-sky-200

                                            dark:bg-sky-700/70
                                          `
                                      }
                                    `}
                                    style={{
                                      height: `${
                                        8 +
                                        ((index *
                                          7) %
                                          15)
                                      }px`,
                                      animationDelay: `${index * 40}ms`,
                                    }}
                                  />
                                ),
                              )}
                            </div>

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
                                    bg-sky-100
                                    text-sky-700
                                    hover:bg-sky-200

                                    dark:bg-sky-950/70
                                    dark:text-sky-300
                                    dark:hover:bg-sky-900
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
                    },
                  )}
                </div>
              </section>
            ),
          )}
        </div>
      )}
    </div>
  );
}