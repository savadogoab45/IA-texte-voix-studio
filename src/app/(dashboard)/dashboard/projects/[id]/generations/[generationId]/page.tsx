"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  Download,
  FileText,
  Folder,
  Headphones,
  Lightbulb,
  ListMusic,
  Loader2,
  Mic2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Repeat,
  Rewind,
  FastForward,
  Shuffle,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function GenerationAudioPage() {
  const params = useParams();

  const projectId = params.id as string;
  const generationId = params.generationId as string;

  // =========================================================
  // GENERATION
  // =========================================================

  const generationQuery = api.generation.getById.useQuery(
    {
      id: generationId,
    },
    {
      enabled: Boolean(generationId),

      refetchInterval: (query) => {
        const status = query.state.data?.status;

        if (status === "COMPLETED" || status === "FAILED") {
          return false;
        }

        return 500;
      },
    },
  );

  const generation = generationQuery.data;

  const [retryingGenerationId, setRetryingGenerationId] =
    useState<string | null>(null);

  const [isRetryDialogOpen, setIsRetryDialogOpen] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const retryGeneration = api.generation.retry.useMutation({
    onSuccess: async () => {
      setRetryingGenerationId(null);
      await generationQuery.refetch();
    },

    onError: (error) => {
      setRetryingGenerationId(null);
      console.error("Erreur lors de la régénération :", error);
    },
  });

  function handleRetry() {
    if (!generation || retryGeneration.isPending) return;

    setIsRetryDialogOpen(true);
  }

  async function confirmRetry() {
    if (!generation) return;

    setIsRetryDialogOpen(false);
    setRetryingGenerationId(generation.id);

    try {
      await retryGeneration.mutateAsync({
        id: generation.id,
      });
    } catch {
      // onError gère l'affichage et la remise à zéro de l'état.
    }
  }

  async function handleCopyText() {
    if (!generation?.result) return;

    try {
      await navigator.clipboard.writeText(generation.result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error("Impossible de copier le texte :", error);
    }
  }

  // =========================================================
  // AUDIO
  // =========================================================

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);

  const [playbackRate, setPlaybackRate] = useState(1);

  const [isLooping, setIsLooping] = useState(false);

  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  // =========================================================
  // AUDIO EVENTS
  // =========================================================

  function handleTimeUpdate(event: SyntheticEvent<HTMLAudioElement>) {
    setCurrentTime(event.currentTarget.currentTime);
  }

  function handleLoadedMetadata(event: SyntheticEvent<HTMLAudioElement>) {
    const nextDuration = event.currentTarget.duration;

    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
  }

  function handleAudioPlay() {
    setIsPlaying(true);
  }

  function handleAudioPause() {
    setIsPlaying(false);
  }

  function handleAudioEnded() {
    setIsPlaying(false);
    setCurrentTime(0);
  }

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [generation?.audioUrl]);

  // =========================================================
  // PLAY / PAUSE
  // =========================================================

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();

        setIsPlaying(true);
      } catch (error) {
        console.error("Impossible de lire l'audio :", error);
      }
    } else {
      audio.pause();

      setIsPlaying(false);
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const nextTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function toggleLoop() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = !audio.loop;
    setIsLooping(audio.loop);
  }

  // =========================================================
  // VOLUME
  // =========================================================

  function handleVolume(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = value;

    setVolume(value);
  }

  // =========================================================
  // PLAYBACK SPEED
  // =========================================================

  const PLAYBACK_RATES = [0.75, 1, 1.1, 1.15, 1.25, 1.5, 2];

  function setRate(rate: number) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = rate;
    setPlaybackRate(rate);
    setSpeedMenuOpen(false);
  }

  // =========================================================
  // FORMAT TIME
  // =========================================================

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function formatDuration(seconds: number) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return "—";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes} min ${String(remainingSeconds).padStart(2, "0")} s`;
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (generationQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="size-5 animate-spin text-blue-500" />
          Chargement de l&apos;audio...
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (generationQuery.isError || !generation) {
    return (
      <div className="min-h-screen  px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-4" />
            Retour au projet
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-3">
              <CircleAlert className="size-6 text-red-600 dark:text-red-400" />

              <div>
                <h2 className="font-semibold text-red-900 dark:text-red-300">
                  Génération introuvable
                </h2>

                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  Cette génération n&apos;existe pas ou vous n&apos;avez pas
                  accès à celle-ci.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // STATUS
  // =========================================================

  const isPending = generation.status === "PENDING";

  const isRunning = generation.status === "RUNNING";

  const isCompleted = generation.status === "COMPLETED";

  const isFailed = generation.status === "FAILED";

  const currentStep =
    generation.currentStep ??
    (isPending ? "Préparation..." : "Génération en cours...");

  const progress = Math.min(Math.max(generation.progress ?? 0, 0), 100);

  const createdAtLabel = generation.createdAt
    ? new Date(generation.createdAt).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const wordCount = generation.result
    ? generation.result.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen  text-slate-900 dark:bg-[#0a1122] dark:text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
        {/* ===================================================
            BACK
        =================================================== */}

        <Link
          href={`/dashboard/projects/${projectId}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="size-4" />
          Retour au projet
        </Link>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-blue-100/80 bg-gradient-to-br from-white via-[#f7f9ff] to-[#edf3ff] p-8 shadow-[0_18px_55px_rgba(37,99,235,0.10)] dark:border-[#1c2b4a] dark:from-[#0d1d36] dark:via-[#0b1830] dark:to-[#10213d] lg:min-h-[210px] lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/20" />
          <div className="pointer-events-none absolute right-1/4 bottom-[-3rem] size-64 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] items-center justify-center lg:flex">
            <div className="flex items-end gap-[3px] opacity-70">
              {WAVEFORM_BARS.slice(0, 40).map((height, index) => (
                <span
                  key={index}
                  className="block w-[3px] rounded-full bg-gradient-to-t from-blue-500 via-sky-400 to-indigo-400 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300"
                  style={{ height: `${height * 1.6}px` }}
                />
              ))}
            </div>
            <div className="relative z-10 -ml-8 flex size-24 items-center justify-center rounded-3xl bg-blue-100/80 backdrop-blur-md dark:bg-white/10">
              <Mic2 className="size-11 text-blue-600 dark:text-white" />
            </div>
          </div>

          <div className="relative z-10 max-w-xl text-slate-900 dark:text-white">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1.5 text-blue-700 dark:bg-white/10 dark:text-white/80">
                <Folder className="size-3.5" />
                {generation.document.project.name}
              </span>
              <ChevronRight className="size-3.5" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1.5 text-blue-700 dark:bg-white/10 dark:text-white/80">
                <Headphones className="size-3.5" />
                Génération
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl dark:text-white">
              Génération{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300">
                audio
              </span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-white/70">
              Écoutez, téléchargez ou régénérez votre audio généré par
              l&apos;IA.
            </p>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* ===================================================
              MAIN COLUMN
          =================================================== */}
          <div className="min-w-0 space-y-6">
            {/* AUDIO PLAYER */}
            {isCompleted && generation.audioUrl && (
              <section className="overflow-hidden rounded-[26px] border border-slate-200/80  shadow-[0_14px_45px_rgba(15,23,42,0.05)] dark:border-[#1c2b4a] ">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 dark:border-[#1c2b4a] sm:flex-row sm:items-start sm:justify-between sm:p-7">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                      <FileText className="size-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        {generation.title}
                      </h2>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>Créée le {createdAtLabel}</span>
                        <span className="text-slate-300 dark:text-slate-600">
                          •
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-[#10213d] dark:text-slate-300">
                          {generation.providerVoice ?? "Audio"}
                        </span>
                        <span>{generation.voice?.name ?? "Voix"}</span>
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={generation.status} />
                </div>

                <div className="p-6 sm:p-7">
                  <audio
                    ref={audioRef}
                    src={generation.audioUrl}
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handleAudioPlay}
                    onPause={handleAudioPause}
                    onEnded={handleAudioEnded}
                  />

                  {/* WAVEFORM / PROGRESS */}
                  <Waveform
                    progress={duration > 0 ? (currentTime / duration) * 100 : 0}
                    onSeek={(percent) => {
                      const audio = audioRef.current;

                      if (!audio || !duration) {
                        return;
                      }

                      const nextTime = (percent / 100) * duration;

                      audio.currentTime = nextTime;
                      setCurrentTime(nextTime);
                    }}
                  />

                  <div className="mt-3 flex items-center gap-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                    <span>{formatTime(currentTime)}</span>
                    <div className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-[#132140]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{
                          width: `${
                            duration > 0 ? (currentTime / duration) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* CONTROLS */}
                  <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <ControlIcon icon={Shuffle} disabled />

                      <ControlIcon
                        icon={Rewind}
                        label="-10s"
                        onClick={() => skip(-10)}
                      />

                      <button
                        type="button"
                        onClick={() => void togglePlay()}
                        className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/25 transition hover:scale-105"
                      >
                        {isPlaying ? (
                          <Pause className="size-6 fill-current" />
                        ) : (
                          <Play className="ml-0.5 size-6 fill-current" />
                        )}
                      </button>

                      <ControlIcon
                        icon={FastForward}
                        label="+10s"
                        onClick={() => skip(10)}
                      />

                      <ControlIcon
                        icon={Repeat}
                        active={isLooping}
                        onClick={toggleLoop}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center gap-2">
                        {volume === 0 ? (
                          <VolumeX className="size-4 text-slate-400" />
                        ) : (
                          <Volume2 className="size-4 text-slate-400" />
                        )}

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolume}
                          className="w-24 accent-indigo-500 sm:w-28"
                        />
                      </div>

                      <div className="relative z-30">
                        <button
                          type="button"
                          onClick={() => setSpeedMenuOpen((open) => !open)}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-slate-300"
                        >
                          <span>Vitesse de lecture</span>
                          <span className="rounded-md bg-white px-1.5 py-0.5 text-slate-800 shadow-sm dark:bg-[#0f1b33] dark:text-white">
                            {playbackRate}x
                          </span>
                        </button>

                        {speedMenuOpen && (
                          <div className="absolute right-0 bottom-full z-50 mb-2 w-28 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-[#25396092] dark:bg-[#0f1b33]">
                            {PLAYBACK_RATES.map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => setRate(rate)}
                                className={`block w-full px-3 py-1.5 text-left text-xs font-semibold transition hover:bg-slate-50 dark:hover:bg-[#0b162c] ${
                                  rate === playbackRate
                                    ? "text-blue-600 dark:text-blue-300"
                                    : "text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* GENERATION PROGRESS */}
            {(isPending || isRunning) && (
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)] dark:border-[#1c2b4a] dark:bg-[#0f1b33] sm:p-7">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                    <Loader2 className="size-6 animate-spin text-blue-500" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      {isPending
                        ? "Génération en attente"
                        : "Génération en cours"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Étape actuelle : {currentStep}
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Progression
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {progress}%
                    </span>
                  </div>

                  <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-[#0b162c] dark:text-slate-300">
                    {currentStep}
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-[#0b162c]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* FAILED */}
            {isFailed && (
              <section className="rounded-[26px] border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                  <CircleAlert className="size-6 text-red-500" />

                  <div>
                    <h2 className="font-bold text-red-900 dark:text-red-300">
                      La génération a échoué
                    </h2>

                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {generation.error ?? "Une erreur est survenue."}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
                  onClick={() => void generationQuery.refetch()}
                >
                  <RefreshCw className="mr-2 size-4" />
                  Actualiser
                </Button>
              </section>
            )}

            {/* TEXT */}
            {generation.result && (
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.05)] dark:border-[#1c2b4a] dark:bg-[#0f1b33] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                      <FileText className="size-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-950 dark:text-white">
                      Texte utilisé pour la génération
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleCopyText()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-slate-300"
                  >
                    <Copy className="size-3.5" />
                    {isCopied ? "Copié !" : "Copier"}
                  </button>
                </div>

                <div className="mt-5 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-[#1c2b4a] dark:bg-[#0b162c]">
                  <p className="text-sm leading-7 whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                    {generation.result}
                  </p>
                </div>

                <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  {wordCount.toLocaleString("fr-FR")} mots •{" "}
                  {generation.result.length.toLocaleString("fr-FR")}{" "}
                  caractères
                </div>
              </section>
            )}
          </div>

          {/* ===================================================
              SIDEBAR
          =================================================== */}
          <aside className="space-y-5">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#1c2b4a] dark:bg-[#0f1b33]">
              <div className="mb-4 flex items-center gap-2">
                <ListMusic className="size-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold">Actions</h3>
              </div>

              <div className="space-y-2.5">
                {isCompleted && generation.audioUrl && (
                  <a
                    href={generation.audioUrl}
                    download
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
                  >
                    <Download className="size-4" />
                    Télécharger l&apos;audio
                  </a>
                )}

                <button
                  type="button"
                  disabled={
                    retryingGenerationId === generation.id || isPending || isRunning
                  }
                  onClick={handleRetry}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-slate-200"
                >
                  {retryingGenerationId === generation.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  Régénérer avec les mêmes paramètres
                </button>

                <Link
                  href={`/dashboard/projects/${projectId}/generations/new?documentId=${generation.document.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-[#25396092] dark:bg-[#0b162c] dark:text-slate-200"
                >
                  <Plus className="size-4" />
                  Créer une nouvelle génération
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.045)] dark:border-[#1c2b4a] dark:bg-[#0f1b33]">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold">Informations</h3>
              </div>

              <ul className="divide-y divide-slate-100 text-sm dark:divide-[#1c2b4a]">
                <InfoRow
                  icon={CheckCircle2}
                  label="Statut"
                  value={<StatusBadge status={generation.status} compact />}
                />
                <InfoRow
                  icon={Clock3}
                  label="Durée"
                  value={formatDuration(duration)}
                />
                <InfoRow
                  icon={Headphones}
                  label="Mots"
                  value={`${wordCount.toLocaleString("fr-FR")} mots`}
                />
                <InfoRow
                  icon={Mic2}
                  label="Fournisseur"
                  value={generation.providerVoice ?? "Aucun"}
                />
                <InfoRow
                  icon={Headphones}
                  label="Voix"
                  value={generation.voice?.name ?? "Aucune"}
                />
                <InfoRow icon={Clock3} label="Créée le" value={createdAtLabel} />
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-500 to-violet-700 p-6 text-white shadow-lg shadow-indigo-500/20">
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
                  <Lightbulb className="size-5" />
                </div>

                <h3 className="mt-4 text-sm font-bold">Conseil du jour</h3>

                <p className="mt-2 text-xs leading-5 text-white/85">
                  Écoutez votre audio pour vérifier la prononciation des noms
                  propres et des termes techniques.
                </p>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
                >
                  Voir plus de conseils →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isRetryDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setIsRetryDialogOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="retry-dialog-title"
            aria-describedby="retry-dialog-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-[#25396092] dark:bg-[#0f1b33]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <RefreshCw className="size-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h2
                  id="retry-dialog-title"
                  className="text-lg font-semibold text-slate-900 dark:text-white"
                >
                  Confirmer la régénération ?
                </h2>

                <p
                  id="retry-dialog-description"
                  className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
                >
                  L&apos;audio de « {generation.title} » sera régénéré avec
                  les paramètres existants.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRetryDialogOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={() => void confirmRetry()}
                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 size-4" />
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const config =
    status === "COMPLETED"
      ? {
          label: "Terminée",
          cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        }
      : status === "FAILED"
        ? {
            label: "Échec",
            cls: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300",
            dot: "bg-red-500",
            icon: Ban,
          }
        : status === "RUNNING"
          ? {
              label: "En cours",
              cls: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300",
              dot: "bg-indigo-500",
              icon: Loader2,
            }
          : {
              label: "En attente",
              cls: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300",
              dot: "bg-amber-500",
              icon: Clock3,
            };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.cls}`}
      >
        <span className={`size-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  return (
    <div
      className={`flex shrink-0 flex-col items-end gap-1 rounded-2xl border px-4 py-2.5 text-right ${config.cls}`}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-bold">
        <CheckCircle2 className="size-4" />
        {config.label}
      </span>
      {status === "COMPLETED" && (
        <span className="text-[11px] font-medium opacity-80">
          Votre audio est prêt !
        </span>
      )}
    </div>
  );
}

// =========================================================
// INFO ROW (sidebar)
// =========================================================

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </li>
  );
}

// =========================================================
// CONTROL ICON (player)
// =========================================================

function ControlIcon({
  icon: Icon,
  onClick,
  disabled,
  active,
  label,
}: {
  icon: React.ElementType;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`flex size-10 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-[#132140] dark:hover:text-white"
      }`}
    >
      <Icon className="size-4" />
    </button>
  );
}

// =========================================================
// WAVEFORM
// =========================================================

const WAVEFORM_BARS = [
  10, 16, 24, 14, 20, 30, 18, 26, 34, 20, 28, 14, 22, 32, 18, 27, 38, 23, 31,
  17, 25, 35, 20, 29, 15, 24, 33, 19, 28, 37, 22, 30, 16, 26, 34, 21, 29, 18,
  36, 24, 31, 15, 27, 38, 20, 30, 17, 25, 34, 22, 29, 14, 24, 36, 19, 28, 32,
  21, 27, 16, 35, 23, 30, 18, 26, 37, 20, 29, 15, 24, 33, 19, 28, 36, 22, 31,
  17, 25, 34, 21, 29, 14, 23, 38, 20, 27, 35, 18, 30, 24, 16, 32, 22, 28, 36,
  19, 26, 34, 21, 30, 15, 24, 37, 20, 29, 17, 27, 33, 22, 31, 18, 26, 35, 21,
  29, 16, 24, 38, 20, 28,
];

function Waveform({
  progress,
  onSeek,
}: {
  progress: number;
  onSeek: (percent: number) => void;
}) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    if (!rect.width) {
      return;
    }

    const percent = ((event.clientX - rect.left) / rect.width) * 100;

    onSeek(Math.min(Math.max(percent, 0), 100));
  }

  return (
    <div
      role="slider"
      aria-label="Position dans l'audio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeProgress)}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }

        event.preventDefault();

        const delta = event.key === "ArrowRight" ? 2 : -2;
        onSeek(Math.min(Math.max(safeProgress + delta, 0), 100));
      }}
      className="flex h-16 w-full cursor-pointer items-center gap-[2px] overflow-hidden rounded-xl bg-slate-50 px-3 transition outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-[#0b162c] dark:hover:bg-[#0d1930]"
    >
      {WAVEFORM_BARS.map((height, index) => {
        const barProgress = (index / WAVEFORM_BARS.length) * 100;

        const isPlayed = barProgress <= safeProgress;

        return (
          <span
            key={index}
            className={`block min-w-0 flex-1 rounded-full transition-colors duration-150 ${
              isPlayed
                ? "bg-gradient-to-t from-blue-500 to-indigo-400"
                : "bg-slate-300 dark:bg-[#25396092]"
            }`}
            style={{
              height: `${height}px`,
            }}
          />
        );
      })}
    </div>
  );
}