"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AudioLines,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Globe2,
  Heart,
  Mic2,
  Play,
  Search,
  Sparkles,
  Pause,
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

// Icône + couleur d'accent par fournisseur, pour retrouver le badge de la
// maquette (pastille colorée + libellé) sur chaque carte voix.
const providerBadgeStyles: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  PIPER: {
    icon: AudioLines,
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  },
  EDGE_TTS: {
    icon: Cloud,
    className:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  GOOGLE: {
    icon: Globe2,
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  ELEVENLABS: {
    icon: Sparkles,
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  },
  OPENAI: {
    icon: Mic2,
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  MINIMAX: {
    icon: AudioLines,
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
  MICROSOFT: {
    icon: Cloud,
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  },
};

const PAGE_SIZE = 8;

/* =========================================================
  HELPERS
  ========================================================= */

function getProviderLabel(provider: string) {
  return providerLabels[provider] ?? provider;
}

function getProviderBadge(provider: string) {
  return (
    providerBadgeStyles[provider] ?? {
      icon: AudioLines,
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    }
  );
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

  if (value === "female" || value === "femme" || value === "female_voice") {
    return "Femme";
  }

  if (value === "male" || value === "homme" || value === "male_voice") {
    return "Homme";
  }

  return gender;
}

/* =========================================================
   DROPDOWN FILTER (pastille avec liste déroulante)
   ========================================================= */

function DropdownFilter({
  icon: Icon,
  value,
  options,
  onChange,
  getOptionLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  getOptionLabel?: (value: string) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
      >
        <Icon className="size-4 text-slate-400 dark:text-slate-500" />
        {value}
        <ChevronDown className="size-3.5 text-slate-400 dark:text-slate-500" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute left-0 z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {options.map((option) => {
              const active = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {getOptionLabel ? getOptionLabel(option) : option}
                  {active && <Check className="size-4" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function VoicesPage() {
  /* =======================================================
     FILTERS
     ======================================================= */

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("Toutes les langues");
  const [gender, setGender] = useState("Tous les genres");
  const [provider, setProvider] = useState("Tous les fournisseurs");
  const [type, setType] = useState("Tous les types");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);

  /* =======================================================
     VOICE STATE
     ======================================================= */

  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>(
    {},
  );

  /* =======================================================
     DATABASE
     ======================================================= */

  const voicesQuery = api.voice.getAll.useQuery();
  const voices = voicesQuery.data ?? [];

  /* =======================================================
     LANGUAGES
     ======================================================= */

  const languages = useMemo(() => {
    const unique = new Set(voices.map((voice) => voice.language));
    return Array.from(unique).sort((a, b) =>
      getLanguageLabel(a).localeCompare(getLanguageLabel(b), "fr"),
    );
  }, [voices]);

  /* =======================================================
     PROVIDERS
     ======================================================= */

  const providers = useMemo(() => {
    const unique = new Set(voices.map((voice) => voice.provider));
    return Array.from(unique).sort((a, b) => {
      const indexA = providerOrder.indexOf(a);
      const indexB = providerOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [voices]);

  /* =======================================================
     FILTERED VOICES
     ======================================================= */

  const filteredVoices = useMemo(() => {
    const value = search.toLowerCase().trim();

    return voices.filter((voice) => {
      const description = voice.description ?? "";

      const matchesSearch =
        !value ||
        voice.name.toLowerCase().includes(value) ||
        voice.language.toLowerCase().includes(value) ||
        voice.provider.toLowerCase().includes(value) ||
        voice.providerVoiceId.toLowerCase().includes(value) ||
        description.toLowerCase().includes(value);

      const matchesLanguage =
        language === "Toutes les langues" || voice.language === language;

      const matchesGender =
        gender === "Tous les genres" ||
        normalizeGender(voice.gender) === gender;

      const matchesProvider =
        provider === "Tous les fournisseurs" || voice.provider === provider;

      const matchesType =
        type === "Tous les types" ||
        (type === "Gratuit" && voice.type === "FREE") ||
        (type === "Premium" && voice.type === "PREMIUM");

      const matchesFavorites = !favoritesOnly || favorites.has(voice.id);

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
     PAGINATION
     ======================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredVoices.length / PAGE_SIZE));

  const paginatedVoices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredVoices.slice(start, start + PAGE_SIZE);
  }, [filteredVoices, page]);

  useEffect(() => {
    setPage(1);
  }, [search, language, gender, provider, type, favoritesOnly]);

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

  async function handlePreviewVoice(voiceId: string) {
    if (playingVoiceId) {
      return;
    }

    try {
      setPreviewError(null);
      setPlayingVoiceId(voiceId);
      setAudioProgress((current) => ({ ...current, [voiceId]: 0 }));

      const response = await fetch("/api/voices/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId,
          text: "Bonjour, ceci est un aperçu de cette voix. Vous pouvez écouter sa qualité avant de l'utiliser pour votre génération audio.",
        }),
      });

      if (!response.ok) {
        let message = "Impossible de générer l'aperçu audio.";

        try {
          const data = await response.json();
          if (typeof data?.error === "string") {
            message = data.error;
          }
        } catch {
          // La réponse n'est pas forcément du JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("Le fichier audio généré est vide.");
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      const updateProgress = () => {
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const nextProgress =
          duration > 0 ? (audio.currentTime / duration) * 100 : 0;

        setAudioProgress((current) => ({
          ...current,
          [voiceId]: nextProgress,
        }));
      };

      const cleanupAudio = () => {
        audio.pause();
        audio.currentTime = 0;
        URL.revokeObjectURL(url);
        setPlayingVoiceId(null);
        setAudioProgress((current) => ({ ...current, [voiceId]: 0 }));
      };

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", updateProgress);
      audio.addEventListener("ended", cleanupAudio);

      audio.onerror = () => {
        cleanupAudio();
        setPreviewError("Impossible de lire l'audio généré.");
      };

      await audio.play();
    } catch (error) {
      console.error("❌ Erreur preview audio:", error);
      setPlayingVoiceId(null);
      setPreviewError(
        error instanceof Error ? error.message : "Erreur pendant la lecture.",
      );
    }
  }

  /* =======================================================
     RESET
     ======================================================= */

  function resetFilters() {
    setSearch("");
    setLanguage("Toutes les langues");
    setGender("Tous les genres");
    setProvider("Tous les fournisseurs");
    setType("Tous les types");
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
      <div className="relative mx-auto flex min-h-[500px] w-full max-w-7xl items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />
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
      <div className="mx-auto flex min-h-[500px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40">
          <AudioLines className="size-7 text-red-600 dark:text-red-400" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-red-800 dark:text-red-300">
          Impossible de charger les voix
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-red-600 dark:text-red-400">
          Une erreur est survenue pendant la récupération des voix depuis la
          base de données.
        </p>

        <Button
          type="button"
          onClick={() => voicesQuery.refetch()}
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

  const hasActiveFilters =
    search ||
    language !== "Toutes les langues" ||
    gender !== "Tous les genres" ||
    provider !== "Tous les fournisseurs" ||
    type !== "Tous les types" ||
    favoritesOnly;

  return (
    <div className="relative mx-auto w-full max-w-7xl text-slate-900 dark:text-slate-100">
      {/* ===================================================
          BREADCRUMB
          =================================================== */}

      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
      >
        <ArrowLeft className="size-4" />
        Bibliothèque de voix
      </button>

      {/* ===================================================
          HEADER
          =================================================== */}

      <section className="relative mb-6 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-42px_rgba(79,70,229,0.35)] dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute -right-24 -top-28 size-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:items-center lg:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              <AudioLines className="size-3.5" />
              Bibliothèque vocale IA
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              Des voix{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                extraordinaires
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
              Découvrez une collection de voix IA naturelles et expressives
              pour donner vie à vos textes.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-indigo-500" />
                Voix haute qualité
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-indigo-500" />
                Plusieurs langues
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-indigo-500" />
                Fournisseurs de confiance
              </span>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="relative flex size-56 items-center justify-center rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 shadow-xl shadow-indigo-500/10 dark:border-indigo-900/50 dark:from-indigo-950/50 dark:via-slate-950 dark:to-sky-950/30">
              <div className="absolute inset-8 rounded-full bg-indigo-500/10 blur-2xl" />
              <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-500/30">
                <AudioLines className="size-11" />
              </div>
              <div className="absolute inset-x-8 bottom-7 flex h-12 items-center justify-center gap-1">
                {[16, 28, 40, 22, 34, 48, 27, 42, 20, 36, 45, 25, 39, 18, 31].map(
                  (height, index) => (
                    <span
                      key={index}
                      className="w-1 rounded-full bg-gradient-to-t from-indigo-600 to-sky-400"
                      style={{ height }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SEARCH + FILTERS BAR
          =================================================== */}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une voix, un nom, une langue..."
            className="h-11 rounded-2xl border-slate-200/80 bg-white pl-10 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <DropdownFilter
          icon={Globe2}
          value={language}
          onChange={setLanguage}
          options={["Toutes les langues", ...languages]}
          getOptionLabel={(value) =>
            value === "Toutes les langues" ? value : getLanguageLabel(value)
          }
        />

        <DropdownFilter
          icon={Mic2}
          value={gender}
          onChange={setGender}
          options={["Tous les genres", "Femme", "Homme"]}
        />

        <DropdownFilter
          icon={AudioLines}
          value={provider}
          onChange={setProvider}
          options={["Tous les fournisseurs", ...providers]}
          getOptionLabel={(value) =>
            value === "Tous les fournisseurs" ? value : getProviderLabel(value)
          }
        />

        <DropdownFilter
          icon={Sparkles}
          value={type}
          onChange={setType}
          options={["Tous les types", "Gratuit", "Premium"]}
        />

        <Button
          type="button"
          variant={favoritesOnly ? "secondary" : "outline"}
          onClick={() => setFavoritesOnly((value) => !value)}
          className={`h-11 shrink-0 rounded-2xl border px-4 text-sm font-medium ${
            favoritesOnly
              ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
              : "border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
          }`}
        >
          <Heart
            className="mr-2 size-4"
            fill={favoritesOnly ? "currentColor" : "none"}
          />
          Favoris uniquement
        </Button>
      </div>

      {/* ===================================================
          PREVIEW ERROR
          =================================================== */}

      {previewError && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <div className="flex items-start gap-3">
            <AudioLines className="mt-0.5 size-4 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Erreur de lecture</p>
              <p className="mt-1">{previewError}</p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewError(null)}
              className="text-xs font-medium underline"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          RESULT COUNT
          =================================================== */}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            Toutes les voix
          </h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
            {filteredVoices.length} voix
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="rounded-lg text-xs text-slate-500 dark:text-slate-400"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* ===================================================
          EMPTY
          =================================================== */}

      {filteredVoices.length === 0 ? (
        <div className="mt-5 flex min-h-[400px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 text-center shadow-[0_18px_50px_-35px_rgba(79,70,229,0.3)] dark:border-slate-700 dark:bg-slate-950">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
            <AudioLines className="size-7 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {voices.length === 0
              ? "Aucune voix disponible"
              : "Aucune voix trouvée"}
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            {voices.length === 0
              ? "Aucune voix active n'est actuellement enregistrée dans la base de données."
              : "Essayez une autre recherche ou modifiez vos filtres."}
          </p>

          {voices.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-5 rounded-xl"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        /* =================================================
          GRID DE VOIX (4 colonnes, style carte "portrait")
           ================================================= */

        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {paginatedVoices.map((voice) => {
              const isFavorite = favorites.has(voice.id);
              const isPlaying = playingVoiceId === voice.id;
              const isSelected = selectedVoice === voice.id;
              const badge = getProviderBadge(voice.provider);
              const BadgeIcon = badge.icon;
              const progress = audioProgress[voice.id] ?? 0;

              return (
                <div
                  key={voice.id}
                  className={`rounded-[24px] border bg-white p-4 shadow-[0_16px_45px_-35px_rgba(15,23,42,0.4)] transition-all dark:bg-slate-950 ${
                    isSelected
                      ? "border-indigo-400 ring-2 ring-indigo-500/10 dark:border-indigo-500 dark:ring-indigo-500/20"
                      : "border-slate-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:hover:border-indigo-800"
                  }`}
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-sm font-bold text-white">
                        {voice.name.slice(0, 1).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate font-bold text-slate-950 dark:text-white">
                          {voice.name}
                        </h4>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
                        >
                          <BadgeIcon className="size-3" />
                          {getProviderLabel(voice.provider)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(voice.id)}
                      aria-label={
                        isFavorite
                          ? `Retirer ${voice.name} des favoris`
                          : `Ajouter ${voice.name} aux favoris`
                      }
                      className={`shrink-0 rounded-lg p-1.5 transition ${
                        isFavorite
                          ? "text-rose-500"
                          : "text-slate-300 hover:text-rose-400 dark:text-slate-600"
                      }`}
                    >
                      <Heart
                        className="size-[18px]"
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* BADGES LANGUE / GENRE */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {getLanguageLabel(voice.language)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {normalizeGender(voice.gender)}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-3 min-h-[40px] text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {voice.description ?? "Aucune description disponible."}
                  </p>

                  {/* AUDIO PREVIEW */}
                  <div className="mt-4 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => void handlePreviewVoice(voice.id)}
                      disabled={playingVoiceId !== null && !isPlaying}
                      aria-label={
                        isPlaying
                          ? `Lecture de ${voice.name}`
                          : `Écouter ${voice.name}`
                      }
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPlaying ? (
                        <Pause className="ml-0.5 size-3.5 fill-current" />
                      ) : (
                        <Play className="ml-0.5 size-3.5 fill-current" />
                      )}
                    </button>

                    <div className="flex flex-1 items-center gap-[3px] overflow-hidden">
                      {Array.from({ length: 22 }).map((_, index) => {
                        const isActive = isPlaying && (index / 22) * 100 <= progress;

                        return (
                          <span
                            key={index}
                            className={`w-1 shrink-0 rounded-full transition-all ${
                              isActive
                                ? "animate-pulse bg-indigo-500"
                                : "bg-indigo-200 dark:bg-indigo-800/70"
                            }`}
                            style={{
                              height: `${6 + ((index * 7) % 14)}px`,
                              animationDelay: `${index * 40}ms`,
                            }}
                          />
                        );
                      })}
                    </div>

                    <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                      0:15
                    </span>
                  </div>

                  {/* SELECT */}
                  <Button
                    type="button"
                    onClick={() =>
                      setSelectedVoice(isSelected ? null : voice.id)
                    }
                    variant={isSelected ? "secondary" : "default"}
                    className={`mt-4 w-full rounded-xl ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900"
                        : "shadow-sm shadow-indigo-500/10"
                    }`}
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

          {/* =================================================
              PAGINATION
              ================================================= */}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredVoices.length} voix au total
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Page précédente"
                  className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }).map(
                  (_, index) => {
                    const pageNumber = index + 1;
                    const active = pageNumber === page;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`flex size-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                          active
                            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  },
                )}

                {totalPages > 5 && (
                  <span className="px-1 text-sm text-slate-400 dark:text-slate-500">
                    …
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Page suivante"
                  className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}