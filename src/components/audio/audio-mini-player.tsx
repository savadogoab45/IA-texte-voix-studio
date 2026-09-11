"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useId } from "react";

interface AudioMiniPlayerProps {
  src: string;
  className?: string;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
};


const WAVEFORM_BARS = [
  8, 13, 20, 11, 17, 24, 14, 21, 27, 16, 23, 12, 19, 26, 15,
  22, 10, 18, 25, 13, 21, 16, 24, 11, 19, 15, 23, 12, 20, 17,
  25, 14, 21, 10, 18, 24, 13, 20, 16, 23, 11, 19, 25, 14, 21,
  17, 24, 12, 20, 15, 22, 10, 18, 25, 14, 21, 16, 23, 12, 19,
];

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.1, 1.15, 1.25, 1.5, 2];

export function AudioMiniPlayer({
  src,
  className = "",
}: AudioMiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const previousVolumeRef = useRef(1);
  const controlId = useId();

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      if (!audio.duration) {
        setProgress(0);
        return;
      }

      setProgress(
        Math.min(
          100,
          Math.max(0, (audio.currentTime / audio.duration) * 100),
        ),
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Impossible de lire l'audio :", error);
    }
  }

  function toggleMute() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolumeRef.current || 1;
      setVolume(audio.volume);
      setIsMuted(false);
      return;
    }

    previousVolumeRef.current = audio.volume;
    audio.muted = true;
    setIsMuted(true);
  }

  function handleVolumeChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const nextVolume = Number(event.target.value);
    const audio = audioRef.current;

    setVolume(nextVolume);

    if (!audio) {
      return;
    }

    audio.volume = nextVolume;
    audio.muted = nextVolume === 0;
    setIsMuted(nextVolume === 0);

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }
  }

  function handlePlaybackRateChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const rate = Number(event.target.value);
    const audio = audioRef.current;

    setPlaybackRate(rate);

    if (audio) {
      audio.playbackRate = rate;
    }
  }

  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;

    if (!audio?.duration) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );

    audio.currentTime = position * audio.duration;
    setProgress(position * 100);
  }

  return (
    <div
      className={`flex h-12 w-full max-w-125 dark:bg-transparent dark:border-[#244166] items-center gap-3 rounded-full border border-slate-200  px-2.5 shadow-sm ${className}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={() => void togglePlay()}
        aria-label={isPlaying ? "Mettre en pause" : "Lire l'audio"}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sky-600 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-105 hover:bg-sky-50 active:scale-95"
      >
        {isPlaying ? (
          <Pause className="size-3.5 fill-current" />
        ) : (
          <Play className="ml-0.5 size-3.5 fill-current" />
        )}
      </button>

      <div
        onClick={handleSeek}
        className="relative flex h-7 min-w-0 flex-1 cursor-pointer items-center overflow-hidden"
      >
        <Waveform progress={progress} />
      </div>

      <label className="sr-only" htmlFor={`${controlId}-playback-rate`}>
        Vitesse de lecture
      </label>
      <select
        id={`${controlId}-playback-rate`}
        value={playbackRate}
        onChange={handlePlaybackRateChange}
        aria-label="Vitesse de lecture"
        className="h-7 w-12 shrink-0 cursor-pointer rounded-md border-0 bg-transparent px-0 text-center text-xs font-medium text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {PLAYBACK_RATES.map((rate) => (
          <option key={rate} value={rate}>
            {rate}x
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor={`${controlId}-volume`}>
        Volume
      </label>
      <input
        id={`${controlId}-volume`}
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Volume"
        className="h-1 w-10 shrink-0 cursor-pointer accent-sky-500"
      />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </button>
    </div>
  );
}

function Waveform({ progress }: { progress: number }) {
  return (
    <div className="flex h-full w-full items-center justify-between gap-0">
      {WAVEFORM_BARS.map((height, index) => (
        <span
          key={index}
          className={`block w-0.5 shrink-0 rounded-full transition-colors ${
            (index / WAVEFORM_BARS.length) * 100 < progress
              ? "bg-sky-400"
              : " bg-slate-300 dark:bg-slate-600"
          }`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}
