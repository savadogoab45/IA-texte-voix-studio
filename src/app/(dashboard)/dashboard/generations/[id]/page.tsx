"use client";

import type {
  ChangeEvent,
  ReactNode,
} from "react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  Headphones,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function GenerationDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  // =========================================================
  // GENERATION
  // =========================================================

  const generationQuery =
    api.generation.getById.useQuery(
      { id },
      {
        enabled: Boolean(id) && id !== "new",
        refetchInterval: (query) => {
          const status =
            query.state.data?.status;

          if (
            status === "COMPLETED" ||
            status === "FAILED"
          ) {
            return false;
          }

          return 500;
        },
      },
    );

  const generation =
    generationQuery.data;

  // =========================================================
  // LOADING
  // =========================================================

  if (generationQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="size-5 animate-spin" />

          Chargement de la génération...
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (
    generationQuery.isError ||
    !generation
  ) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/generations"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            text-slate-500
            transition-colors
            hover:text-slate-900
            dark:text-slate-400
            dark:hover:text-slate-100
          "
        >
          <ArrowLeft className="size-4" />

          Retour aux générations
        </Link>

        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-6 shrink-0 text-red-600 dark:text-red-400" />

            <div>
              <h2 className="font-semibold text-red-900 dark:text-red-300">
                Génération introuvable
              </h2>

              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                Cette génération n&apos;existe pas
                ou vous n&apos;avez pas accès à
                celle-ci.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // STATUS
  // =========================================================

  const isPending =
    generation.status === "PENDING";

  const isRunning =
    generation.status === "RUNNING";

  const isCompleted =
    generation.status === "COMPLETED";

  const isFailed =
    generation.status === "FAILED";

  const progress = Math.min(
    Math.max(
      generation.progress ?? 0,
      0,
    ),
    100,
  );

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-5xl
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        href="/dashboard/generations"
        className="
          mb-7
          inline-flex
          items-center
          gap-2
          text-sm
          text-slate-500
          transition-colors
          hover:text-slate-900
          dark:text-slate-400
          dark:hover:text-slate-100
        "
      >
        <ArrowLeft className="size-4" />

        Retour aux générations
      </Link>

      {/* =====================================================
          COMPLETED HEADER
      ===================================================== */}

      {isCompleted && (
        <section
          className="
            mb-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
            sm:p-6
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                dark:bg-emerald-950/40
              "
            >
              <CheckCircle2
                className="
                  size-6
                  text-emerald-600
                  dark:text-emerald-400
                "
              />
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-slate-100
                  sm:text-2xl
                "
              >
                Audio généré
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Votre génération est terminée.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          GENERATION TITLE FOR NON COMPLETED
      ===================================================== */}

      {!isCompleted && (
        <section className="mb-6">
          <div className="flex items-center gap-2">
            <Headphones className="size-5 text-sky-500" />

            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Génération audio
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {generation.title}
            </h1>

            <StatusBadge
              status={generation.status}
            />
          </div>
        </section>
      )}

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      {(isPending || isRunning) && (
        <GenerationProgress
          status={generation.status}
          progress={progress}
          currentStep={
            generation.currentStep
          }
        />
      )}

      {/* =====================================================
          FAILED
      ===================================================== */}

      {isFailed && (
        <section
          className="
            mb-6
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-6 shrink-0 text-red-600 dark:text-red-400" />

            <div>
              <h2 className="font-semibold text-red-900 dark:text-red-300">
                La génération a échoué
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-400">
                {generation.error ??
                  "Une erreur est survenue pendant la génération."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              void generationQuery.refetch()
            }
            className="mt-5 rounded-xl"
          >
            <RefreshCw className="mr-2 size-4" />

            Actualiser
          </Button>
        </section>
      )}

      {/* =====================================================
          AUDIO PLAYER
      ===================================================== */}

      {isCompleted &&
        generation.audioUrl && (
          <AudioPlayer
            audioUrl={
              generation.audioUrl
            }
            title={
              generation.title
            }
          />
        )}

      {/* =====================================================
          NO AUDIO
      ===================================================== */}

      {isCompleted &&
        !generation.audioUrl && (
          <section
            className="
              mb-6
              rounded-2xl
              border
              border-amber-200
              bg-amber-50
              p-5
              dark:border-amber-900/50
              dark:bg-amber-950/20
            "
          >
            <div className="flex items-center gap-3">
              <CircleAlert className="size-5 text-amber-600 dark:text-amber-400" />

              <p className="text-sm text-amber-700 dark:text-amber-400">
                La génération est terminée,
                mais aucun fichier audio n&apos;est
                disponible.
              </p>
            </div>
          </section>
        )}

      {/* =====================================================
          PROMPT
      ===================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
          sm:p-6
        "
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Prompt
        </h2>

        <div
          className="
            mt-4
            max-h-64
            overflow-y-auto
            rounded-xl
            bg-slate-50
            p-4
            dark:bg-slate-950
          "
        >
          <p
            className="
              whitespace-pre-wrap
              break-words
              text-sm
              leading-7
              text-slate-600
              dark:text-slate-300
            "
          >
            {generation.prompt}
          </p>
        </div>
      </section>

      {/* =====================================================
          RESULT
      ===================================================== */}

      {isCompleted &&
        generation.result && (
          <section
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:p-6
            "
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Texte généré
            </h2>

            <div
              className="
                mt-4
                max-h-[500px]
                overflow-y-auto
                rounded-xl
                bg-slate-50
                p-5
                dark:bg-slate-950
              "
            >
              <p
                className="
                  whitespace-pre-wrap
                  break-words
                  text-sm
                  leading-7
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {generation.result}
              </p>
            </div>
          </section>
        )}

      {/* =====================================================
          METADATA
      ===================================================== */}

      <section
        className="
          mt-5
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        <InfoCard
          icon={
            <Clock3 className="size-5" />
          }
          label="Statut"
          value={generation.status}
        />

        <InfoCard
          icon={
            <Sparkles className="size-5" />
          }
          label="Provider"
          value={
            generation.providerVoice ??
            "Aucun"
          }
        />
      </section>
    </div>
  );
}

/* ============================================================
   AUDIO PLAYER
============================================================ */

function AudioPlayer({
  audioUrl,
  title,
}: {
  audioUrl: string;
  title: string;
}) {
  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [isMuted, setIsMuted] =
    useState(false);

  const [isSeeking, setIsSeeking] =
    useState(false);

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata =
      () => {
        setDuration(
          Number.isFinite(
            audio.duration,
          )
            ? audio.duration
            : 0,
        );
      };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(
          audio.currentTime,
        );
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate,
    );

    audio.addEventListener(
      "play",
      handlePlay,
    );

    audio.addEventListener(
      "pause",
      handlePause,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );

      audio.removeEventListener(
        "play",
        handlePlay,
      );

      audio.removeEventListener(
        "pause",
        handlePause,
      );

      audio.removeEventListener(
        "ended",
        handleEnded,
      );
    };
  }, [isSeeking]);

  function formatTime(
    value: number,
  ) {
    if (
      !Number.isFinite(value)
    ) {
      return "00:00";
    }

    const minutes =
      Math.floor(value / 60);

    const seconds =
      Math.floor(value % 60);

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }

  async function togglePlay() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error(
        "Erreur lecture audio :",
        error,
      );
    }
  }

  function rewind() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime =
      Math.max(
        0,
        audio.currentTime - 10,
      );

    setCurrentTime(
      audio.currentTime,
    );
  }

  function forward() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime =
      Math.min(
        audio.duration || duration,
        audio.currentTime + 10,
      );

    setCurrentTime(
      audio.currentTime,
    );
  }

  function handleSeek(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const value =
      Number(event.target.value);

    audio.currentTime = value;

    setCurrentTime(value);
  }

  function handleVolume(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const value =
      Number(event.target.value);

    audio.volume = value;

    setVolume(value);
    setIsMuted(value === 0);
  }

  function toggleMute() {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    if (isMuted) {
      const nextVolume =
        volume > 0 ? volume : 1;

      audio.volume =
        nextVolume;

      setVolume(nextVolume);
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }

  return (
    <section
      className="
        mb-5
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-5
      "
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* =====================================================
          AUDIO CARD
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-[#111d35]
          p-4
          text-white
          shadow-xl
          shadow-slate-950/20
          sm:p-5
        "
      >
        {/* TOP */}

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div className="flex min-w-0 items-center gap-4">
            {/* COVER */}

            <div
              className="
                flex
                size-16
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-400
                via-blue-500
                to-violet-600
                shadow-lg
                shadow-indigo-500/20
              "
            >
              <div className="flex h-9 items-center gap-0.5">
                {[
                  12, 20, 30, 16, 26,
                  34, 22, 14, 28, 18,
                ].map(
                  (
                    height,
                    index,
                  ) => (
                    <span
                      key={index}
                      className={`
                        w-0.5
                        rounded-full
                        bg-white
                        ${
                          isPlaying
                            ? "animate-pulse"
                            : ""
                        }
                      `}
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * 60}ms`,
                      }}
                    />
                  ),
                )}
              </div>
            </div>

            {/* INFO */}

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold sm:text-lg">
                Génération audio
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                MP3
                {" • "}
                {formatTime(duration)}
              </p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {title}
              </p>
            </div>
          </div>

          {/* DOWNLOAD */}

          <a
            href={audioUrl}
            download
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white/10
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              backdrop-blur
              transition
              hover:bg-white/15
            "
          >
            <Download className="size-4" />

            Télécharger
          </a>
        </div>

        {/* ===================================================
            CONTROLS
        =================================================== */}

        <div
          className="
            mt-7
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
            sm:gap-6
          "
        >
          {/* REWIND */}

          <button
            type="button"
            onClick={rewind}
            aria-label="Revenir de 10 secondes"
            className="
              relative
              flex
              size-10
              items-center
              justify-center
              rounded-full
              text-slate-200
              transition
              hover:bg-white/10
            "
          >
            <RotateCcw className="size-5" />

            <span
              className="
                absolute
                text-[7px]
                font-bold
              "
            >
              10
            </span>
          </button>

          {/* PLAY */}

          <button
            type="button"
            onClick={() =>
              void togglePlay()
            }
            aria-label={
              isPlaying
                ? "Pause"
                : "Lecture"
            }
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-full
              bg-white
              text-indigo-600
              shadow-lg
              shadow-black/20
              transition
              hover:scale-105
              active:scale-95
            "
          >
            {isPlaying ? (
              <Pause className="size-6 fill-current" />
            ) : (
              <Play className="ml-1 size-6 fill-current" />
            )}
          </button>

          {/* FORWARD */}

          <button
            type="button"
            onClick={forward}
            aria-label="Avancer de 10 secondes"
            className="
              relative
              flex
              size-10
              items-center
              justify-center
              rounded-full
              text-slate-200
              transition
              hover:bg-white/10
            "
          >
            <RotateCw className="size-5" />

            <span
              className="
                absolute
                text-[7px]
                font-bold
              "
            >
              10
            </span>
          </button>

          {/* VOLUME */}

          <div className="ml-1 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={
                isMuted
                  ? "Activer le son"
                  : "Couper le son"
              }
              className="text-slate-300 transition hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={
                isMuted
                  ? 0
                  : volume
              }
              onChange={
                handleVolume
              }
              className="
                h-1
                w-24
                cursor-pointer
                accent-indigo-400
              "
            />
          </div>
        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="w-10 text-xs text-slate-300">
              {formatTime(
                currentTime,
              )}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={
                handleSeek
              }
              onMouseDown={() =>
                setIsSeeking(true)
              }
              onMouseUp={() =>
                setIsSeeking(false)
              }
              onTouchStart={() =>
                setIsSeeking(true)
              }
              onTouchEnd={() =>
                setIsSeeking(false)
              }
              className="
                h-1.5
                flex-1
                cursor-pointer
                accent-indigo-400
              "
              style={{
                accentColor:
                  "#818cf8",
              }}
            />

            <span className="w-10 text-right text-xs text-slate-300">
              {formatTime(
                duration,
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GENERATION PROGRESS
============================================================ */

function GenerationProgress({
  status,
  progress,
  currentStep,
}: {
  status: string;
  progress: number;
  currentStep: string | null;
}) {
  const steps = [
    {
      label: "Préparation",
      min: 0,
    },
    {
      label: "Préparation du texte",
      min: 15,
    },
    {
      label: "Génération audio",
      min: 40,
    },
    {
      label: "Traitement audio",
      min: 60,
    },
    {
      label: "Upload",
      min: 80,
    },
    {
      label: "Finalisation",
      min: 95,
    },
  ];

  function isStepCompleted(
    index: number,
  ) {
    const nextStep =
      steps[index + 1];

    if (!nextStep) {
      return progress >= 100;
    }

    return progress >= nextStep.min;
  }

  function isCurrentStep(
    index: number,
  ) {
    const current =
      steps[index];

    if (typeof current === "undefined") {
      return false;
    }

    const next =
      steps[index + 1];

    if (typeof next === "undefined") {
      return progress >= current.min;
    }

    return (
      progress >= current.min &&
      progress < next.min
    );
  }

  return (
    <section
      className="
        mb-6
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* HEADER */}

      <div className="flex items-start gap-4">
        <div
          className="
            flex
            size-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-sky-50
            dark:bg-sky-950/40
          "
        >
          <Loader2
            className="
              size-6
              animate-spin
              text-sky-600
              dark:text-sky-400
            "
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                {status === "PENDING"
                  ? "Génération en attente"
                  : "Génération en cours"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {currentStep ??
                  "Préparation..."}
              </p>
            </div>

            <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
              {progress}%
            </span>
          </div>

          {/* PROGRESS BAR */}

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-sky-500
                to-indigo-500
                transition-all
                duration-300
                ease-out
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* STEPS */}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map(
          (step, index) => {
            const completed =
              isStepCompleted(index);

            const current =
              isCurrentStep(index);

            return (
              <div
                key={step.label}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-slate-50
                  px-4
                  py-3
                  dark:bg-slate-950
                "
              >
                <div
                  className={`
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                      completed
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : current
                          ? "bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
                          : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    }
                  `}
                >
                  {completed ? (
                    <CheckCircle2 className="size-4" />
                  ) : current ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <span className="size-2 rounded-full bg-current" />
                  )}
                </div>

                <span
                  className={`
                    text-sm
                    font-medium
                    ${
                      completed ||
                      current
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}

/* ============================================================
   STATUS
============================================================ */

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

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
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
        {icon}

        {label}
      </div>

      <p
        className="
          mt-2
          font-semibold
          text-slate-900
          dark:text-slate-100
        "
      >
        {value}
      </p>
    </div>
  );
}